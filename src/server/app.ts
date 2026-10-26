/**
 * Wires the server's stores together. Route files call {@link getServerApp}; tests call
 * {@link createServerApp} for a fresh, isolated instance.
 *
 * @module
 */
import {
  MAX_PENDING_SIGN_INS_PER_ACCOUNT,
  MAX_RATE_LIMIT_KEYS,
  MAX_SESSIONS_PER_USER,
  MAX_SIGN_IN_ATTEMPTS_PER_CLIENT,
  MAX_SIGN_IN_ATTEMPTS_PER_NETWORK,
  MAX_SIGN_IN_FAILURES,
  MAX_SIGN_IN_FAILURES_PER_ACCOUNT,
  MAX_SIGN_UPS_PER_CLIENT,
  MAX_SIGN_UPS_PER_NETWORK,
  MAX_STORED_TASKS,
  MAX_TASKS_PER_USER,
  MAX_USERS,
  SESSION_TTL_MS,
  SIGN_IN_WINDOW_MS,
  SIGN_UP_WINDOW_MS,
} from '@/shared/limits';

import { AccountService } from './accounts';
import { AuthLimiter } from './auth-limiter';
import { SessionStore } from './sessions';
import { MemoryTaskRepository, type TaskRepository } from './tasks';

/** Everything a route needs. */
export interface ServerApp {
  accounts: AccountService;
  tasks: TaskRepository;
}

/** Options of {@link createServerApp}; every field has a production default. */
export interface ServerAppOptions {
  now?: () => number;
  iterations?: number;
  maxUsers?: number;
  maxTasksPerUser?: number;
  maxSignInFailures?: number;
  maxSignInFailuresPerAccount?: number;
  maxSignInAttemptsPerClient?: number;
  maxSignUpsPerClient?: number;
  maxStoredTasks?: number;
  /** Keys each rate-limit table tracks. */
  maxRateLimitKeys?: number;
  /** Replaces the wait before a slowed-down attempt. */
  sleep?: (ms: number) => Promise<void>;
}

/** Builds a new server with empty stores. */
export function createServerApp(options: ServerAppOptions = {}): ServerApp {
  const now = options.now ?? Date.now;
  const maxUsers = options.maxUsers ?? MAX_USERS;
  const sessions = new SessionStore({
    ttlMs: SESSION_TTL_MS,
    maxPerUser: MAX_SESSIONS_PER_USER,
    // Room for every account's sessions, whatever maxUsers is, so the table is never full.
    maxTotal: maxUsers * MAX_SESSIONS_PER_USER,
    now,
  });
  const shared = {
    maxKeys: options.maxRateLimitKeys ?? MAX_RATE_LIMIT_KEYS,
    now,
    ...(options.sleep === undefined ? {} : { sleep: options.sleep }),
  };
  const signInLimiter = new AuthLimiter({
    ...shared,
    windowMs: SIGN_IN_WINDOW_MS,
    maxPerClient: options.maxSignInAttemptsPerClient ?? MAX_SIGN_IN_ATTEMPTS_PER_CLIENT,
    maxPerNetwork: MAX_SIGN_IN_ATTEMPTS_PER_NETWORK,
    maxFailuresPerPair: options.maxSignInFailures ?? MAX_SIGN_IN_FAILURES,
    maxFailuresPerSubject: options.maxSignInFailuresPerAccount ?? MAX_SIGN_IN_FAILURES_PER_ACCOUNT,
    maxPendingPerSubject: MAX_PENDING_SIGN_INS_PER_ACCOUNT,
  });
  const signUpLimiter = new AuthLimiter({
    ...shared,
    windowMs: SIGN_UP_WINDOW_MS,
    maxPerClient: options.maxSignUpsPerClient ?? MAX_SIGN_UPS_PER_CLIENT,
    maxPerNetwork: MAX_SIGN_UPS_PER_NETWORK,
  });
  return {
    accounts: new AccountService({
      sessions,
      signInLimiter,
      signUpLimiter,
      maxUsers,
      ...(options.iterations === undefined ? {} : { iterations: options.iterations }),
    }),
    tasks: new MemoryTaskRepository({
      maxPerUser: options.maxTasksPerUser ?? MAX_TASKS_PER_USER,
      maxTotal: options.maxStoredTasks ?? MAX_STORED_TASKS,
      now,
    }),
  };
}

// Kept on globalThis so that the development server's module reloads do not sign everyone out.
const holder = globalThis as typeof globalThis & { __reactNativeStarterServer?: ServerApp };

/** The process-wide server used by the route files. */
export function getServerApp(): ServerApp {
  holder.__reactNativeStarterServer ??= createServerApp();
  return holder.__reactNativeStarterServer;
}

/** Replaces the process-wide server; used by tests of the route files. */
export function setServerApp(app: ServerApp | undefined): void {
  holder.__reactNativeStarterServer = app;
}
