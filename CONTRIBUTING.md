# Contributing

Thank you for helping. Bug reports, fixes, examples and clearer documentation are all welcome.

## Set up

```sh
git clone https://github.com/<you>/ReactNativeStarter.git
cd ReactNativeStarter
npm ci
npx expo start
```

You need Node.js 22.14 or later. For the native app, `npm run ios` needs Xcode on macOS and
`npm run android` needs Android Studio.

## Before you open a pull request

Run what CI runs:

```sh
npm run lint        # ESLint and Prettier (npm run format fixes formatting)
npm run typecheck   # TypeScript, strict
npm test            # Jest: app, server, shared and Examples/
npm run build       # web app and API routes into dist/
npm run docs        # TypeDoc; warnings fail the build
```

If you change a screen or a user journey, also run the Maestro flows on a simulator
(`npm run ios`, then `npm run e2e:ios`), and refresh the screenshots with
`npm run screenshots` when the screens look different (see `scripts/capture-screenshots.sh`).

## Guidelines

- **Tests with the change.** A bug fix starts with a test that fails without it. New API behaviour
  gets a route test in `__tests__/server/routes.test.ts`; a new screen state gets a case in
  `__tests__/app`.
- **Shared shapes.** Request and response bodies are zod schemas in `src/shared/schemas.ts`, used
  by both the API and the app. Validation messages are translation keys.
- **Bounded work.** Every new list, cache, loop or body read needs an upper bound, named in
  `src/shared/limits.ts`. Parse numbers from requests with `parseBoundedInteger()`.
- **No logging of user data.** `no-console` is an error. Never log bodies, tokens, passwords or
  `Authorization` headers.
- **Translations.** Add every user-visible string to `src/lib/i18n/en.ts` and `tr.ts`.
- **Accessibility.** Interactive elements need a role and a label; keep touch targets at least
  44 points.
- **Commits** follow [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`,
  `docs:`, `test:`, `refactor:`, `ci:`, `chore:`. One change per commit, with a body that says
  why.

## Reporting bugs

Open an issue with the steps to reproduce, what you expected and what happened, the platform (iOS,
Android or web, and its version) and the output of `npx expo-doctor`. Report security issues
privately as described in [SECURITY.md](SECURITY.md).

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
