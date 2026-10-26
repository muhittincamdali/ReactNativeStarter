/**
 * The one limiter in front of sign-in and sign-up, and so of every session the server starts.
 *
 * An attempt passes these layers, all counted in one window:
 *
 * 1. **Address.** Attempts per network (an IPv6 /48) and per client (an IPv4 address or an IPv6
 *    /64), then `429`. One source can neither try without end nor fill the tables below.
 * 2. **Pair.** Failures per pair of client and subject (an e-mail address), then `429` for that
 *    pair only, so other clients, the account's owner among them, are not affected.
 * 3. **Subject.** Attempts for one subject are checked one at a time, in a queue, and failures
 *    from all clients together make each further attempt wait ({@link attemptDelayMs}). Past
 *    `maxFailuresPerSubject` they get `429`, except from a client that signed in to the account
 *    before (`trusted`), which skips this layer and keeps only the limits above.
 *
 * Nothing here refuses everybody. A full table makes room from keys that are not locked
 * (`src/server/rate-limit.ts`); an attempt it still cannot count, and an attempt without a client
 * address, is slowed down by the delay, never refused.
 *
 * @module
 */
import {
  MAX_SIGN_IN_DELAY_MS,
  SIGN_IN_DELAY_BASE_MS,
  SIGN_IN_FAILURES_BEFORE_DELAY,
} from '@/shared/limits';

import type { ClientAddress } from './client-address';
import { HttpError } from './http';
import { AttemptLimiter } from './rate-limit';

/**
 * Delay before an attempt that already has `earlier` attempts counted against it in the window:
 * none for the first {@link SIGN_IN_FAILURES_BEFORE_DELAY}, then doubling from
 * {@link SIGN_IN_DELAY_BASE_MS} up to {@link MAX_SIGN_IN_DELAY_MS}.
 */
export function attemptDelayMs(earlier: number): number {
  const extra = earlier - SIGN_IN_FAILURES_BEFORE_DELAY;
  if (extra < 0) return 0;
  return Math.min(MAX_SIGN_IN_DELAY_MS, SIGN_IN_DELAY_BASE_MS * 2 ** extra);
}

/** A `429 too_many_attempts` answer with `Retry-After` in whole seconds. */
export function tooManyAttempts(
  retryAfterMs: number,
  message = 'Too many attempts. Try again later.',
): HttpError {
  return new HttpError(429, 'too_many_attempts', message, undefined, {
    'Retry-After': String(Math.max(1, Math.ceil(retryAfterMs / 1000))),
  });
}

/** Options of {@link AuthLimiter}. */
export interface AuthLimiterOptions {
  windowMs: number;
  /** Keys each table tracks at once. */
  maxKeys: number;
  /** Attempts per client in a window. */
  maxPerClient: number;
  /** Attempts per network in a window; set it above `maxPerClient`. */
  maxPerNetwork: number;
  /** Failures per pair of client and subject in a window. */
  maxFailuresPerPair?: number;
  /** Failures per subject from all clients that are not trusted, in a window. */
  maxFailuresPerSubject?: number;
  /** Attempts for one subject that may run or wait at once; more get `429` right away. */
  maxPendingPerSubject?: number;
  now?: () => number;
  /** Waits before a slowed-down attempt; tests replace it to record the delays. */
  sleep?: (ms: number) => Promise<void>;
}

/** One attempt to pass through an {@link AuthLimiter}. */
export interface AuthAttempt {
  /** Where the request comes from; `null` when the server in front did not say. */
  address: ClientAddress | null;
  /** The e-mail address tried, for sign-in. */
  subject?: string;
  /** The client signed in to the subject's account before. */
  trusted?: boolean;
}

// Runs the jobs of one key one after another, and knows how many are running or waiting.
class SerialQueue {
  private readonly slots = new Map<string, { tail: Promise<void>; size: number }>();

  size(key: string): number {
    return this.slots.get(key)?.size ?? 0;
  }

  run<T>(key: string, job: () => Promise<T>): Promise<T> {
    let slot = this.slots.get(key);
    if (!slot) {
      slot = { tail: Promise.resolve(), size: 0 };
      this.slots.set(key, slot);
    }
    const current = slot;
    current.size += 1;
    const result = current.tail.then(job);
    const settle = () => {
      current.size -= 1;
      if (current.size === 0) this.slots.delete(key);
    };
    current.tail = result.then(settle, settle);
    return result;
  }
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Requests without an address count together, but only to set their delay.
const UNKNOWN = 'unknown';

/** Layered attempt limits for sign-in and sign-up; see the module description. */
export class AuthLimiter {
  private readonly networks: AttemptLimiter;
  private readonly clients: AttemptLimiter;
  private readonly unknown: AttemptLimiter;
  private readonly pairs: AttemptLimiter;
  private readonly subjects: AttemptLimiter;
  private readonly queue = new SerialQueue();
  private readonly maxPendingPerSubject: number;
  private readonly sleep: (ms: number) => Promise<void>;

  constructor(options: AuthLimiterOptions) {
    const table = (maxAttempts: number, maxKeys = options.maxKeys) =>
      new AttemptLimiter({ maxAttempts, maxKeys, windowMs: options.windowMs, now: options.now });
    this.networks = table(options.maxPerNetwork);
    this.clients = table(options.maxPerClient);
    this.unknown = table(Number.POSITIVE_INFINITY, 1);
    this.pairs = table(options.maxFailuresPerPair ?? Number.POSITIVE_INFINITY);
    this.subjects = table(options.maxFailuresPerSubject ?? Number.POSITIVE_INFINITY);
    this.maxPendingPerSubject = options.maxPendingPerSubject ?? Number.POSITIVE_INFINITY;
    this.sleep = options.sleep ?? wait;
  }

  /**
   * Runs `check` if the limits let `attempt` through, and throws `429` otherwise. `check` throws
   * when the attempt fails; when it returns, the pair's and the subject's failures are cleared.
   */
  async run<T>(attempt: AuthAttempt, check: () => Promise<T>): Promise<T> {
    const { address, subject } = attempt;
    const pair = address && subject !== undefined ? `${address.client} ${subject}` : undefined;
    const queued = subject !== undefined && !attempt.trusted ? subject : undefined;
    // Everything up to the first await runs at once, so parallel requests see each other's
    // counts. An attempt refused here is not counted.
    this.refuseIfLimited(address, pair, queued);
    const addressDelayMs = this.count(address, pair);
    const finish = async () => {
      const result = await check();
      if (pair !== undefined) this.pairs.reset(pair);
      if (subject !== undefined) this.subjects.reset(subject);
      return result;
    };
    if (queued === undefined) {
      await this.pause(addressDelayMs);
      return finish();
    }
    return this.queue.run(queued, async () => {
      const retryAfterMs = this.subjects.retryAfter(queued);
      if (retryAfterMs > 0) {
        throw tooManyAttempts(
          retryAfterMs,
          'Too many failed sign-ins for this account. Sign in from a device you used before, or try later.',
        );
      }
      const earlier = this.subjects.attempts(queued);
      const subjectDelayMs = this.subjects.record(queued)
        ? attemptDelayMs(earlier)
        : MAX_SIGN_IN_DELAY_MS;
      await this.pause(Math.max(addressDelayMs, subjectDelayMs));
      return finish();
    });
  }

  private refuseIfLimited(
    address: ClientAddress | null,
    pair: string | undefined,
    queued: string | undefined,
  ): void {
    if (address) {
      const retryAfterMs = Math.max(
        this.networks.retryAfter(address.network),
        this.clients.retryAfter(address.client),
        pair === undefined ? 0 : this.pairs.retryAfter(pair),
      );
      if (retryAfterMs > 0) throw tooManyAttempts(retryAfterMs);
    }
    if (queued !== undefined && this.queue.size(queued) >= this.maxPendingPerSubject) {
      throw tooManyAttempts(MAX_SIGN_IN_DELAY_MS);
    }
  }

  // Counts the attempt in the address and pair tables and returns the delay it gets there: none,
  // unless a table could not count it or the address is unknown.
  private count(address: ClientAddress | null, pair: string | undefined): number {
    if (!address) {
      const earlier = this.unknown.attempts(UNKNOWN);
      this.unknown.record(UNKNOWN);
      return attemptDelayMs(earlier);
    }
    let counted = address.network === address.client || this.networks.record(address.network);
    counted = this.clients.record(address.client) && counted;
    if (pair !== undefined) counted = this.pairs.record(pair) && counted;
    return counted ? 0 : MAX_SIGN_IN_DELAY_MS;
  }

  private async pause(ms: number): Promise<void> {
    if (ms > 0) await this.sleep(ms);
  }
}
