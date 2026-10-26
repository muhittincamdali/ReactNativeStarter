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
- Sessions expire after 30 days. An account keeps at most 10, and a new one replaces that
  account's oldest. The table has room for 10 sessions for each of the 1,000 accounts; if it is
  ever full, a new session is refused with `503 capacity` and nobody else's session is dropped.
  Signing out revokes the token on the server.
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
- Every list has an upper bound: 1,000 accounts, 500 tasks per account and 100,000 in all, page
  size, sessions and the keys each rate limiter remembers (`src/shared/limits.ts`). A client
  cannot make the server hold more than these, or loop longer. A full rate-limit table never
  forgets a key that is still counting; it refuses new keys until the oldest window ends
  (`src/server/rate-limit.ts`, `stores.test.ts`).
- Sign-in has three limits over 15 minutes (`src/server/accounts.ts`, `routes.test.ts`):
  - one client address gets 30 attempts, for any addresses, then `429` with `Retry-After`;
  - one client address gets 5 failures for one e-mail address, then `429` for that pair only;
  - failures for one e-mail address from all clients together never lock it: after 5, each
    attempt waits 250 ms, doubling up to 5 seconds, before the password is checked. Someone
    trying wrong passwords for your address slows your sign-in down but cannot keep you out.

  Each attempt is counted before the password is checked, so parallel requests cannot slip past.
- One client address can sign up 10 times an hour, a taken address included.
- The client address is the `X-Client-Address` header (`src/server/client-address.ts`).
  `npm run serve` replaces any value a client sends with the socket's address; an IPv6 address
  counts as its /64 network. Requests without the header, as in `npx expo start`, share one
  client limit.
- Errors carry a stable code and no internal details; an unexpected error is a plain `500`.
- The app reads at most 1 MiB of an answer, and one 15-second limit covers the request and the
  whole body. A declared `Content-Length` above 1 MiB is refused before the body is read; a body
  stream (web) is cancelled once it passes the limit. React Native's `fetch` has no body stream
  and delivers the body in one piece, so there its length is checked after reading
  (`src/lib/api-client.ts`).

## Logging

The app and the API write nothing to the console or a log, and ESLint's `no-console` rule keeps
it that way. If you add logging or error reporting, never log request bodies, `Authorization`
headers, tokens or passwords.

## Demo server or production

The API in `src/server` is complete enough to run the app end to end and to show where each check
belongs, but it keeps everything in the memory of one process:

- a restart signs everyone out and deletes all accounts and tasks;
- two server instances do not share accounts, sessions or rate-limit counts, so the limits apply
  per instance;
- the limits are sized for a demo: 1,000 accounts and 100,000 tasks, tens of megabytes at most.

Before real users arrive:

- move accounts, sessions and tasks to a database ([Deploying](Deploying.md#2-keep-the-data));
- move the rate-limit counters to a store all instances share, such as Redis, keeping the same
  rules: count before checking the password, never drop a key that is still counting;
- behind a proxy or on another host, set `X-Client-Address` from the address your proxy reports
  and drop any value the client sent ([Deploying](Deploying.md#client-address));
- add bot protection (a challenge after repeated failures, or a service in front of the API) if
  you expect attacks from many addresses at once: the limits here slow those down per address
  but do not stop them.

## Not included

These depend on your product, so the starter leaves them to you:

- HTTPS: terminate TLS at your host or proxy.
- A database and a shared rate-limit store: see [Demo server or production](#demo-server-or-production).
- E-mail verification, password reset, two-factor sign-in and account deletion.
- CORS: the API sends no CORS headers, so browsers allow calls only from the same origin. The
  native apps are not affected.

Report a vulnerability as described in [SECURITY.md](https://github.com/muhittincamdali/ReactNativeStarter/blob/main/SECURITY.md).
