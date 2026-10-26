/**
 * Opaque session tokens.
 *
 * A token is 32 random bytes; the server keeps only its SHA-256, so the session table cannot be
 * replayed if it is read. Sessions expire after a fixed time. An account keeps at most
 * `maxPerUser` of them, and a new one replaces that account's oldest. The table keeps at most
 * `maxTotal`; when it is full of live sessions, a new one is refused with `503 capacity`, so
 * nobody can sign other people out by opening many sessions.
 *
 * @module
 */
import { randomToken, sha256 } from './crypto';
import { HttpError } from './http';

/** Options of {@link SessionStore}. */
export interface SessionStoreOptions {
  ttlMs: number;
  maxPerUser: number;
  /** Set it to at least the number of accounts times `maxPerUser`, so it is never reached. */
  maxTotal: number;
  now?: () => number;
}

interface SessionEntry {
  userId: string;
  expiresAt: number;
}

/** In-memory session table keyed by token hash. */
export class SessionStore {
  // Every session lives for the same time, so the Map's insertion order is also the order in
  // which sessions expire, and the oldest are first.
  private readonly sessions = new Map<string, SessionEntry>();
  // Token hashes of each account, oldest first; at most maxPerUser each.
  private readonly keysByUser = new Map<string, string[]>();
  private readonly now: () => number;

  constructor(private readonly options: SessionStoreOptions) {
    this.now = options.now ?? Date.now;
  }

  /** Starts a session and returns its token. The token is not stored. */
  async create(userId: string): Promise<string> {
    const token = randomToken();
    const key = await sha256(token);
    // Everything below runs without an await, so parallel calls cannot pass the limits together.
    const now = this.now();
    this.removeExpired(now);
    const own = this.keysByUser.get(userId) ?? [];
    while (own.length >= this.options.maxPerUser) {
      const oldest = own.shift();
      if (oldest !== undefined) this.sessions.delete(oldest);
    }
    if (this.sessions.size >= this.options.maxTotal) {
      throw new HttpError(503, 'capacity', 'The server cannot start more sessions.');
    }
    this.sessions.set(key, { userId, expiresAt: now + this.options.ttlMs });
    own.push(key);
    this.keysByUser.set(userId, own);
    return token;
  }

  /** The account of a valid token, or `null`. An expired session is removed. */
  async resolve(token: string): Promise<string | null> {
    const key = await sha256(token);
    const entry = this.sessions.get(key);
    if (!entry) return null;
    if (entry.expiresAt <= this.now()) {
      this.remove(key, entry);
      return null;
    }
    return entry.userId;
  }

  /** Ends one session. Ending an unknown token does nothing. */
  async revoke(token: string): Promise<void> {
    const key = await sha256(token);
    const entry = this.sessions.get(key);
    if (entry) this.remove(key, entry);
  }

  /** Sessions in the table, expired ones included until they are removed. */
  get size(): number {
    return this.sessions.size;
  }

  private remove(key: string, entry: SessionEntry): void {
    this.sessions.delete(key);
    const own = this.keysByUser.get(entry.userId);
    if (!own) return;
    const index = own.indexOf(key);
    if (index !== -1) own.splice(index, 1);
    if (own.length === 0) this.keysByUser.delete(entry.userId);
  }

  // Stops at the first live session: every later one expires after it.
  private removeExpired(now: number): void {
    for (const [key, entry] of this.sessions) {
      if (entry.expiresAt > now) return;
      this.remove(key, entry);
    }
  }
}
