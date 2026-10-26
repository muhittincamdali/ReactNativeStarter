# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2026-10-26

The app was rebuilt from scratch on Expo SDK 58: the 1.x sources could not be
installed or started from a fresh clone (see 1.0.0), so nothing of them is kept and there is no
upgrade path from 1.x. Start from a new clone.

### Added

- Expo SDK 58, React Native 0.88, React 19.3, Expo Router 58 with typed routes and the React
  Compiler, TypeScript 6 in strict mode, and a committed `package-lock.json`.
- An API in the same project as Expo Router API routes: `POST /api/auth/sign-up`, `sign-in` and
  `sign-out`, `GET /api/auth/me`, `GET` and `POST /api/tasks`, `PATCH` and `DELETE /api/tasks/:id`
  and `GET /api/health`.
- Request handling that reads bodies as a stream and stops at 16 KiB (`413`), requires
  `application/json` (`415`), decodes UTF-8 strictly (`400`), validates with strict zod schemas
  (`422` with field keys) and answers unexpected errors with a `500` that carries no details.
- Accounts with PBKDF2-HMAC-SHA256 password hashes (600,000 iterations), 32-byte session tokens
  stored only as SHA-256 hashes, 30-day expiry, and at most 10 sessions per account, where a new
  one replaces only that account's oldest; a full session table answers `503` instead of dropping
  another account's session.
- `AuthLimiter`, one limiter for sign-in and sign-up that counts parallel attempts. Sign-in over
  15 minutes: 30 attempts per client address and 300 per IPv6 /48, 5 failures per client and
  e-mail address (`429` with `Retry-After`), and for one e-mail address attempts one at a time, a
  delay from 250 ms up to 5 s after 5 failures and `429` after 50 for clients that never signed
  in to the account. Sign-up allows 10 attempts per client address and 50 per /48 an hour. Full
  rate-limit tables drop the least-counted key that is not locked, so they neither refuse new keys
  nor forget locked ones.
- Client addresses for the limits: the routes trust `X-Client-Address` only with a secret that
  `npm run serve` sets at start, and `TRUST_PROXY` reads `X-Forwarded-For` from listed proxies.
  Without the secret, requests are slowed down together and the server warns once at start.
- A task list with cursor paging, at most 500 tasks per account and 100,000 in all, and a
  `TaskRepository` interface with an in-memory implementation.
- Shared zod schemas and named limits in `src/shared`, and `parseBoundedInteger()` for query
  parameters.
- The app: sign-in and sign-up with the API's validation messages under each field, a task list
  with optimistic updates, and Settings for appearance (system, light, dark), language (system,
  English, Turkish) and signing out. The session is kept in the Keychain or Keystore and the app
  signs out only on a `401`.
- A typed API client with one time limit for the request and the body, a response size limit
  that stops a body stream at 1 MiB, and schema-checked answers.
- 281 Jest tests, among them a test that renders the real screens against the real API handlers
  in one process, and Maestro flows for a simulator or a device.
- `npm run serve` for the production build (`scripts/serve.mjs`).
- Examples: a task statistics route with its client call and card, and a SQLite `TaskRepository`
  on `node:sqlite` that passes the same contract tests as the in-memory one.
- Guides (Getting started, Adding a feature, Deploying, Security) and a TypeDoc site published to
  GitHub Pages.
- Screenshots in light and dark mode captured from a Release build by
  `scripts/capture-screenshots.sh`.
- CI through the shared workflows of `muhittincamdali/.github` v1.1.1 (Node.js 22 and 24), link,
  wording and translation checks, and grouped Dependabot updates.

### Removed

- All 1.x sources, screens and workflows, including request logging that printed request bodies
  to the console, a `TurboModuleCore` that had no native module behind it, an EAS build workflow
  that needed a secret the repository never had, and a release workflow.

### Security

- Nothing in the app or the API writes to the console; ESLint's `no-console` rule is an error.

## [1.0.0] - 2026-02-03

First release: an Expo SDK 51 and React Native 0.74 boilerplate with React Navigation, Zustand,
TanStack Query and sample screens. It had no lockfile, its Babel configuration used plugins that
were not dependencies, and `app.json` pointed at image files that were not in the repository, so it
did not install or start from a fresh clone.

[Unreleased]: https://github.com/muhittincamdali/ReactNativeStarter/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/muhittincamdali/ReactNativeStarter/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/muhittincamdali/ReactNativeStarter/releases/tag/v1.0.0
