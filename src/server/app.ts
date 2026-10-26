/**
 * Wires the server's stores together. Route files call {@link getServerApp}; tests call
 * {@link createServerApp} for a fresh, isolated instance.
 *
 * @module
 */
import {
  MAX_RATE_LIMIT_KEYS,
  MAX_SESSIONS,
  MAX_SESSIONS_PER_USER,
  MAX_SIGN_IN_ATTEMPTS_PER_CLIENT,
  MAX_SIGN_IN_FAILURES,
  MAX_SIGN_UPS_PER_CLIENT,
  MAX_STORED_TASKS,
  MAX_TASKS_PER_USER,
  MAX_USERS,
  SESSION_TTL_MS,
  SIGN_IN_WINDOW_MS,
  SIGN_UP_WINDOW_MS,
} from '@/shared/limits';

import { AccountService } from './accounts';
import { AttemptLimiter } from './rate-limit';
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
  maxSignInAttemptsPerClient?: number;
  maxSignUpsPerClient?: number;
  maxStoredTasks?: number;
  /** Replaces the wait before a slowed-down sign-in. */
  sleep?: (ms: number) => Promise<void>;
}

/** Builds a new server with empty stores. */
export function createServerApp(options: ServerAppOptions = {}): ServerApp {
  const now = options.now ?? Date.now;
  const sessions = new SessionStore({
    ttlMs: SESSION_TTL_MS,
    maxPerUser: MAX_SESSIONS_PER_USER,
    maxTotal: MAX_SESSIONS,
    now,
  });
  const limiter = (maxAttempts: number) =>
    new AttemptLimiter({
      maxAttempts,
      windowMs: SIGN_IN_WINDOW_MS,
      maxKeys: MAX_RATE_LIMIT_KEYS,
      now,
    });
  const signInLimits = {
    clients: limiter(options.maxSignInAttemptsPerClient ?? MAX_SIGN_IN_ATTEMPTS_PER_CLIENT),
    pairs: limiter(options.maxSignInFailures ?? MAX_SIGN_IN_FAILURES),
    // Counts only, never blocks: the count sets the delay of the next attempt.
    accounts: limiter(Number.POSITIVE_INFINITY),
  };
  return {
    accounts: new AccountService({
      sessions,
      signInLimits,
      signUpLimiter: new AttemptLimiter({
        maxAttempts: options.maxSignUpsPerClient ?? MAX_SIGN_UPS_PER_CLIENT,
        windowMs: SIGN_UP_WINDOW_MS,
        maxKeys: MAX_RATE_LIMIT_KEYS,
        now,
      }),
      maxUsers: options.maxUsers ?? MAX_USERS,
      ...(options.iterations === undefined ? {} : { iterations: options.iterations }),
      ...(options.sleep === undefined ? {} : { sleep: options.sleep }),
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
