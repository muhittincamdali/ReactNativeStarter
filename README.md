<!-- brand:start -->

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/banner-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/banner-light.svg" alt="React Native Starter: An Expo app with its own API: accounts, a task list, light and dark themes, two languages and tests."></picture></p>

<!-- lang-selector:start -->
<p align="center"><a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a></p>
<!-- lang-selector:end -->

<p align="center">
<a href="https://github.com/muhittincamdali/ReactNativeStarter/actions/workflows/ci.yml"><img src="https://github.com/muhittincamdali/ReactNativeStarter/actions/workflows/ci.yml/badge.svg" alt="CI status"></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/releases"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-version-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-version-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-version-light.svg" alt="Latest version: v1.0.0"></picture></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/blob/main/package.json"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-language-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-language-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-language-light.svg" alt="Language version: Node.js 22.14+"></picture></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-license-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-license-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-license-light.svg" alt="License: MIT"></picture></a>
</p>

<p align="center">
<a href="#quick-start"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-start-en-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-start-en-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-start-en-light.svg" alt="Get started"></picture></a>
<a href="https://muhittincamdali.github.io/ReactNativeStarter/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-docs-en-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-docs-en-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-docs-en-light.svg" alt="Documentation"></picture></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/tree/main/Examples"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-examples-en-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-examples-en-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-examples-en-light.svg" alt="Examples"></picture></a>
</p>

<!-- brand:end -->

An Expo app to start from: it runs on iOS, Android and the web, and it carries its own backend as
Expo Router API routes, so sign-up, sign-in and a task list work end to end after `npm ci` and
`npx expo start`, with no other server to set up. It is for developers who want a working app with
accounts, data, themes, translations and tests on day one, written in TypeScript they can read and
change, rather than a folder of empty screens.

## Highlights

- **A backend in the same project** — the API routes in `src/app/api` handle sign-up, sign-in,
  sign-out and task create, list, update and delete. The development server runs them next to the
  app, and `npm run build` exports them for Node.js, EAS Hosting, Vercel, Netlify or Cloudflare.
- **One schema for both sides** — request and response shapes are zod schemas in `src/shared`; the
  API validates every body with them and the app parses every answer with them.
- **Accounts done carefully** — PBKDF2 password hashes (600,000 iterations), random session tokens
  stored only as SHA-256 hashes, tokens in the iOS Keychain and Android Keystore, sign-in and
  sign-up limits per client address that slow an attacked account down instead of locking its
  owner out, and the same answer for a wrong address and a wrong password.
- **Bounded by design** — 16 KiB request bodies read as a stream, 1 MiB answers, 500 tasks per
  account, pages of at most 100, strict integer query parameters and capped session and limiter
  tables: no request can make the server hold more or loop longer.
- **Ready for people** — light and dark themes, English and Turkish with typed keys, offline-tolerant
  sign-in, optimistic task updates, accessibility roles and labels, and 48-point touch targets.
- **Tested from the schema to the screen** — 250 Jest tests, including one that renders the
  real screens against the real API handlers in the same process, plus Maestro flows that run the
  built app on an iOS simulator.

## Quick start

**1. Get the code**

```sh
git clone https://github.com/muhittincamdali/ReactNativeStarter.git my-app
cd my-app
npm ci
```

You need [Node.js](https://nodejs.org/) 22.14 or later. Nothing else has to be installed to try it
in a browser.

**2. Start it**

```sh
npx expo start
```

This starts the app and its API together. Press **w** to open it in your browser, **i** for the iOS
simulator, **a** for the Android emulator, or scan the QR code with the
[Expo Go](https://expo.dev/go) app on a phone on the same network.

**3. Use it**

Tap **New here? Create an account**, enter a name, an e-mail address and a password of at least
eight characters, and you land on your task list. Add a task, tap the circle to complete it and
switch to **Settings** to try the dark theme or Turkish. Edit `src/features/tasks/TasksScreen.tsx`
and the screen updates as you save.

## Installation

The repository is the app: clone it as above, start your own history with
`rm -rf .git && git init`, and make it yours:

1. In `app.json`, change `name`, `slug`, `scheme`, `ios.bundleIdentifier` and `android.package`.
2. Replace `assets/icon.svg` and run `node scripts/render-icons.mjs` to render every icon from it.
3. Change the colours in `src/theme/index.ts` and the texts in `src/lib/i18n/`.

To run it as a native development build instead of Expo Go, use `npm run ios` (macOS with Xcode) or
`npm run android` (Android Studio).

## Usage

The samples below are copied from [`Examples/`](Examples), which `npm run typecheck` compiles and
`npm test` runs.

### Add an API route

A file in `src/app/api` named `<name>+api.ts` answers `/api/<name>`. `handle()` turns a thrown
`HttpError` into its answer, and `authenticate()` lets only signed-in requests through
([`Examples/task-stats/stats+api.ts`](Examples/task-stats/stats+api.ts)):

```ts
export function GET(request: Request): Promise<Response> {
  return handle(async () => {
    const { accounts, tasks } = getServerApp();
    const user = await accounts.authenticate(request);
    let total = 0;
    let done = 0;
    let cursor: string | undefined;
    for (let page = 0; page < MAX_PAGES; page += 1) {
      const result = tasks.list(user.id, { limit: MAX_PAGE_SIZE, cursor });
      if (!result) break;
      total += result.items.length;
      done += result.items.filter((task) => task.done).length;
      if (!result.nextCursor) break;
      cursor = result.nextCursor;
    }
    return json({ total, done, open: total - done });
  });
}
```

### Call it from the app

The API client adds the session token, a time limit and a size limit, and parses the answer with a
zod schema; a mismatch fails as an `ApiError` instead of reaching a screen
([`Examples/task-stats/schema.ts`](Examples/task-stats/schema.ts)):

```ts
export const taskStatsSchema = z.object({
  total: z.number().int().nonnegative(),
  done: z.number().int().nonnegative(),
  open: z.number().int().nonnegative(),
});

export function fetchTaskStats(client: ApiClient, signal?: AbortSignal): Promise<TaskStats> {
  return client.request('/api/stats', { schema: taskStatsSchema, ...(signal ? { signal } : {}) });
}
```

### Show it on a screen

React Query loads the data; `errorMessageKey()` turns any failure into a translated sentence
([`Examples/task-stats/TaskStatsCard.tsx`](Examples/task-stats/TaskStatsCard.tsx)):

```tsx
const stats = useQuery({ queryKey: ['task-stats'], queryFn: ({ signal }) => fetchStats(signal) });

return (
  <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
    {stats.isPending ? (
      <ActivityIndicator color={colors.accent} />
    ) : stats.isError ? (
      <Text style={{ color: colors.danger }}>{t(errorMessageKey(stats.error))}</Text>
    ) : (
      <Text accessibilityRole="summary" style={[styles.text, { color: colors.text }]}>
        {`${stats.data.done} / ${stats.data.total}`}
      </Text>
    )}
  </View>
);
```

### Keep tasks in a database

Tasks go through the `TaskRepository` interface. The SQLite version uses Node.js's built-in
`node:sqlite` and passes the same contract tests as the in-memory one
([`Examples/sqlite-repository`](Examples/sqlite-repository)). Swap it in inside
`createServerApp()` in `src/server/app.ts`:

```ts
tasks: new SqliteTaskRepository('data/tasks.db', { maxPerUser: MAX_TASKS_PER_USER }),
```

## Demo

| Sign in                                                 | Tasks                                            | Settings                                           |
| ------------------------------------------------------- | ------------------------------------------------ | -------------------------------------------------- |
| ![Sign-in screen, light](docs/images/sign-in-light.png) | ![Task list, light](docs/images/tasks-light.png) | ![Settings, light](docs/images/settings-light.png) |
| ![Sign-in screen, dark](docs/images/sign-in-dark.png)   | ![Task list, dark](docs/images/tasks-dark.png)   | ![Settings, dark](docs/images/settings-dark.png)   |

Captured from a Release build on an iPhone 17 Pro simulator with iOS 27, talking to the
production server from `npm run build && npm run serve`, by
[`scripts/capture-screenshots.sh`](scripts/capture-screenshots.sh). The script drives the
[Maestro flow](.maestro/sign-up-and-tasks.yaml) that signs up, adds three tasks and completes one.

## Documentation

Reference documentation and articles:

- [API reference](https://muhittincamdali.github.io/ReactNativeStarter/) — the shared schemas and
  limits, the API client, session, translations and the server modules, built by TypeDoc
  from the source comments.
- [CHANGELOG.md](CHANGELOG.md) — what changed in each version.

## Guides

- [Getting started](https://muhittincamdali.github.io/ReactNativeStarter/documents/Getting_started.html) — run it everywhere, the folder layout, scripts, and renaming the app.
- [Adding a feature](https://muhittincamdali.github.io/ReactNativeStarter/documents/Adding_a_feature.html) — a schema, an API route, a client call, a screen and their tests.
- [Deploying](https://muhittincamdali.github.io/ReactNativeStarter/documents/Deploying.html) — serve the API, keep the data, point the apps at it and build them with EAS.
- [Security](https://muhittincamdali.github.io/ReactNativeStarter/documents/Security.html) — what the starter protects and what it leaves to you.

The same guides are in [`Documentation/`](Documentation) as Markdown.

## Requirements

| Toolchain | Minimum version                                  |
| --------- | ------------------------------------------------ |
| Node.js   | 22.14                                            |
| Expo SDK  | 58 (React Native 0.88, React 19.3)               |
| iOS | 16.4, the deployment target of Expo SDK 58 (tested on iOS 27) |
| Android | 7.0 (API level 24), the React Native 0.88 minimum |

CI runs lint, type checks, tests and the web build on Node.js 22 and 24. The native app is built
and its Maestro flows are run locally with Xcode 27.1.

## Architecture

- **Routes are files.** `src/app` holds the screens and the API routes (Expo Router). The root
  layout keeps the splash screen up while the saved session is read, then shows the `(app)` or
  `(auth)` group through `Stack.Protected`, so a deep link cannot open a signed-in screen signed out.
- **The API is plain functions.** Each `+api.ts` file is a few lines that call `src/server`:
  `http.ts` (bounded body reading, JSON answers, error mapping), `accounts.ts`, `passwords.ts`,
  `sessions.ts`, `rate-limit.ts` and `tasks.ts`. `createServerApp()` wires them; tests build a fresh
  one per test.
- **Storage is behind an interface.** `TaskRepository` keeps the routes independent of where tasks
  live; the in-memory version is the default and the SQLite example shows a database.
- **The app's state is small.** Server data lives in React Query; the session (token and account)
  and the preferences (appearance, language) are two zustand stores; the session is saved with
  `expo-secure-store`, preferences with AsyncStorage, and both are validated when read back.
- **Errors have one type.** The API answers `{ error: { code, message, fields } }`; the client turns
  every failure into an `ApiError` with a kind (`network`, `timeout`, `http`, ...), and screens map
  it to a translated sentence. Field errors are translation keys, so the API's checks show up under
  the right field in the right language.
- **Nothing is logged.** ESLint's `no-console` rule is an error in the app and the API.

Run the checks locally:

```sh
npm run lint && npm run typecheck && npm test && npm run build
npm run ios          # development build on a simulator, then in another terminal:
npm run e2e:ios      # Maestro flows (sign-up, tasks, settings, form validation)
```

## Before production

The API keeps accounts, sessions, tasks and rate-limit counts in the memory of one process, sized
for a demo: 1,000 accounts and 100,000 tasks. A restart empties it, and several server instances do
not share it. Before real users arrive, move the stores to a database and the rate-limit counts to
a store all instances share, pass the client address on from your proxy, and add account deletion
and password reset. The
[Security guide](Documentation/Security.md#demo-server-or-production) lists each step.

## Roadmap

- Account deletion and password reset, which App Store Review and real users need.
- Persistent accounts and sessions next to the SQLite task repository.
- An Android Maestro run in CI on an emulator.

## Contributing

Contributions are welcome. Read the [contributing guide](CONTRIBUTING.md) and the [code of conduct](https://github.com/muhittincamdali/.github/blob/main/CODE_OF_CONDUCT.md) before opening a pull request. Report security issues privately as described in the [security policy](SECURITY.md).

## License

Released under the MIT license. See [LICENSE](LICENSE).
