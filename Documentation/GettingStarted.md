---
title: Getting started
group: Guides
---

# Getting started

This guide takes you from a fresh clone to the app running on your phone, in a simulator and in a
browser, and explains where things live so you can start changing them.

## What you need

| Tool           | Version                                       | Used for                               |
| -------------- | --------------------------------------------- | -------------------------------------- |
| Node.js        | 22.14 or later (24 recommended)               | Everything                             |
| Expo Go app    | For SDK 58, from the App Store or Google Play | Running on your phone without building |
| Xcode | Tested with Xcode 27.1 and the iOS 27 simulator | `npm run ios` (macOS only)             |
| Android Studio | With an emulator or a USB-connected phone     | `npm run android`                      |

You only need Node.js to start: the browser and Expo Go need nothing else.

## 1. Get the code

```sh
git clone https://github.com/muhittincamdali/ReactNativeStarter.git my-app
cd my-app
npm ci
```

`npm ci` installs exactly the versions in `package-lock.json`.

## 2. Start the development server

```sh
npx expo start
```

The development server bundles the app **and** runs the API in `src/app/api`, so there is nothing
else to start. In the terminal:

- press **w** to open the app in your browser;
- press **i** to open it in the iOS simulator (Expo Go is installed for you);
- press **a** for the Android emulator;
- or scan the QR code with your phone's camera (iOS) or the Expo Go app (Android). The phone must
  be on the same network as your computer.

## 3. Use it

Choose **New here? Create an account**, enter a name, an e-mail address and a password of at least
eight characters, and add a few tasks. Accounts and tasks are kept in the server's memory, so they
are gone when you stop `npx expo start`; [Deploying](Deploying.md) shows how to keep them in a
database.

## Where things are

```text
src/
  app/                 Screens and API routes (Expo Router: one file per URL)
    (auth)/            Sign-in and sign-up, shown only when signed out
    (app)/             Tasks and Settings tabs, shown only when signed in
    api/               The backend: POST /api/auth/sign-in, GET /api/tasks, ...
  features/            Screen components: auth, tasks, settings
  components/          Button, TextField, Segmented, Screen
  lib/                 API client, session, preferences, translations, query client
  server/              Server logic used by the API routes: accounts, passwords, sessions, tasks
  shared/              Limits and zod schemas used by both the app and the API
  theme/               Light and dark palettes
__tests__/             Jest tests: app/, server/, shared/
Examples/              Extra code you can copy in, each with tests
.maestro/              End-to-end flows for a simulator or a device
```

The rule of thumb: a file under `src/app` is a URL; everything it needs lives in another folder,
so it can be tested on its own.

## Scripts

| Command                           | What it does                                             |
| --------------------------------- | -------------------------------------------------------- |
| `npm start`                       | Development server for every platform, with the API      |
| `npm run ios` / `npm run android` | Build a development app, install it and start the server |
| `npm run web`                     | Development server opened in the browser                 |
| `npm test`                        | All Jest tests (app, server, examples)                   |
| `npm run lint`                    | ESLint and Prettier                                      |
| `npm run typecheck`               | TypeScript in strict mode                                |
| `npm run build`                   | Production build of the web app and the API into `dist/` |
| `npm run serve`                   | Serve `dist/` with Node.js on http://127.0.0.1:3000      |
| `npm run docs`                    | This documentation site into `docs/api/`                 |
| `npm run e2e:ios`                 | Maestro flows against a running app                      |

## Make it yours

1. In `app.json`, change `name`, `slug`, `scheme`, `ios.bundleIdentifier` and `android.package`.
2. In `package.json`, change `name`, `author` and `repository`.
3. Replace `assets/icon.svg` and run `node scripts/render-icons.mjs` to render the icons.
4. Change `app.name` in `src/lib/i18n/en.ts` and `tr.ts`, and the colours in `src/theme/index.ts`.
5. Start your own history: `rm -rf .git && git init`.

Next: [Adding a feature](AddingAFeature.md) walks through a change that touches every layer.
