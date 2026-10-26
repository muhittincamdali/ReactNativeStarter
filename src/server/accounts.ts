/**
 * Accounts: sign-up, sign-in, sign-out and request authentication.
 *
 * @module
 */
import type { z } from 'zod';

import {
  MAX_SIGN_IN_DELAY_MS,
  SIGN_IN_DELAY_BASE_MS,
  SIGN_IN_FAILURES_BEFORE_DELAY,
} from '@/shared/limits';
import type { signInSchema, signUpSchema, Session, User } from '@/shared/schemas';

import { bearerToken, HttpError } from './http';
import { DEFAULT_ITERATIONS, hashPassword, verifyPassword } from './passwords';
import type { AttemptLimiter } from './rate-limit';
import type { SessionStore } from './sessions';

interface StoredUser extends User {
  passwordHash: string;
}

/** The attempt counters sign-in uses; see {@link AccountService.signIn}. */
export interface SignInLimits {
  /** Every sign-in attempt per client address, successful or not. */
  clients: AttemptLimiter;
  /** Failed sign-ins per pair of client address and e-mail address. */
  pairs: AttemptLimiter;
  /** Failed sign-ins per e-mail address from any client; they slow sign-in down, never block it. */
  accounts: AttemptLimiter;
}

/** Options of {@link AccountService}. */
export interface AccountServiceOptions {
  sessions: SessionStore;
  signInLimits: SignInLimits;
  /** Every sign-up attempt per client address. */
  signUpLimiter: AttemptLimiter;
  maxUsers: number;
  /** PBKDF2 iterations; tests lower it to keep the suite fast. */
  iterations?: number;
  newId?: () => string;
  /** Waits before a password is checked; tests replace it to record the delays. */
  sleep?: (ms: number) => Promise<void>;
}

/**
 * Delay before the password is checked, for an e-mail address that already has `failures` failed
 * sign-ins in the current window: none for the first {@link SIGN_IN_FAILURES_BEFORE_DELAY}, then
 * doubling from {@link SIGN_IN_DELAY_BASE_MS} up to {@link MAX_SIGN_IN_DELAY_MS}.
 */
export function signInDelayMs(failures: number): number {
  const extra = failures - SIGN_IN_FAILURES_BEFORE_DELAY;
  if (extra < 0) return 0;
  return Math.min(MAX_SIGN_IN_DELAY_MS, SIGN_IN_DELAY_BASE_MS * 2 ** extra);
}

function tooManyAttempts(retryAfterMs: number): HttpError {
  return new HttpError(429, 'too_many_attempts', 'Too many attempts. Try again later.', undefined, {
    'Retry-After': String(Math.ceil(retryAfterMs / 1000)),
  });
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Accounts kept in memory, with hashed passwords and opaque session tokens. */
export class AccountService {
  private readonly users = new Map<string, StoredUser>();
  private readonly idsByEmail = new Map<string, string>();
  private readonly iterations: number;
  private readonly newId: () => string;
  private readonly sleep: (ms: number) => Promise<void>;
  // Hash checked when an e-mail address is unknown, so a wrong address takes as long to reject
  // as a wrong password and the timing does not reveal which addresses have accounts.
  private decoyHash: Promise<string> | null = null;

  constructor(private readonly options: AccountServiceOptions) {
    this.iterations = options.iterations ?? DEFAULT_ITERATIONS;
    this.newId = options.newId ?? (() => crypto.randomUUID());
    this.sleep = options.sleep ?? wait;
  }

  /**
   * Creates an account and signs it in, for the client `client` (see `clientKey`). A client gets
   * `429` after `MAX_SIGN_UPS_PER_CLIENT` attempts in a window, so one client cannot fill the
   * account table.
   */
  async signUp(input: z.output<typeof signUpSchema>, client: string): Promise<Session> {
    const { signUpLimiter } = this.options;
    const retryAfterMs = signUpLimiter.retryAfter(client);
    if (retryAfterMs > 0) throw tooManyAttempts(retryAfterMs);
    signUpLimiter.record(client);
    if (this.idsByEmail.has(input.email)) {
      throw new HttpError(409, 'email_taken', 'An account with this e-mail address exists.', {
        email: 'validation.emailTaken',
      });
    }
    if (this.users.size >= this.options.maxUsers) {
      throw new HttpError(503, 'capacity', 'The server cannot create more accounts.');
    }
    const passwordHash = await hashPassword(input.password, this.iterations);
    // Checked again: another sign-up for the same address may have finished while hashing.
    if (this.idsByEmail.has(input.email)) {
      throw new HttpError(409, 'email_taken', 'An account with this e-mail address exists.', {
        email: 'validation.emailTaken',
      });
    }
    const user: StoredUser = {
      id: this.newId(),
      name: input.name,
      email: input.email,
      passwordHash,
    };
    this.users.set(user.id, user);
    this.idsByEmail.set(user.email, user.id);
    return { token: await this.options.sessions.create(user.id), user: publicUser(user) };
  }

  /**
   * Signs in with an e-mail address and a password, for the client `client` (see `clientKey`).
   *
   * - A client gets `429` after `MAX_SIGN_IN_ATTEMPTS_PER_CLIENT` attempts in a window,
   *   whatever addresses it tries.
   * - A client gets `429` for one address after the allowed failures for that address. Other
   *   clients, the account's owner among them, are not affected.
   * - Failures for one address from all clients together only slow its sign-ins down
   *   ({@link signInDelayMs}), so nobody can lock another person out of their account.
   */
  async signIn(input: z.output<typeof signInSchema>, client: string): Promise<Session> {
    const { clients, pairs, accounts } = this.options.signInLimits;
    const pair = `${client} ${input.email}`;
    const retryAfterMs = Math.max(clients.retryAfter(client), pairs.retryAfter(pair));
    if (retryAfterMs > 0) throw tooManyAttempts(retryAfterMs);
    // Counted before the hash is checked, so parallel requests cannot all pass the limits while
    // the first ones are still hashing; a correct password clears the failure counts.
    clients.record(client);
    pairs.record(pair);
    const earlierFailures = accounts.attempts(input.email);
    // A full table cannot count this address, so it gets the longest delay rather than none.
    const delayMs = accounts.record(input.email)
      ? signInDelayMs(earlierFailures)
      : MAX_SIGN_IN_DELAY_MS;
    if (delayMs > 0) await this.sleep(delayMs);

    const id = this.idsByEmail.get(input.email);
    const user = id === undefined ? undefined : this.users.get(id);
    const valid = await verifyPassword(input.password, user?.passwordHash ?? (await this.decoy()));
    if (!user || !valid) {
      throw new HttpError(
        401,
        'invalid_credentials',
        'The e-mail address or the password is wrong.',
      );
    }
    pairs.reset(pair);
    accounts.reset(input.email);
    return { token: await this.options.sessions.create(user.id), user: publicUser(user) };
  }

  /** Ends the session of the request's token, if any. */
  async signOut(request: Request): Promise<void> {
    const token = bearerToken(request);
    if (token) await this.options.sessions.revoke(token);
  }

  /** The account of the request's `Authorization: Bearer` token; throws `401` otherwise. */
  async authenticate(request: Request): Promise<User> {
    const token = bearerToken(request);
    const id = token ? await this.options.sessions.resolve(token) : null;
    const user = id === null ? undefined : this.users.get(id);
    if (!user) throw new HttpError(401, 'unauthorized', 'Sign in to continue.');
    return publicUser(user);
  }

  private decoy(): Promise<string> {
    this.decoyHash ??= hashPassword(crypto.randomUUID(), this.iterations);
    return this.decoyHash;
  }
}

function publicUser({ id, name, email }: StoredUser): User {
  return { id, name, email };
}
