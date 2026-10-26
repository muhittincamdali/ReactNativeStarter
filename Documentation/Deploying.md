---
title: Deploying
group: Guides
---

# Deploying

The project ships as two things: a server (the web app plus the API routes) and the iOS and
Android apps, which talk to that server. Deploy the server first, then build the apps with its
address.

## 1. Build and run the server

```sh
npm run build    # expo export --platform web --output-dir dist
npm run serve    # http://127.0.0.1:3000; set PORT and HOST to change it
```

`dist/client` holds the web app and `dist/server` the API routes. `scripts/serve.mjs` serves both
from one Node.js 22+ process through `expo-server`'s Node.js adapter, so any host that runs Node.js
can run it behind HTTPS. `expo-server` also has adapters for Express, Vercel, Netlify, Cloudflare
Workers and Bun, and Expo's own host takes the same folder:

```sh
npx eas-cli@latest deploy
```

Check it with `curl https://<your-domain>/api/health`, which answers `{"status":"ok"}`.

## 2. Keep the data

Out of the box, accounts, sessions and tasks live in the server's memory: a restart empties them,
and two server instances would not see each other's data. Before real users arrive, give each
store a database:

- **Tasks** go through the `TaskRepository` interface in `src/server/tasks.ts`.
  [`Examples/sqlite-repository`](https://github.com/muhittincamdali/ReactNativeStarter/tree/main/Examples/sqlite-repository)
  implements it with Node.js's built-in `node:sqlite` and passes the same contract tests as the
  in-memory version; swap it in inside `createServerApp()` in `src/server/app.ts`.
- **Accounts and sessions** (`AccountService`, `SessionStore`) follow the same pattern: keep the
  public methods, replace the `Map`s with tables. Store only the password hash and the SHA-256 of
  each session token, as the in-memory versions do.

## 3. Point the apps at the server

A release build has no development server to fall back on. Give it the server's address in one of
two ways:

- set `EXPO_PUBLIC_API_URL=https://<your-domain>` in the environment of the build, or
- set `origin` in the expo-router plugin in `app.json`:
  `["expo-router", { "origin": "https://<your-domain>" }]`.

`EXPO_PUBLIC_API_URL` must be an `https://` (or `http://` for local testing) URL without a query,
a fragment or credentials; the app refuses to start with anything else, so a typo shows up at once.
A build with neither shows "The app has no server address" instead of sending requests.

iOS blocks plain `http://` to anything but the local network, so use HTTPS for a deployed server.

## 4. Build the apps

[EAS Build](https://docs.expo.dev/build/introduction/) builds signed apps in the cloud:

```sh
npx eas-cli@latest build:configure    # creates eas.json and links an Expo project
npx eas-cli@latest build --platform all
```

Add `EXPO_PUBLIC_API_URL` to the `env` of each profile in `eas.json`. To build on your own Mac
instead, run `npx expo run:ios --configuration Release` with the variable set.

## 5. Before you publish

- App Store Review requires apps with sign-up to let people delete their account from inside
  the app (guideline 5.1.1(v)); add a route and a button for it.
- Add password reset and, if you need it, e-mail verification.
- Read [Security](Security.md) for what the starter protects against and what it leaves to you.
