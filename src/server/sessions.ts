/**
 * Opaque session tokens.
 *
 * A token is 32 random bytes; the server keeps only its SHA-256, so the session table cannot be
 * replayed if it is read. Sessions expire after a fixed time, an account keeps at most
 * `maxPerUser` of them and the table at most `maxTotal`; the oldest is dropped first.
 *
 * @module
 */
import { randomToken, sha256 } from './crypto';

/** Options of {@link SessionStore}. */
export interface SessionStoreOptions {
  ttlMs: number;
  maxPerUser: number;
  maxTotal: number;
  now?: () => number;
}

interface SessionEntry {
  userId: string;
  expiresAt: number;
}

/** In-memory session table keyed by token hash. */
export class SessionStore {
  // Map keeps insertion order, so the first entries are the oldest sessions.
  private readonly sessions = new Map<string, SessionEntry>();
  private readonly now: () => number;

  constructor(private readonly options: SessionStoreOptions) {
    this.now = options.now ?? Date.now;
  }

  /** Starts a session and returns its token. The token is not stored. */
  async create(userId: string): Promise<string> {
    const token = randomToken();
    const now = this.now();
    this.removeExpired(now);
    this.limitUser(userId);
    while (this.sessions.size >= this.options.maxTotal) {
      const oldest = this.sessions.keys().next();
      if (oldest.done) break;
      this.sessions.delete(oldest.value);
    }
    this.sessions.set(await sha256(token), { userId, expiresAt: now + this.options.ttlMs });
    return token;
  }

  /** The account of a valid token, or `null`. An expired session is removed. */
  async resolve(token: string): Promise<string | null> {
    const key = await sha256(token);
    const entry = this.sessions.get(key);
    if (!entry) return null;
    if (entry.expiresAt <= this.now()) {
      this.sessions.delete(key);
      return null;
    }
    return entry.userId;
  }

  /** Ends one session. Ending an unknown token does nothing. */
  async revoke(token: string): Promise<void> {
    this.sessions.delete(await sha256(token));
  }

  /** Sessions in the table, expired ones included until they are removed. */
  get size(): number {
    return this.sessions.size;
  }

  private removeExpired(now: number): void {
    for (const [key, entry] of this.sessions) if (entry.expiresAt <= now) this.sessions.delete(key);
  }

  private limitUser(userId: string): void {
    const own = [...this.sessions].filter(([, entry]) => entry.userId === userId);
    for (let i = 0; i <= own.length - this.options.maxPerUser; i += 1) {
      const entry = own[i];
      if (entry) this.sessions.delete(entry[0]);
    }
  }
}
