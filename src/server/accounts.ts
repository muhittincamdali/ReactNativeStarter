/**
 * Accounts: sign-up, sign-in, sign-out and request authentication.
 *
 * @module
 */
import type { z } from 'zod';

import type { signInSchema, signUpSchema, Session, User } from '@/shared/schemas';

import { bearerToken, HttpError } from './http';
import { DEFAULT_ITERATIONS, hashPassword, verifyPassword } from './passwords';
import type { AttemptLimiter } from './rate-limit';
import type { SessionStore } from './sessions';

interface StoredUser extends User {
  passwordHash: string;
}

/** Options of {@link AccountService}. */
export interface AccountServiceOptions {
  sessions: SessionStore;
  limiter: AttemptLimiter;
  maxUsers: number;
  /** PBKDF2 iterations; tests lower it to keep the suite fast. */
  iterations?: number;
  newId?: () => string;
}

/** Accounts kept in memory, with hashed passwords and opaque session tokens. */
export class AccountService {
  private readonly users = new Map<string, StoredUser>();
  private readonly idsByEmail = new Map<string, string>();
  private readonly iterations: number;
  private readonly newId: () => string;
  // Hash checked when an e-mail address is unknown, so a wrong address takes as long to reject
  // as a wrong password and the timing does not reveal which addresses have accounts.
  private decoyHash: Promise<string> | null = null;

  constructor(private readonly options: AccountServiceOptions) {
    this.iterations = options.iterations ?? DEFAULT_ITERATIONS;
    this.newId = options.newId ?? (() => crypto.randomUUID());
  }

  /** Creates an account and signs it in. */
  async signUp(input: z.output<typeof signUpSchema>): Promise<Session> {
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

  /** Signs in with an e-mail address and a password. */
  async signIn(input: z.output<typeof signInSchema>): Promise<Session> {
    const retryAfterMs = this.options.limiter.retryAfter(input.email);
    if (retryAfterMs > 0) {
      throw new HttpError(
        429,
        'too_many_attempts',
        'Too many failed sign-ins. Try again later.',
        undefined,
        {
          'Retry-After': String(Math.ceil(retryAfterMs / 1000)),
        },
      );
    }
    const id = this.idsByEmail.get(input.email);
    const user = id === undefined ? undefined : this.users.get(id);
    // The attempt counts as a failure before the hash is checked, so parallel requests cannot all
    // pass the limit while the first ones are still hashing; a correct password clears it.
    this.options.limiter.record(input.email);
    const valid = await verifyPassword(input.password, user?.passwordHash ?? (await this.decoy()));
    if (!user || !valid) {
      throw new HttpError(
        401,
        'invalid_credentials',
        'The e-mail address or the password is wrong.',
      );
    }
    this.options.limiter.reset(input.email);
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
