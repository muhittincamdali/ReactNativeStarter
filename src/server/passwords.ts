/**
 * Password hashing with PBKDF2-HMAC-SHA256 through Web Crypto.
 *
 * The stored form is `pbkdf2-sha256$<iterations>$<salt>$<hash>` (salt and hash in base64url),
 * so the iteration count can be raised later without invalidating existing accounts.
 * 600,000 iterations is the OWASP Password Storage Cheat Sheet value for PBKDF2-HMAC-SHA256.
 *
 * @module
 */
import { base64url, constantTimeEqual, fromBase64url, randomBytes } from './crypto';

/** Iterations used for new hashes. */
export const DEFAULT_ITERATIONS = 600_000;

const MIN_ITERATIONS = 1_000;
const MAX_ITERATIONS = 10_000_000;
const SALT_BYTES = 16;
const KEY_BYTES = 32;
const PREFIX = 'pbkdf2-sha256';

const encoder = new TextEncoder();

async function derive(
  password: string,
  salt: Uint8Array<ArrayBuffer>,
  iterations: number,
): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
    'deriveBits',
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    key,
    KEY_BYTES * 8,
  );
  return new Uint8Array(bits);
}

/** Hashes a password with a new random salt. */
export async function hashPassword(
  password: string,
  iterations = DEFAULT_ITERATIONS,
): Promise<string> {
  if (
    !Number.isSafeInteger(iterations) ||
    iterations < MIN_ITERATIONS ||
    iterations > MAX_ITERATIONS
  ) {
    throw new RangeError(
      `iterations must be an integer from ${MIN_ITERATIONS} to ${MAX_ITERATIONS}`,
    );
  }
  const salt = randomBytes(SALT_BYTES);
  const hash = await derive(password, salt, iterations);
  return `${PREFIX}$${iterations}$${base64url(salt)}$${base64url(hash)}`;
}

/**
 * Checks a password against a stored hash. A stored value that is not in the expected form
 * (wrong prefix, an iteration count that is not a plain integer in range, bad base64url, wrong
 * lengths) never matches and never throws.
 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 4 || parts[0] !== PREFIX) return false;
  const [, rawIterations = '', rawSalt = '', rawHash = ''] = parts;
  if (!/^[1-9][0-9]{0,7}$/.test(rawIterations)) return false;
  const iterations = Number(rawIterations);
  if (iterations < MIN_ITERATIONS || iterations > MAX_ITERATIONS) return false;
  const salt = fromBase64url(rawSalt);
  const expected = fromBase64url(rawHash);
  if (!salt || salt.length !== SALT_BYTES || !expected || expected.length !== KEY_BYTES)
    return false;
  const actual = await derive(password, salt, iterations);
  return constantTimeEqual(actual, expected);
}
