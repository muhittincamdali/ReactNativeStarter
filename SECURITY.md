# Security policy

## Supported versions

| Version           | Supported                         |
| ----------------- | --------------------------------- |
| 2.x (Expo SDK 58) | Yes                               |
| 1.x               | No: it did not build; move to 2.x |

## Reporting a vulnerability

Please do not open a public issue. Use GitHub's
[private vulnerability reporting](https://github.com/muhittincamdali/ReactNativeStarter/security/advisories/new)
and include:

- the affected file and version (tag or commit);
- the steps or the request that reproduces it;
- what an attacker gains.

You can expect an answer within 7 days. Fixes are released as a patch version and described in
[CHANGELOG.md](CHANGELOG.md), with credit if you want it.

## In scope

The sign-up, sign-in and session code (`src/server/accounts.ts`, `passwords.ts`, `sessions.ts`,
`rate-limit.ts`), request reading and validation (`src/server/http.ts`, `src/shared/`), the API
routes in `src/app/api`, token storage in the app (`src/lib/secure-storage*.ts`, `session.ts`) and
`scripts/serve.mjs`.

## Out of scope

What the starter deliberately leaves to the app built on it, listed in the
[Security guide](Documentation/Security.md#not-included): HTTPS, a database, per-IP rate limits,
e-mail verification, password reset and account deletion. Reports about dependencies are welcome
when this project uses the affected code.
