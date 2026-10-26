/**
 * Counts failed attempts per key (an e-mail address) in a fixed window.
 *
 * The table is bounded: expired entries are removed before a new key is added, and when it is
 * still full the oldest key is dropped. Dropping an entry can only let an attacker try again
 * sooner; it never blocks someone who should not be blocked.
 *
 * @module
 */

/** Options of {@link FailureLimiter}. */
export interface FailureLimiterOptions {
  /** Failures allowed in one window. */
  maxFailures: number;
  /** Window length in milliseconds, counted from the first failure. */
  windowMs: number;
  /** Keys tracked at once. */
  maxKeys: number;
  /** Clock, injectable for tests. */
  now?: () => number;
}

interface Entry {
  failures: number;
  windowStart: number;
}

/** Fixed-window failure counter with a bounded number of keys. */
export class FailureLimiter {
  private readonly entries = new Map<string, Entry>();
  private readonly now: () => number;

  constructor(private readonly options: FailureLimiterOptions) {
    this.now = options.now ?? Date.now;
  }

  /** Milliseconds until `key` may try again, or `0` when it may try now. */
  retryAfter(key: string): number {
    const entry = this.entries.get(key);
    if (!entry) return 0;
    const elapsed = this.now() - entry.windowStart;
    if (elapsed >= this.options.windowMs) {
      this.entries.delete(key);
      return 0;
    }
    return entry.failures >= this.options.maxFailures ? this.options.windowMs - elapsed : 0;
  }

  /** Records one failure for `key`. */
  recordFailure(key: string): void {
    const now = this.now();
    const entry = this.entries.get(key);
    if (entry && now - entry.windowStart < this.options.windowMs) {
      entry.failures += 1;
      return;
    }
    this.entries.delete(key);
    this.makeRoom(now);
    this.entries.set(key, { failures: 1, windowStart: now });
  }

  /** Forgets `key`, for example after a successful sign-in. */
  reset(key: string): void {
    this.entries.delete(key);
  }

  /** Keys currently tracked. */
  get size(): number {
    return this.entries.size;
  }

  private makeRoom(now: number): void {
    if (this.entries.size < this.options.maxKeys) return;
    for (const [key, entry] of this.entries) {
      if (now - entry.windowStart >= this.options.windowMs) this.entries.delete(key);
    }
    while (this.entries.size >= this.options.maxKeys) {
      const oldest = this.entries.keys().next();
      if (oldest.done) break;
      this.entries.delete(oldest.value);
    }
  }
}
