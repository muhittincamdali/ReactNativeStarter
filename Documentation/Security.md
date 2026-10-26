---
title: Security
group: Guides
---

# Security

What the starter does to protect accounts and the server, and what it leaves to you. Each item
names the file to read and the test that checks it.

## Passwords

- Hashed with PBKDF2-HMAC-SHA256 and 600,000 iterations through Web Crypto, with a random 16-byte
  salt per password (`src/server/passwords.ts`). The stored form keeps the iteration count, so you
  can raise it later without breaking existing accounts.
- Normalised with NFKC before hashing, so the same password typed on two keyboards matches.
- 8 to 128 characters for a new password; sign-in checks only the upper bound, so a rule change
  never locks anyone out.
- A wrong address and a wrong password get the same `401` and take the same time: an unknown
  address is checked against a decoy hash (`src/server/accounts.ts`, `routes.test.ts`).

## Sessions

- A session token is 32 random bytes. The server keeps only its SHA-256, so reading the session
  table does not give working tokens (`src/server/sessions.ts`).
- Sessions expire after 30 days; an account keeps at most 10 and the server at most 20,000, oldest
  first out. Signing out revokes the token on the server.
- On iOS and Android the token is stored with `expo-secure-store` in the Keychain or Keystore,
  readable after the first unlock and never copied to another device. In the browser it is kept
  in `sessionStorage` (`src/lib/secure-storage.web.ts`); for a public web app, prefer an
  `HttpOnly` cookie.
- The app signs out when the server answers `401`, and clears its cached data so the next account
  cannot see the previous one's tasks (`session.test.ts`).

## Requests

- Bodies must be `application/json`, at most 16 KiB, valid UTF-8 and match a strict schema: an
  unknown field is an error, not something to ignore (`src/server/http.ts`, `http.test.ts`). The
  limit holds while the body streams in, whatever `Content-Length` claims.
- Numbers in query strings are plain digits inside a range; `NaN`, `Infinity`, exponents and
  signs are refused (`src/shared/numbers.ts`).
- Text fields refuse control characters, line separators and bidirectional overrides.
- Every list has an upper bound: tasks per account, page size, sessions, accounts and the number
  of e-mail addresses the sign-in limiter remembers (`src/shared/limits.ts`). A client cannot make
  the server hold more than these, or loop longer.
- Five failed sign-ins for one address lock it for 15 minutes (`429` with `Retry-After`). Each
  attempt is counted before the password is checked, so parallel requests cannot slip past.
- Errors carry a stable code and no internal details; an unexpected error is a plain `500`.

## Logging

The app and the API write nothing to the console or a log, and ESLint's `no-console` rule keeps
it that way. If you add logging or error reporting, never log request bodies, `Authorization`
headers, tokens or passwords.

## Not included

These depend on your product, so the starter leaves them to you:

- HTTPS: terminate TLS at your host or proxy.
- A database: see [Deploying](Deploying.md).
- Rate limits per IP address. Behind a proxy, the client address is in a header that only your
  proxy can be trusted to set.
- E-mail verification, password reset, two-factor sign-in and account deletion.
- CORS: the API sends no CORS headers, so browsers allow calls only from the same origin. The
  native apps are not affected.

Report a vulnerability as described in [SECURITY.md](https://github.com/muhittincamdali/ReactNativeStarter/blob/main/SECURITY.md).
