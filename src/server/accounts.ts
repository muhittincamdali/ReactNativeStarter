/**
 * Accounts: sign-up, sign-in, sign-out and request authentication.
 *
 * @module
 */
import type { z } from 'zod';

import { MAX_KNOWN_CLIENTS_PER_USER } from '@/shared/limits';
import type { signInSchema, signUpSchema, Session, User } from '@/shared/schemas';

import type { AuthLimiter } from './auth-limiter';
import type { ClientAddress } from './client-address';
import { bearerToken, HttpError } from './http';
import { DEFAULT_ITERATIONS, hashPassword, verifyPassword } from './passwords';
import type { SessionStore } from './sessions';

interface StoredUser extends User {
  passwordHash: string;
  // Clients (see ClientAddress) this account signed up or signed in from, most recent last.
  knownClients: string[];
}

/** Options of {@link AccountService}. */
export interface AccountServiceOptions {
  sessions: SessionStore;
  /** Limits every sign-in, per client, per client and e-mail address, and per e-mail address. */
  signInLimiter: AuthLimiter;
  /** Limits every sign-up, per client. */
  signUpLimiter: AuthLimiter;
  maxUsers: number;
  /** PBKDF2 iterations; tests lower it to keep the suite fast. */
  iterations?: number;
  newId?: () => string;
}

/** Accounts kept in memory, with hashed passwords and opaque session tokens. */
export class AccountService {
  private readonly users = new Map<string, StoredUser>();
  private readonly idsByEmail = new Map<string, string>();
  // Addresses of sign-ups that are still hashing: each holds a slot of the account table.
  private readonly pendingEmails = new Set<string>();
  private readonly iterations: number;
  private readonly newId: () => string;
  // Hash checked when an e-mail address is unknown, so a wrong address takes as long to reject
  // as a wrong password and the timing does not reveal which addresses have accounts.
  private decoyHash: Promise<string> | null = null;

  constructor(private readonly options: AccountServiceOptions) {
    this.iterations = options.iterations ?? DEFAULT_ITERATIONS;
    this.newId = options.newId ?? (() => crypto.randomUUID());
  }

  /**
   * Creates an account and signs it in, for the client at `address` (see `clientAddress`). The
   * sign-up limiter answers `429` after `MAX_SIGN_UPS_PER_CLIENT` attempts from one client in a
   * window, so one client cannot fill the account table.
   */
  signUp(input: z.output<typeof signUpSchema>, address: ClientAddress | null): Promise<Session> {
    return this.options.signUpLimiter.run({ address }, async () => {
      // The address and the slot are taken before the first await, so parallel sign-ups can
      // neither create one address twice nor pass maxUsers together.
      if (this.idsByEmail.has(input.email) || this.pendingEmails.has(input.email)) {
        throw emailTaken();
      }
      if (this.users.size + this.pendingEmails.size >= this.options.maxUsers) {
        throw new HttpError(503, 'capacity', 'The server cannot create more accounts.');
      }
      this.pendingEmails.add(input.email);
      let user: StoredUser;
      try {
        user = {
          id: this.newId(),
          name: input.name,
          email: input.email,
          passwordHash: await hashPassword(input.password, this.iterations),
          knownClients: [],
        };
      } finally {
        this.pendingEmails.delete(input.email);
      }
      this.users.set(user.id, user);
      this.idsByEmail.set(user.email, user.id);
      return this.startSession(user, address);
    });
  }

  /**
   * Signs in with an e-mail address and a password, for the client at `address` (see
   * `clientAddress`). The sign-in limiter (`src/server/auth-limiter.ts`) answers `429`:
   *
   * - after `MAX_SIGN_IN_ATTEMPTS_PER_CLIENT` attempts from one client in a window, whatever
   *   addresses it tries;
   * - for one address from one client after its allowed failures; other clients, the account's
   *   owner among them, are not affected;
   * - for one address from clients that never signed in to it, after
   *   `MAX_SIGN_IN_FAILURES_PER_ACCOUNT` failures from all of them. Before that, its attempts are
   *   checked one at a time and slowed down, and a client that signed in to the account before
   *   skips both, so nobody can lock the owner out of their account.
   */
  signIn(input: z.output<typeof signInSchema>, address: ClientAddress | null): Promise<Session> {
    const known = this.findByEmail(input.email)?.knownClients;
    const trusted = address !== null && known?.includes(address.client) === true;
    return this.options.signInLimiter.run({ address, subject: input.email, trusted }, async () => {
      // Read again: the account may have been created while this attempt waited.
      const user = this.findByEmail(input.email);
      const hash = user?.passwordHash ?? (await this.decoy());
      if (!(await verifyPassword(input.password, hash)) || !user) {
        throw new HttpError(
          401,
          'invalid_credentials',
          'The e-mail address or the password is wrong.',
        );
      }
      return this.startSession(user, address);
    });
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

  private findByEmail(email: string): StoredUser | undefined {
    const id = this.idsByEmail.get(email);
    return id === undefined ? undefined : this.users.get(id);
  }

  private async startSession(user: StoredUser, address: ClientAddress | null): Promise<Session> {
    const token = await this.options.sessions.create(user.id);
    if (address) {
      const known = user.knownClients.filter((client) => client !== address.client);
      known.push(address.client);
      user.knownClients = known.slice(-MAX_KNOWN_CLIENTS_PER_USER);
    }
    return { token, user: publicUser(user) };
  }

  private decoy(): Promise<string> {
    this.decoyHash ??= hashPassword(crypto.randomUUID(), this.iterations);
    return this.decoyHash;
  }
}

function emailTaken(): HttpError {
  return new HttpError(409, 'email_taken', 'An account with this e-mail address exists.', {
    email: 'validation.emailTaken',
  });
}

function publicUser({ id, name, email }: StoredUser): User {
  return { id, name, email };
}
