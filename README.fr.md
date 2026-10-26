<!-- i18n-source: README.md@e710ff19fabecf77a6d22e7ad05eba52ba44f827 status=reviewed -->
<!-- brand:start -->

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/banner-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/banner-light.svg" alt="React Native Starter: An Expo app with its own API: accounts, a task list, light and dark themes, two languages and tests."></picture></p>

<!-- lang-selector:start -->
<p align="center"><a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a></p>
<!-- lang-selector:end -->

<p align="center">
<a href="https://github.com/muhittincamdali/ReactNativeStarter/actions/workflows/ci.yml"><img src="https://github.com/muhittincamdali/ReactNativeStarter/actions/workflows/ci.yml/badge.svg" alt="État de la CI"></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/releases"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-version-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-version-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-version-light.svg" alt="Dernière version: v2.0.0"></picture></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/blob/main/package.json"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-language-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-language-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-language-light.svg" alt="Version du langage: Node.js 22.14+"></picture></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-license-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-license-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-license-light.svg" alt="Licence: MIT"></picture></a>
</p>

<p align="center">
<a href="#démarrage-rapide"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-start-fr-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-start-fr-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-start-fr-light.svg" alt="Commencer"></picture></a>
<a href="https://muhittincamdali.github.io/ReactNativeStarter/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-docs-fr-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-docs-fr-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-docs-fr-light.svg" alt="Documentation"></picture></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/tree/main/Examples"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-examples-fr-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-examples-fr-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-examples-fr-light.svg" alt="Exemples"></picture></a>
</p>

> Ceci est une traduction du README anglais. En cas de différence, la version anglaise fait foi.

<!-- brand:end -->

Une application Expo pour démarrer : elle fonctionne sur iOS, Android et le web, et embarque son propre backend sous forme d’API routes Expo Router. L’inscription, la connexion et une liste de tâches marchent donc de bout en bout après `npm ci` et `npx expo start`, sans aucun autre serveur à installer. Elle s’adresse aux développeurs qui veulent, dès le premier jour, une application fonctionnelle avec des comptes, des données, des thèmes, des traductions et des tests, écrite en TypeScript qu’ils peuvent lire et modifier, plutôt qu’un dossier d’écrans vides.

## Points forts

- **Un backend dans le même projet** — les API routes de `src/app/api` gèrent l’inscription, la connexion et la déconnexion, ainsi que la création, la liste, la mise à jour et la suppression des tâches. Le serveur de développement les exécute à côté de l’application, et `npm run build` les exporte pour Node.js, EAS Hosting, Vercel, Netlify ou Cloudflare.
- **Un seul schéma pour les deux côtés** — les formes des requêtes et des réponses sont des schémas zod dans `src/shared` ; l’API valide chaque corps avec eux et l’application analyse chaque réponse avec eux.
- **Des comptes soignés** — hachages de mot de passe PBKDF2 (600 000 itérations), jetons de session aléatoires stockés uniquement sous forme de hachages SHA-256, jetons conservés dans le Keychain d’iOS et le Keystore d’Android, des limites de connexion et d’inscription par adresse de client qui ralentissent un compte attaqué au lieu d’en bloquer le propriétaire, et la même réponse pour une adresse incorrecte et pour un mot de passe incorrect.
- **Bornée dès la conception** — corps de requête de 16 KiB lus en flux, réponses de 1 MiB, 500 tâches par compte, pages de 100 éléments au plus, paramètres de requête entiers stricts, tables de sessions et de limitation plafonnées : aucune requête ne peut obliger le serveur à retenir plus de mémoire ni à boucler plus longtemps.
- **Prête pour les utilisateurs** — thèmes clair et sombre, anglais et turc avec des clés typées, connexion tolérante au mode hors ligne, mises à jour optimistes des tâches, rôles et libellés d’accessibilité, et zones tactiles de 48 points.
- **Testée du schéma jusqu’à l’écran** — 281 tests Jest, dont un qui affiche les vrais écrans face aux vrais gestionnaires de l’API dans le même processus, ainsi que des flux Maestro qui exécutent l’application compilée sur un simulateur iOS.

## Démarrage rapide

**1. Récupérer le code**

```sh
git clone https://github.com/muhittincamdali/ReactNativeStarter.git my-app
cd my-app
npm ci
```

Il vous faut [Node.js](https://nodejs.org/) 22.14 ou plus récent. Rien d’autre n’est à installer pour l’essayer dans un navigateur.

**2. La lancer**

```sh
npx expo start
```

Cela démarre l’application et son API ensemble. Appuyez sur **w** pour l’ouvrir dans votre navigateur, **i** pour le simulateur iOS, **a** pour l’émulateur Android, ou scannez le code QR avec l’application [Expo Go](https://expo.dev/go) sur un téléphone connecté au même réseau.

**3. L’utiliser**

Touchez **New here? Create an account**, saisissez un nom, une adresse e-mail et un mot de passe d’au moins huit caractères, et vous arrivez sur votre liste de tâches. Ajoutez une tâche, touchez le cercle pour la terminer, puis passez à **Settings** pour essayer le thème sombre ou le turc. Modifiez `src/features/tasks/TasksScreen.tsx` et l’écran se met à jour dès que vous enregistrez.

## Installation

Le dépôt est l’application : clonez-le comme ci-dessus, démarrez votre propre historique avec `rm -rf .git && git init`, puis faites-en la vôtre :

1. Dans `app.json`, modifiez `name`, `slug`, `scheme`, `ios.bundleIdentifier` et `android.package`.
2. Remplacez `assets/icon.svg` et exécutez `node scripts/render-icons.mjs` pour en générer toutes les icônes.
3. Modifiez les couleurs dans `src/theme/index.ts` et les textes dans `src/lib/i18n/`.

Pour l’exécuter comme un build de développement natif plutôt qu’avec Expo Go, utilisez `npm run ios` (macOS avec Xcode) ou `npm run android` (Android Studio).

## Utilisation

Les exemples ci-dessous sont copiés depuis [`Examples/`](Examples), que `npm run typecheck` compile et que `npm test` exécute.

### Ajouter une API route

Un fichier de `src/app/api` nommé `<name>+api.ts` répond à `/api/<name>`. `handle()` transforme un `HttpError` levé en sa réponse, et `authenticate()` ne laisse passer que les requêtes authentifiées ([`Examples/task-stats/stats+api.ts`](Examples/task-stats/stats+api.ts)) :

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

### L’appeler depuis l’application

Le client d’API ajoute le jeton de session, une limite de temps et une limite de taille, puis analyse la réponse avec un schéma zod ; une réponse non conforme échoue sous la forme d’une `ApiError` au lieu d’atteindre un écran ([`Examples/task-stats/schema.ts`](Examples/task-stats/schema.ts)) :

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

### L’afficher sur un écran

React Query charge les données ; `errorMessageKey()` transforme n’importe quel échec en une phrase traduite ([`Examples/task-stats/TaskStatsCard.tsx`](Examples/task-stats/TaskStatsCard.tsx)) :

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

### Conserver les tâches dans une base de données

Les tâches passent par l’interface `TaskRepository`. La version SQLite utilise le module intégré `node:sqlite` de Node.js et réussit les mêmes tests de contrat que la version en mémoire ([`Examples/sqlite-repository`](Examples/sqlite-repository)). Remplacez-la dans `createServerApp()`, dans `src/server/app.ts` :

```ts
tasks: new SqliteTaskRepository('data/tasks.db', { maxPerUser: MAX_TASKS_PER_USER }),
```

## Démo

| Connexion                                                   | Tâches                                                  | Réglages                                           |
| ----------------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------- |
| ![Écran de connexion, clair](docs/images/sign-in-light.png) | ![Liste des tâches, clair](docs/images/tasks-light.png) | ![Réglages, clair](docs/images/settings-light.png) |
| ![Écran de connexion, sombre](docs/images/sign-in-dark.png) | ![Liste des tâches, sombre](docs/images/tasks-dark.png) | ![Réglages, sombre](docs/images/settings-dark.png) |

Captures réalisées à partir d’un build Release sur un simulateur d’iPhone 17 Pro sous iOS 27, connecté au serveur de production lancé par `npm run build && npm run serve`, avec [`scripts/capture-screenshots.sh`](scripts/capture-screenshots.sh). Le script pilote le [flux Maestro](.maestro/sign-up-and-tasks.yaml) qui crée un compte, ajoute trois tâches et en termine une.

## Documentation

Référence de l’API et articles :

- [Référence de l’API](https://muhittincamdali.github.io/ReactNativeStarter/) — les schémas et les limites partagés, le client d’API, la session, les traductions et les modules du serveur, générée par TypeDoc à partir des commentaires du code source.
- [CHANGELOG.md](CHANGELOG.md) — ce qui a changé dans chaque version.

## Guides

- [Premiers pas](https://muhittincamdali.github.io/ReactNativeStarter/documents/Getting_started.html) — l’exécuter partout, l’organisation des dossiers, les scripts et le changement de nom de l’application.
- [Ajouter une fonctionnalité](https://muhittincamdali.github.io/ReactNativeStarter/documents/Adding_a_feature.html) — un schéma, une API route, un appel côté client, un écran et leurs tests.
- [Déploiement](https://muhittincamdali.github.io/ReactNativeStarter/documents/Deploying.html) — servir l’API, conserver les données, y connecter les applications et les compiler avec EAS.
- [Sécurité](https://muhittincamdali.github.io/ReactNativeStarter/documents/Security.html) — ce que le starter protège et ce qu’il vous laisse.

Les mêmes guides se trouvent dans [`Documentation/`](Documentation) au format Markdown.

## Prérequis

| Chaîne d’outils | Version minimale                                               |
| --------------- | -------------------------------------------------------------- |
| Node.js         | 22.14                                                          |
| Expo SDK        | 58 (React Native 0.88, React 19.3)                             |
| iOS             | 16.4, la cible de déploiement d’Expo SDK 58 (testé sur iOS 27) |
| Android         | 7.0 (niveau d’API 24), le minimum de React Native 0.88         |

La CI exécute le lint, les vérifications de types, les tests et le build web sur Node.js 22 et 24. L’application native est compilée et ses flux Maestro sont exécutés en local avec Xcode 27.1.

## Architecture

- **Les routes sont des fichiers.** `src/app` contient les écrans et les API routes (Expo Router). Le layout racine garde l’écran de démarrage affiché pendant la lecture de la session enregistrée, puis montre le groupe `(app)` ou `(auth)` grâce à `Stack.Protected` : un deep link ne peut donc pas ouvrir un écran réservé aux utilisateurs connectés quand on est déconnecté.
- **L’API est faite de fonctions simples.** Chaque fichier `+api.ts` tient en quelques lignes qui appellent `src/server` : `http.ts` (lecture bornée du corps, réponses JSON, correspondance des erreurs), `accounts.ts`, `passwords.ts`, `sessions.ts`, `rate-limit.ts` et `tasks.ts`. `createServerApp()` les assemble ; les tests en construisent une nouvelle instance pour chaque test.
- **Le stockage est derrière une interface.** `TaskRepository` rend les routes indépendantes de l’endroit où vivent les tâches ; la version en mémoire est celle par défaut, et l’exemple SQLite montre une base de données.
- **L’état de l’application est réduit.** Les données du serveur vivent dans React Query ; la session (jeton et compte) et les préférences (apparence, langue) sont deux stores zustand ; la session est enregistrée avec `expo-secure-store`, les préférences avec AsyncStorage, et les deux sont validées à la relecture.
- **Les erreurs n’ont qu’un seul type.** L’API répond `{ error: { code, message, fields } }` ; le client transforme chaque échec en une `ApiError` avec un genre (`network`, `timeout`, `http`, ...), et les écrans l’associent à une phrase traduite. Les erreurs de champ sont des clés de traduction : les vérifications de l’API apparaissent donc sous le bon champ, dans la bonne langue.
- **Rien n’est journalisé.** La règle `no-console` d’ESLint est une erreur dans l’application et dans l’API.

Lancez les vérifications en local :

```sh
npm run lint && npm run typecheck && npm test && npm run build
npm run ios          # development build on a simulator, then in another terminal:
npm run e2e:ios      # Maestro flows (sign-up, tasks, settings, form validation)
```

## Avant la production

L’API garde les comptes, les sessions, les tâches et les compteurs de limitation dans la mémoire d’un seul processus, dimensionnée pour une démo : 1 000 comptes et 100 000 tâches. Un redémarrage la vide, et plusieurs instances du serveur ne la partagent pas. Avant l’arrivée de vrais utilisateurs, placez les données dans une base de données et les compteurs de limitation dans un stockage partagé par toutes les instances, transmettez l’adresse du client depuis votre proxy, et ajoutez la suppression de compte et la réinitialisation du mot de passe. Le [guide de sécurité](Documentation/Security.md#demo-server-or-production) détaille chaque étape.

## Feuille de route

- La suppression de compte et la réinitialisation du mot de passe, dont App Store Review et les vrais utilisateurs ont besoin.
- Des comptes et des sessions persistants à côté du dépôt de tâches SQLite.
- Une exécution Maestro pour Android en CI sur un émulateur.

## Contribuer

Les contributions sont les bienvenues. Lisez le [guide de contribution](CONTRIBUTING.md) et le [code de conduite](https://github.com/muhittincamdali/.github/blob/main/CODE_OF_CONDUCT.md) avant d’ouvrir une pull request. Signalez les problèmes de sécurité en privé, comme indiqué dans la [politique de sécurité](SECURITY.md).

## Licence

Publié sous licence MIT. Voir [LICENSE](LICENSE).
