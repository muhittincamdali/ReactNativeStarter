/**
 * Every size and count the app and the API accept. Each one bounds memory or work: a request,
 * a stored list or a loop can never grow past the value here.
 *
 * @module
 */

/** Largest request body the API reads, in bytes. Bigger bodies get `413` before they are parsed. */
export const MAX_REQUEST_BYTES = 16 * 1024;

/** Largest response body the client reads, in bytes. */
export const MAX_RESPONSE_BYTES = 1024 * 1024;

/** Longest e-mail address (RFC 5321 path limit). */
export const MAX_EMAIL_LENGTH = 254;

/** Shortest and longest password, in characters. */
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;

/** Longest display name, in characters. */
export const MAX_NAME_LENGTH = 80;

/** Longest task title, in characters. */
export const MAX_TASK_TITLE_LENGTH = 200;

/** Tasks one account can keep. Creating one more returns `409 task_limit`. */
export const MAX_TASKS_PER_USER = 500;

/** Page size of `GET /api/tasks`: default and largest accepted `limit`. */
export const DEFAULT_PAGE_SIZE = 50;
export const MAX_PAGE_SIZE = 100;

/** Accounts the in-memory store keeps. Sign-up returns `503 capacity` beyond this. */
export const MAX_USERS = 10_000;

/** Sessions kept per account; a new session replaces the account's oldest. */
export const MAX_SESSIONS_PER_USER = 10;

/**
 * Sessions kept in total: room for every account's sessions, so the limit is never reached and
 * one account's sessions never push out another's.
 */
export const MAX_SESSIONS = MAX_USERS * MAX_SESSIONS_PER_USER;

/** How long a session token stays valid, in milliseconds (30 days). */
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** Window of every sign-in limit, in milliseconds. */
export const SIGN_IN_WINDOW_MS = 15 * 60 * 1000;

/** Failed sign-ins allowed for one e-mail address from one client address in a window. */
export const MAX_SIGN_IN_FAILURES = 5;

/** Sign-in attempts allowed from one client address in a window, for any e-mail addresses. */
export const MAX_SIGN_IN_ATTEMPTS_PER_CLIENT = 30;

/**
 * Failed sign-ins for one e-mail address, from all clients together, before each further attempt
 * waits: {@link SIGN_IN_DELAY_BASE_MS}, doubling up to {@link MAX_SIGN_IN_DELAY_MS}.
 */
export const SIGN_IN_FAILURES_BEFORE_DELAY = 5;
export const SIGN_IN_DELAY_BASE_MS = 250;
export const MAX_SIGN_IN_DELAY_MS = 5_000;

/**
 * Keys each rate limiter tracks at once (client addresses, pairs of client and e-mail address,
 * e-mail addresses). A limiter whose table is full of keys still counting refuses new keys until
 * the oldest window ends.
 */
export const MAX_RATE_LIMIT_KEYS = 50_000;

/** Time the client waits for an API answer, in milliseconds. */
export const REQUEST_TIMEOUT_MS = 15_000;
