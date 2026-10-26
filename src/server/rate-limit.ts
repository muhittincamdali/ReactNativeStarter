/**
 * Counts attempts per key (a client address, an e-mail address or both) in a fixed window.
 *
 * The table is bounded, and a key that is still counting is never dropped to make room: only
 * entries whose window has ended are removed. When every tracked key is still counting, a new key
 * is refused until the oldest window ends ({@link AttemptLimiter.retryAfter} answers more than
 * `0`). Dropping a live entry instead would let anyone clear a lock by sending many new keys.
 *
 * @module
 */

/** Options of {@link AttemptLimiter}. */
export interface AttemptLimiterOptions {
  /** Attempts allowed in one window. */
  maxAttempts: number;
  /** Window length in milliseconds, counted from the first attempt. */
  windowMs: number;
  /** Keys tracked at once. */
  maxKeys: number;
  /** Clock, injectable for tests. */
  now?: () => number;
}

interface Entry {
  attempts: number;
  windowStart: number;
}

/** Fixed-window attempt counter with a bounded number of keys that fails closed when full. */
export class AttemptLimiter {
  // A Map iterates in insertion order and an entry is inserted again only when its window
  // restarts, so the first entries always have the oldest windows.
  private readonly entries = new Map<string, Entry>();
  private readonly now: () => number;

  constructor(private readonly options: AttemptLimiterOptions) {
    this.now = options.now ?? Date.now;
  }

  /**
   * Milliseconds until `key` may try again, or `0` when it may try now. A key that is not tracked
   * while the table is full of live entries waits for the oldest window to end.
   */
  retryAfter(key: string): number {
    const now = this.now();
    this.removeExpired(now);
    const entry = this.entries.get(key);
    if (entry) {
      if (entry.attempts < this.options.maxAttempts) return 0;
      return this.options.windowMs - (now - entry.windowStart);
    }
    return this.isFull ? this.untilOldestExpires(now) : 0;
  }

  /** Attempts counted for `key` in its current window. */
  attempts(key: string): number {
    this.removeExpired(this.now());
    return this.entries.get(key)?.attempts ?? 0;
  }

  /**
   * Counts one attempt for `key`. Returns `false`, and counts nothing, when the key is new and the
   * table is full of live entries.
   */
  record(key: string): boolean {
    const now = this.now();
    this.removeExpired(now);
    const entry = this.entries.get(key);
    if (entry) {
      entry.attempts += 1;
      return true;
    }
    if (this.isFull) return false;
    this.entries.set(key, { attempts: 1, windowStart: now });
    return true;
  }

  /** Forgets `key`, for example after a successful sign-in. */
  reset(key: string): void {
    this.entries.delete(key);
  }

  /** Keys currently tracked, expired ones included until the next call removes them. */
  get size(): number {
    return this.entries.size;
  }

  private get isFull(): boolean {
    return this.entries.size >= this.options.maxKeys;
  }

  private untilOldestExpires(now: number): number {
    const oldest = this.entries.values().next();
    if (oldest.done) return 0;
    return Math.max(1, this.options.windowMs - (now - oldest.value.windowStart));
  }

  // Stops at the first live entry: every later one started its window after it.
  private removeExpired(now: number): void {
    for (const [key, entry] of this.entries) {
      if (now - entry.windowStart < this.options.windowMs) return;
      this.entries.delete(key);
    }
  }
}
