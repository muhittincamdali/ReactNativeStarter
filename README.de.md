<!-- i18n-source: README.md@467b99b41b2762a14345517b546a0b0320caf6ff status=reviewed -->
<!-- brand:start -->

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/banner-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/banner-light.svg" alt="React Native Starter: An Expo app with its own API: accounts, a task list, light and dark themes, two languages and tests."></picture></p>

<!-- lang-selector:start -->
<p align="center"><a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a></p>
<!-- lang-selector:end -->

<p align="center">
<a href="https://github.com/muhittincamdali/ReactNativeStarter/actions/workflows/ci.yml"><img src="https://github.com/muhittincamdali/ReactNativeStarter/actions/workflows/ci.yml/badge.svg" alt="CI-Status"></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/releases"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-version-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-version-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-version-light.svg" alt="Aktuelle Version: v1.0.0"></picture></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/blob/main/package.json"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-language-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-language-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-language-light.svg" alt="Sprachversion: Node.js 22.14+"></picture></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-license-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-license-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-license-light.svg" alt="Lizenz: MIT"></picture></a>
</p>

<p align="center">
<a href="#schnellstart"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-start-de-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-start-de-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-start-de-light.svg" alt="Loslegen"></picture></a>
<a href="https://muhittincamdali.github.io/ReactNativeStarter/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-docs-de-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-docs-de-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-docs-de-light.svg" alt="Dokumentation"></picture></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/tree/main/Examples"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-examples-de-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-examples-de-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-examples-de-light.svg" alt="Beispiele"></picture></a>
</p>

> Dies ist eine Übersetzung der englischen README. Bei Abweichungen gilt die englische Fassung.

<!-- brand:end -->

Eine Expo-App als Ausgangspunkt: Sie läuft auf iOS, Android und im Web und bringt ihr eigenes Backend als Expo-Router-API-Routes mit. Registrierung, Anmeldung und eine Aufgabenliste funktionieren daher nach `npm ci` und `npx expo start` durchgängig, ohne dass ein weiterer Server eingerichtet werden muss. Sie richtet sich an Entwicklerinnen und Entwickler, die vom ersten Tag an eine lauffähige App mit Konten, Daten, Themes, Übersetzungen und Tests haben möchten, geschrieben in TypeScript, das sich lesen und ändern lässt – statt eines Ordners mit leeren Screens.

## Highlights

- **Ein Backend im selben Projekt** — die API-Routes in `src/app/api` übernehmen Registrierung, Anmeldung und Abmeldung sowie das Erstellen, Auflisten, Aktualisieren und Löschen von Aufgaben. Der Entwicklungsserver führt sie neben der App aus, und `npm run build` exportiert sie für Node.js, EAS Hosting, Vercel, Netlify oder Cloudflare.
- **Ein Schema für beide Seiten** — Anfrage- und Antwortformate sind zod-Schemas in `src/shared`; die API validiert jeden Body damit, und die App parst jede Antwort damit.
- **Konten mit Sorgfalt umgesetzt** — PBKDF2-Passwort-Hashes (600.000 Iterationen), zufällige Sitzungs-Token, die nur als SHA-256-Hashes gespeichert werden, Token im iOS Keychain und im Android Keystore, Limits für Anmeldung und Registrierung pro Client-Adresse, die ein angegriffenes Konto verlangsamen, statt seinen Besitzer auszusperren und dieselbe Antwort bei falscher Adresse und falschem Passwort.
- **Von Grund auf begrenzt** — 16 KiB große Request-Bodys, die als Stream gelesen werden, Antworten bis 1 MiB, 500 Aufgaben pro Konto, Seiten mit höchstens 100 Einträgen, strikte ganzzahlige Query-Parameter und in ihrer Größe begrenzte Sitzungs- und Limiter-Tabellen: Keine Anfrage kann den Server dazu bringen, mehr Speicher zu halten oder länger zu iterieren.
- **Bereit für Menschen** — helles und dunkles Theme, Englisch und Türkisch mit typisierten Schlüsseln, offlinetolerante Anmeldung, optimistische Aufgaben-Updates, Accessibility-Rollen und -Labels sowie Touch-Ziele von 48 Punkten.
- **Vom Schema bis zum Screen getestet** — 250 Jest-Tests, darunter einer, der die echten Screens gegen die echten API-Handler im selben Prozess rendert, dazu Maestro-Flows, die die gebaute App in einem iOS-Simulator ausführen.

## Schnellstart

**1. Code holen**

```sh
git clone https://github.com/muhittincamdali/ReactNativeStarter.git my-app
cd my-app
npm ci
```

Du brauchst [Node.js](https://nodejs.org/) 22.14 oder neuer. Um sie im Browser auszuprobieren, muss sonst nichts installiert werden.

**2. Starten**

```sh
npx expo start
```

Das startet die App und ihre API gemeinsam. Drücke **w**, um sie im Browser zu öffnen, **i** für den iOS-Simulator oder **a** für den Android-Emulator, oder scanne den QR-Code mit der App [Expo Go](https://expo.dev/go) auf einem Smartphone im selben Netzwerk.

**3. Verwenden**

Tippe auf **New here? Create an account**, gib einen Namen, eine E-Mail-Adresse und ein Passwort mit mindestens acht Zeichen ein, und du landest in deiner Aufgabenliste. Füge eine Aufgabe hinzu, tippe auf den Kreis, um sie abzuschließen, und wechsle zu **Settings**, um das dunkle Theme oder Türkisch auszuprobieren. Bearbeite `src/features/tasks/TasksScreen.tsx`, und der Screen aktualisiert sich beim Speichern.

## Installation

Das Repository ist die App: Klone es wie oben, beginne mit `rm -rf .git && git init` deinen eigenen Verlauf und mach die App zu deiner:

1. Ändere in `app.json` die Werte `name`, `slug`, `scheme`, `ios.bundleIdentifier` und `android.package`.
2. Ersetze `assets/icon.svg` und führe `node scripts/render-icons.mjs` aus, um daraus alle Icons zu erzeugen.
3. Ändere die Farben in `src/theme/index.ts` und die Texte in `src/lib/i18n/`.

Um sie statt mit Expo Go als nativen Development-Build auszuführen, verwende `npm run ios` (macOS mit Xcode) oder `npm run android` (Android Studio).

## Verwendung

Die folgenden Beispiele sind aus [`Examples/`](Examples) kopiert; dieses Verzeichnis kompiliert `npm run typecheck`, und `npm test` führt es aus.

### Eine API-Route hinzufügen

Eine Datei in `src/app/api` mit dem Namen `<name>+api.ts` beantwortet `/api/<name>`. `handle()` wandelt einen geworfenen `HttpError` in die passende Antwort um, und `authenticate()` lässt nur angemeldete Anfragen durch ([`Examples/task-stats/stats+api.ts`](Examples/task-stats/stats+api.ts)):

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

### Aus der App aufrufen

Der API-Client fügt das Sitzungs-Token, ein Zeitlimit und ein Größenlimit hinzu und parst die Antwort mit einem zod-Schema; eine Abweichung schlägt als `ApiError` fehl, statt einen Screen zu erreichen ([`Examples/task-stats/schema.ts`](Examples/task-stats/schema.ts)):

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

### Auf einem Screen anzeigen

React Query lädt die Daten; `errorMessageKey()` wandelt jeden Fehler in einen übersetzten Satz um ([`Examples/task-stats/TaskStatsCard.tsx`](Examples/task-stats/TaskStatsCard.tsx)):

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

### Aufgaben in einer Datenbank speichern

Aufgaben laufen über das Interface `TaskRepository`. Die SQLite-Variante nutzt das in Node.js eingebaute `node:sqlite` und besteht dieselben Vertragstests wie die In-Memory-Variante ([`Examples/sqlite-repository`](Examples/sqlite-repository)). Tausche sie in `createServerApp()` in `src/server/app.ts` ein:

```ts
tasks: new SqliteTaskRepository('data/tasks.db', { maxPerUser: MAX_TASKS_PER_USER }),
```

## Demo

| Anmeldung                                                  | Aufgaben                                             | Einstellungen                                           |
| ---------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------- |
| ![Anmeldebildschirm, hell](docs/images/sign-in-light.png)  | ![Aufgabenliste, hell](docs/images/tasks-light.png)  | ![Einstellungen, hell](docs/images/settings-light.png)  |
| ![Anmeldebildschirm, dunkel](docs/images/sign-in-dark.png) | ![Aufgabenliste, dunkel](docs/images/tasks-dark.png) | ![Einstellungen, dunkel](docs/images/settings-dark.png) |

Aufgenommen von einem Release-Build auf einem iPhone-17-Pro-Simulator mit iOS 27, verbunden mit dem Produktionsserver aus `npm run build && npm run serve`, mit [`scripts/capture-screenshots.sh`](scripts/capture-screenshots.sh). Das Skript steuert den [Maestro-Flow](.maestro/sign-up-and-tasks.yaml), der sich registriert, drei Aufgaben anlegt und eine davon abschließt.

## Dokumentation

API-Referenz und Artikel:

- [API-Referenz](https://muhittincamdali.github.io/ReactNativeStarter/) — die gemeinsamen Schemas und Limits, der API-Client, die Sitzung, die Übersetzungen und die Server-Module, mit TypeDoc aus den Kommentaren im Quellcode erzeugt.
- [CHANGELOG.md](CHANGELOG.md) — was sich in jeder Version geändert hat.

## Anleitungen

- [Erste Schritte](https://muhittincamdali.github.io/ReactNativeStarter/documents/Getting_started.html) — überall ausführen, die Ordnerstruktur, Skripte und das Umbenennen der App.
- [Ein Feature hinzufügen](https://muhittincamdali.github.io/ReactNativeStarter/documents/Adding_a_feature.html) — ein Schema, eine API-Route, ein Client-Aufruf, ein Screen und ihre Tests.
- [Deployment](https://muhittincamdali.github.io/ReactNativeStarter/documents/Deploying.html) — die API bereitstellen, die Daten behalten, die Apps darauf ausrichten und mit EAS bauen.
- [Sicherheit](https://muhittincamdali.github.io/ReactNativeStarter/documents/Security.html) — was der Starter schützt und was er dir überlässt.

Dieselben Anleitungen liegen als Markdown in [`Documentation/`](Documentation).

## Voraussetzungen

| Toolchain | Mindestversion                                                    |
| --------- | ----------------------------------------------------------------- |
| Node.js   | 22.14                                                             |
| Expo SDK  | 58 (React Native 0.88, React 19.3)                                |
| iOS       | 16.4, das Deployment-Target von Expo SDK 58 (getestet auf iOS 27) |
| Android   | 7.0 (API-Level 24), das Minimum von React Native 0.88             |

CI führt Lint, Typprüfungen, Tests und den Web-Build unter Node.js 22 und 24 aus. Die native App wird lokal mit Xcode 27.1 gebaut, und ihre Maestro-Flows werden ebenfalls lokal ausgeführt.

## Architektur

- **Routen sind Dateien.** `src/app` enthält die Screens und die API-Routes (Expo Router). Das Root-Layout hält den Splash-Screen offen, während die gespeicherte Sitzung gelesen wird, und zeigt dann über `Stack.Protected` die Gruppe `(app)` oder `(auth)`, sodass ein Deep Link einen Screen für angemeldete Nutzer nicht im abgemeldeten Zustand öffnen kann.
- **Die API besteht aus einfachen Funktionen.** Jede `+api.ts`-Datei besteht aus ein paar Zeilen, die `src/server` aufrufen: `http.ts` (begrenztes Lesen des Bodys, JSON-Antworten, Fehlerzuordnung), `accounts.ts`, `passwords.ts`, `sessions.ts`, `rate-limit.ts` und `tasks.ts`. `createServerApp()` verdrahtet sie; Tests bauen pro Test eine frische Instanz.
- **Der Speicher liegt hinter einem Interface.** `TaskRepository` macht die Routen unabhängig davon, wo Aufgaben liegen; die In-Memory-Variante ist der Standard, und das SQLite-Beispiel zeigt eine Datenbank.
- **Der Zustand der App ist klein.** Serverdaten liegen in React Query; die Sitzung (Token und Konto) und die Einstellungen (Erscheinungsbild, Sprache) sind zwei zustand-Stores. Die Sitzung wird mit `expo-secure-store` gespeichert, die Einstellungen mit AsyncStorage, und beide werden beim Zurücklesen validiert.
- **Fehler haben einen einzigen Typ.** Die API antwortet mit `{ error: { code, message, fields } }`; der Client wandelt jeden Fehler in einen `ApiError` mit einer Art (`network`, `timeout`, `http`, ...) um, und die Screens ordnen ihn einem übersetzten Satz zu. Feldfehler sind Übersetzungsschlüssel, daher erscheinen die Prüfungen der API beim richtigen Feld und in der richtigen Sprache.
- **Es wird nichts geloggt.** Die ESLint-Regel `no-console` ist in der App und in der API ein Fehler.

Die Prüfungen lokal ausführen:

```sh
npm run lint && npm run typecheck && npm test && npm run build
npm run ios          # development build on a simulator, then in another terminal:
npm run e2e:ios      # Maestro flows (sign-up, tasks, settings, form validation)
```

## Vor dem Produktiveinsatz

Die API hält Konten, Sitzungen, Aufgaben und Rate-Limit-Zähler im Speicher eines einzigen Prozesses, ausgelegt für eine Demo: 1.000 Konten und 100.000 Aufgaben. Ein Neustart leert ihn, und mehrere Serverinstanzen teilen ihn nicht. Bevor echte Nutzer kommen, verlege die Speicher in eine Datenbank und die Rate-Limit-Zähler in einen Speicher, den alle Instanzen teilen, gib die Client-Adresse von deinem Proxy weiter und ergänze Kontolöschung und Passwort-Zurücksetzung. Der [Sicherheitsleitfaden](Documentation/Security.md#demo-server-or-production) führt jeden Schritt auf.

## Roadmap

- Konto löschen und Passwort zurücksetzen – beides brauchen App Store Review und echte Nutzer.
- Dauerhafte Konten und Sitzungen neben dem SQLite-Aufgaben-Repository.
- Ein Android-Maestro-Lauf in CI auf einem Emulator.

## Mitwirken

Beiträge sind willkommen. Lies vor einem Pull Request den [Leitfaden für Beiträge](CONTRIBUTING.md) und den [Verhaltenskodex](https://github.com/muhittincamdali/.github/blob/main/CODE_OF_CONDUCT.md). Sicherheitsprobleme meldest du vertraulich, wie in der [Sicherheitsrichtlinie](SECURITY.md) beschrieben.

## Lizenz

Veröffentlicht unter der MIT-Lizenz. Siehe [LICENSE](LICENSE).
