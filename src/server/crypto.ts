/**
 * Small Web Crypto helpers. Web Crypto (`globalThis.crypto`) exists in Node.js 20+, in the
 * Expo server runtime and in edge runtimes, so the API needs no native module.
 *
 * @module
 */

const encoder = new TextEncoder();

/** Encodes bytes as base64url without padding (RFC 4648 §5). */
export function base64url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Decodes base64url without padding; returns `null` for any other text. */
export function fromBase64url(text: string): Uint8Array<ArrayBuffer> | null {
  if (!/^[A-Za-z0-9_-]*$/.test(text) || text.length % 4 === 1) return null;
  const binary = atob(text.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

/** 32 random bytes as 43 base64url characters: a session token. */
export function randomToken(): string {
  return base64url(crypto.getRandomValues(new Uint8Array(32)));
}

/** `n` random bytes. */
export function randomBytes(n: number): Uint8Array<ArrayBuffer> {
  return crypto.getRandomValues(new Uint8Array(n));
}

/** SHA-256 of a UTF-8 string, as base64url. Session tokens are stored only in this form. */
export async function sha256(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(text));
  return base64url(new Uint8Array(digest));
}

/** Compares two byte arrays in time that depends only on their length. */
export function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let i = 0; i < a.length; i += 1) difference |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return difference === 0;
}
