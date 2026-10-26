/**
 * Counts attempts per key (a client address, an e-mail address or both) in a fixed window.
 *
 * The table is bounded, and a full table neither refuses new keys nor forgets a locked key (one
 * that reached `maxAttempts`). It makes room by dropping the entry with the fewest attempts, the
 * oldest first, among the keys still below the limit. Refusing new keys would let anyone lock
 * everybody out by filling the table; dropping a locked key would let anyone clear a lock the
 * same way.
 *
 * Only when every entry is locked is a new key left uncounted. {@link AttemptLimiter.record}
 * answers `false` then, and the caller slows that attempt down instead of refusing it
 * (`src/server/auth-limiter.ts`).
 *
 * @module
 */

/** Options of {@link AttemptLimiter}. */
export interface AttemptLimiterOptions {
  /** Attempts allowed in one window; `Infinity` counts without ever locking. */
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

/** Fixed-window attempt counter with a bounded number of keys that never fails closed. */
export class AttemptLimiter {
  // A Map iterates in insertion order and an entry is inserted again only when its window
  // restarts, so the first entries always have the oldest windows.
  private readonly entries = new Map<string, Entry>();
  private readonly now: () => number;

  constructor(private readonly options: AttemptLimiterOptions) {
    this.now = options.now ?? Date.now;
  }

  /** Milliseconds until `key` may try again, or `0` when it may try now. */
  retryAfter(key: string): number {
    const now = this.now();
    this.removeExpired(now);
    const entry = this.entries.get(key);
    if (!entry || entry.attempts < this.options.maxAttempts) return 0;
    return this.options.windowMs - (now - entry.windowStart);
  }

  /** Attempts counted for `key` in its current window. */
  attempts(key: string): number {
    this.removeExpired(this.now());
    return this.entries.get(key)?.attempts ?? 0;
  }

  /**
   * Counts one attempt for `key`. Returns `false`, and counts nothing, only when the key is new
   * and every key in the full table is locked.
   */
  record(key: string): boolean {
    const now = this.now();
    this.removeExpired(now);
    const entry = this.entries.get(key);
    if (entry) {
      entry.attempts += 1;
      return true;
    }
    if (this.entries.size >= this.options.maxKeys && !this.dropLeastCounted()) return false;
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

  // Drops the unlocked entry with the fewest attempts, the oldest of them when several tie.
  // Returns false when every entry is locked.
  private dropLeastCounted(): boolean {
    let victim: string | undefined;
    let fewest = this.options.maxAttempts;
    for (const [key, entry] of this.entries) {
      if (entry.attempts >= fewest) continue;
      victim = key;
      fewest = entry.attempts;
      // No entry has fewer than one attempt, so the oldest with one is the answer.
      if (fewest === 1) break;
    }
    if (victim === undefined) return false;
    this.entries.delete(victim);
    return true;
  }

  // Stops at the first live entry: every later one started its window after it.
  private removeExpired(now: number): void {
    for (const [key, entry] of this.entries) {
      if (now - entry.windowStart < this.options.windowMs) return;
      this.entries.delete(key);
    }
  }
}
