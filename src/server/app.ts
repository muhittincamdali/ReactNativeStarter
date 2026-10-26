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
  MAX_SIGN_IN_FAILURES,
  MAX_TASKS_PER_USER,
  MAX_USERS,
  SESSION_TTL_MS,
  SIGN_IN_WINDOW_MS,
} from '@/shared/limits';

import { AccountService } from './accounts';
import { FailureLimiter } from './rate-limit';
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
  const limiter = new FailureLimiter({
    maxFailures: options.maxSignInFailures ?? MAX_SIGN_IN_FAILURES,
    windowMs: SIGN_IN_WINDOW_MS,
    maxKeys: MAX_RATE_LIMIT_KEYS,
    now,
  });
  return {
    accounts: new AccountService({
      sessions,
      limiter,
      maxUsers: options.maxUsers ?? MAX_USERS,
      ...(options.iterations === undefined ? {} : { iterations: options.iterations }),
    }),
    tasks: new MemoryTaskRepository({
      maxPerUser: options.maxTasksPerUser ?? MAX_TASKS_PER_USER,
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
