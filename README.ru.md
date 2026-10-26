<!-- i18n-source: README.md@467b99b41b2762a14345517b546a0b0320caf6ff status=reviewed -->
<!-- brand:start -->

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/banner-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/banner-light.svg" alt="React Native Starter: An Expo app with its own API: accounts, a task list, light and dark themes, two languages and tests."></picture></p>

<!-- lang-selector:start -->
<p align="center"><a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a></p>
<!-- lang-selector:end -->

<p align="center">
<a href="https://github.com/muhittincamdali/ReactNativeStarter/actions/workflows/ci.yml"><img src="https://github.com/muhittincamdali/ReactNativeStarter/actions/workflows/ci.yml/badge.svg" alt="Статус CI"></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/releases"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-version-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-version-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-version-light.svg" alt="Последняя версия: v1.0.0"></picture></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/blob/main/package.json"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-language-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-language-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-language-light.svg" alt="Версия языка: Node.js 22.14+"></picture></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-license-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-license-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-license-light.svg" alt="Лицензия: MIT"></picture></a>
</p>

<p align="center">
<a href="#быстрый-старт"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-start-ru-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-start-ru-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-start-ru-light.svg" alt="Начать"></picture></a>
<a href="https://muhittincamdali.github.io/ReactNativeStarter/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-docs-ru-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-docs-ru-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-docs-ru-light.svg" alt="Документация"></picture></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/tree/main/Examples"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-examples-ru-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-examples-ru-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-examples-ru-light.svg" alt="Примеры"></picture></a>
</p>

> Это перевод README на английском языке. Если они расходятся, актуальна английская версия.

<!-- brand:end -->

Приложение на Expo, с которого удобно начинать: оно работает на iOS, Android и в вебе и несёт собственный бэкенд в виде API routes Expo Router, поэтому регистрация, вход и список задач работают от начала до конца после `npm ci` и `npx expo start`, без какого-либо другого сервера. Оно рассчитано на разработчиков, которым с первого дня нужно работающее приложение с аккаунтами, данными, темами, переводами и тестами, написанное на TypeScript, который можно прочитать и изменить, а не папка с пустыми экранами.

## Основные возможности

- **Бэкенд в том же проекте** — API routes в `src/app/api` обрабатывают регистрацию, вход и выход, а также создание, получение списка, обновление и удаление задач. Сервер разработки запускает их рядом с приложением, а `npm run build` экспортирует их для Node.js, EAS Hosting, Vercel, Netlify или Cloudflare.
- **Одна схема для обеих сторон** — формы запросов и ответов описаны схемами zod в `src/shared`; API проверяет по ним каждое тело запроса, а приложение разбирает по ним каждый ответ.
- **Аккаунты, сделанные аккуратно** — хеши паролей PBKDF2 (600 000 итераций), случайные токены сессий, которые хранятся только в виде хешей SHA-256, токены в iOS Keychain и Android Keystore, ограничения входа и регистрации по адресу клиента, которые замедляют атакуемый аккаунт, а не блокируют его владельца и одинаковый ответ на неверный адрес и неверный пароль.
- **Ограничено по замыслу** — тела запросов по 16 KiB, читаемые потоком, ответы до 1 MiB, 500 задач на аккаунт, страницы не более 100 записей, строгие целочисленные параметры запроса и таблицы сессий и ограничителя с предельным размером: ни один запрос не заставит сервер занимать больше памяти или работать в цикле дольше.
- **Готово для людей** — светлая и тёмная темы, английский и турецкий с типизированными ключами, вход, устойчивый к отсутствию сети, оптимистичные обновления задач, роли и метки доступности и области касания в 48 пунктов.
- **Протестировано от схемы до экрана** — 250 тестов Jest, включая тест, который в одном процессе отрисовывает настоящие экраны поверх настоящих обработчиков API, а также сценарии Maestro, которые запускают собранное приложение в симуляторе iOS.

## Быстрый старт

**1. Получите код**

```sh
git clone https://github.com/muhittincamdali/ReactNativeStarter.git my-app
cd my-app
npm ci
```

Нужен [Node.js](https://nodejs.org/) версии 22.14 или новее. Чтобы попробовать приложение в браузере, больше ничего устанавливать не нужно.

**2. Запустите**

```sh
npx expo start
```

Команда запускает приложение и его API вместе. Нажмите **w**, чтобы открыть приложение в браузере, **i** — в симуляторе iOS, **a** — в эмуляторе Android, или отсканируйте QR-код приложением [Expo Go](https://expo.dev/go) на телефоне в той же сети.

**3. Пользуйтесь**

Нажмите **New here? Create an account**, введите имя, адрес электронной почты и пароль не короче восьми символов, и вы попадёте в список своих задач. Добавьте задачу, нажмите на кружок, чтобы отметить её выполненной, и перейдите в **Settings**, чтобы попробовать тёмную тему или турецкий язык. Измените `src/features/tasks/TasksScreen.tsx`, и экран обновится сразу после сохранения.

## Установка

Репозиторий и есть приложение: клонируйте его, как показано выше, начните собственную историю командой `rm -rf .git && git init` и сделайте приложение своим:

1. В `app.json` измените `name`, `slug`, `scheme`, `ios.bundleIdentifier` и `android.package`.
2. Замените `assets/icon.svg` и выполните `node scripts/render-icons.mjs`, чтобы создать из него все значки.
3. Измените цвета в `src/theme/index.ts`, а тексты — в `src/lib/i18n/`.

Чтобы запустить приложение как нативную сборку для разработки, а не в Expo Go, используйте `npm run ios` (macOS с Xcode) или `npm run android` (Android Studio).

## Использование

Примеры ниже скопированы из каталога [`Examples/`](Examples), который компилируется командой `npm run typecheck` и тестируется командой `npm test`.

### Добавьте API route

Файл в `src/app/api` с именем `<name>+api.ts` отвечает на `/api/<name>`. `handle()` превращает выброшенный `HttpError` в соответствующий ответ, а `authenticate()` пропускает только запросы с выполненным входом ([`Examples/task-stats/stats+api.ts`](Examples/task-stats/stats+api.ts)):

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

### Вызовите его из приложения

API-клиент добавляет токен сессии, ограничение по времени и ограничение по размеру и разбирает ответ по схеме zod; несоответствие приводит к ошибке `ApiError`, а не доходит до экрана ([`Examples/task-stats/schema.ts`](Examples/task-stats/schema.ts)):

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

### Покажите его на экране

React Query загружает данные; `errorMessageKey()` превращает любую ошибку в переведённую фразу ([`Examples/task-stats/TaskStatsCard.tsx`](Examples/task-stats/TaskStatsCard.tsx)):

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

### Храните задачи в базе данных

Задачи проходят через интерфейс `TaskRepository`. Версия на SQLite использует встроенный в Node.js модуль `node:sqlite` и проходит те же контрактные тесты, что и версия в памяти ([`Examples/sqlite-repository`](Examples/sqlite-repository)). Подставьте её внутри `createServerApp()` в `src/server/app.ts`:

```ts
tasks: new SqliteTaskRepository('data/tasks.db', { maxPerUser: MAX_TASKS_PER_USER }),
```

## Демо

| Вход                                                        | Задачи                                                     | Настройки                                                  |
| ----------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------- |
| ![Экран входа, светлая тема](docs/images/sign-in-light.png) | ![Список задач, светлая тема](docs/images/tasks-light.png) | ![Настройки, светлая тема](docs/images/settings-light.png) |
| ![Экран входа, тёмная тема](docs/images/sign-in-dark.png)   | ![Список задач, тёмная тема](docs/images/tasks-dark.png)   | ![Настройки, тёмная тема](docs/images/settings-dark.png)   |

Снимки сделаны в Release-сборке на симуляторе iPhone 17 Pro с iOS 27, подключённой к рабочему серверу, запущенному командой `npm run build && npm run serve`, скриптом [`scripts/capture-screenshots.sh`](scripts/capture-screenshots.sh). Скрипт запускает [сценарий Maestro](.maestro/sign-up-and-tasks.yaml): регистрация, добавление трёх задач и выполнение одной из них.

## Документация

Справочник API и статьи:

- [Справочник API](https://muhittincamdali.github.io/ReactNativeStarter/) — общие схемы и ограничения, API-клиент, сессия, переводы и серверные модули; создаётся TypeDoc из комментариев в исходном коде.
- [CHANGELOG.md](CHANGELOG.md) — что изменилось в каждой версии.

## Руководства

- [Начало работы](https://muhittincamdali.github.io/ReactNativeStarter/documents/Getting_started.html) — запуск на любой платформе, структура папок, скрипты и переименование приложения.
- [Добавление функции](https://muhittincamdali.github.io/ReactNativeStarter/documents/Adding_a_feature.html) — схема, API route, вызов из клиента, экран и тесты к ним.
- [Развёртывание](https://muhittincamdali.github.io/ReactNativeStarter/documents/Deploying.html) — как запустить API, сохранить данные, направить приложения на него и собрать их с помощью EAS.
- [Безопасность](https://muhittincamdali.github.io/ReactNativeStarter/documents/Security.html) — что стартовый проект защищает и что оставляет на вас.

Те же руководства лежат в [`Documentation/`](Documentation) в формате Markdown.

## Требования

| Инструменты | Минимальная версия                                                    |
| ----------- | --------------------------------------------------------------------- |
| Node.js     | 22.14                                                                 |
| Expo SDK    | 58 (React Native 0.88, React 19.3)                                    |
| iOS         | 16.4 — целевая версия развёртывания Expo SDK 58 (проверено на iOS 27) |
| Android     | 7.0 (уровень API 24) — минимум для React Native 0.88                  |

CI запускает lint, проверку типов, тесты и веб-сборку на Node.js 22 и 24. Нативное приложение собирается, а его сценарии Maestro запускаются локально с Xcode 27.1.

## Архитектура

- **Маршруты — это файлы.** В `src/app` лежат экраны и API routes (Expo Router). Корневой layout не убирает заставку, пока читается сохранённая сессия, а затем через `Stack.Protected` показывает группу `(app)` или `(auth)`, поэтому deep link не может открыть экран для вошедших пользователей, если вход не выполнен.
- **API — это обычные функции.** Каждый файл `+api.ts` состоит из нескольких строк, которые вызывают код из `src/server`: `http.ts` (чтение тела с ограничением, ответы JSON, сопоставление ошибок), `accounts.ts`, `passwords.ts`, `sessions.ts`, `rate-limit.ts` и `tasks.ts`. `createServerApp()` соединяет их; тесты создают новый экземпляр для каждого теста.
- **Хранилище спрятано за интерфейсом.** `TaskRepository` делает маршруты независимыми от того, где лежат задачи; по умолчанию используется версия в памяти, а пример с SQLite показывает работу с базой данных.
- **Состояние приложения небольшое.** Данные сервера хранятся в React Query; сессия (токен и аккаунт) и настройки (оформление, язык) — это два хранилища zustand; сессия сохраняется через `expo-secure-store`, настройки — через AsyncStorage, и оба проверяются при чтении.
- **У ошибок один тип.** API отвечает `{ error: { code, message, fields } }`; клиент превращает любую ошибку в `ApiError` с видом (`network`, `timeout`, `http`, ...), а экраны сопоставляют его с переведённой фразой. Ошибки полей — это ключи перевода, поэтому проверки API показываются под нужным полем и на нужном языке.
- **Ничего не пишется в лог.** Правило ESLint `no-console` считается ошибкой и в приложении, и в API.

Запустите проверки локально:

```sh
npm run lint && npm run typecheck && npm test && npm run build
npm run ios          # development build on a simulator, then in another terminal:
npm run e2e:ios      # Maestro flows (sign-up, tasks, settings, form validation)
```

## Перед продакшеном

API хранит аккаунты, сессии, задачи и счётчики ограничения запросов в памяти одного процесса, рассчитанной на демо: 1 000 аккаунтов и 100 000 задач. Перезапуск очищает её, а несколько экземпляров сервера её не разделяют. Прежде чем придут настоящие пользователи, перенесите хранилища в базу данных, а счётчики ограничений — в хранилище, общее для всех экземпляров, передавайте адрес клиента от вашего прокси и добавьте удаление аккаунта и сброс пароля. Каждый шаг описан в [руководстве по безопасности](Documentation/Security.md#demo-server-or-production).

## План развития

- Удаление аккаунта и сброс пароля, которые нужны и App Store Review, и реальным пользователям.
- Постоянные аккаунты и сессии рядом с хранилищем задач на SQLite.
- Запуск Maestro для Android в CI на эмуляторе.

## Участие в разработке

Мы рады вашему участию. Перед открытием pull request прочитайте [руководство для участников](CONTRIBUTING.md) и [кодекс поведения](https://github.com/muhittincamdali/.github/blob/main/CODE_OF_CONDUCT.md). О проблемах безопасности сообщайте конфиденциально, как описано в [политике безопасности](SECURITY.md).

## Лицензия

Распространяется по лицензии MIT. Подробнее — в файле [LICENSE](LICENSE).
