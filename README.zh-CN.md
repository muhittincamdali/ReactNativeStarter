<!-- i18n-source: README.md@e710ff19fabecf77a6d22e7ad05eba52ba44f827 status=reviewed -->
<!-- brand:start -->

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/banner-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/banner-light.svg" alt="React Native Starter: An Expo app with its own API: accounts, a task list, light and dark themes, two languages and tests."></picture></p>

<!-- lang-selector:start -->
<p align="center"><a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a></p>
<!-- lang-selector:end -->

<p align="center">
<a href="https://github.com/muhittincamdali/ReactNativeStarter/actions/workflows/ci.yml"><img src="https://github.com/muhittincamdali/ReactNativeStarter/actions/workflows/ci.yml/badge.svg" alt="CI 状态"></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/releases"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-version-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-version-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-version-light.svg" alt="最新版本: v2.0.0"></picture></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/blob/main/package.json"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-language-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-language-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-language-light.svg" alt="语言版本: Node.js 22.14+"></picture></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-license-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-license-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-license-light.svg" alt="许可证: MIT"></picture></a>
</p>

<p align="center">
<a href="#快速开始"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-start-zh-CN-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-start-zh-CN-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-start-zh-CN-light.svg" alt="开始使用"></picture></a>
<a href="https://muhittincamdali.github.io/ReactNativeStarter/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-docs-zh-CN-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-docs-zh-CN-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-docs-zh-CN-light.svg" alt="文档"></picture></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/tree/main/Examples"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-examples-zh-CN-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-examples-zh-CN-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-examples-zh-CN-light.svg" alt="示例"></picture></a>
</p>

> 本文是英文 README 的译文。如两者内容不一致，以英文版为准。

<!-- brand:end -->

这是一个可以直接作为起点的 Expo 应用：它能在 iOS、Android 和 Web 上运行，并以 Expo Router API routes 的形式自带后端，因此执行 `npm ci` 和 `npx expo start` 之后，注册、登录和任务列表即可端到端运行，无需再搭建任何其他服务器。它面向希望第一天就拥有可运行应用的开发者：账号、数据、主题、翻译和测试一应俱全，代码是可以阅读和修改的 TypeScript，而不是一个只有空白页面的文件夹。

## 亮点

- **后端就在同一个项目里** — `src/app/api` 中的 API routes 负责注册、登录、登出，以及任务的创建、列表、更新和删除。开发服务器会把它们与应用一起运行，`npm run build` 则会将它们导出，可部署到 Node.js、EAS Hosting、Vercel、Netlify 或 Cloudflare。
- **两端共用一套 schema** — 请求和响应的结构是 `src/shared` 中的 zod schema；API 用它们校验每个请求体，应用用它们解析每个响应。
- **认真对待账号安全** — PBKDF2 密码哈希（600,000 次迭代）、仅以 SHA-256 哈希保存的随机会话 token、保存在 iOS Keychain 和 Android Keystore 中的 token、按客户端地址限制登录和注册：受到攻击的账号只会被放慢，账号主人不会被锁在外面，以及对错误地址和错误密码返回相同的响应。
- **从设计上设限** — 以流的方式读取 16 KiB 的请求体、1 MiB 的响应、每个账号 500 个任务、每页最多 100 条、严格的整数查询参数，以及有上限的会话表和限流表：任何请求都无法让服务器占用更多内存或循环更长时间。
- **为真实用户准备好** — 浅色和深色主题、带类型化键的英语和土耳其语、可容忍离线的登录、乐观式（optimistic）任务更新、无障碍角色与标签，以及 48 点的触控目标。
- **从 schema 到屏幕都有测试** — 281 个 Jest 测试，其中一个会在同一进程内用真实的 API 处理程序渲染真实的屏幕；另外还有在 iOS 模拟器上运行已构建应用的 Maestro 流程。

## 快速开始

**1. 获取代码**

```sh
git clone https://github.com/muhittincamdali/ReactNativeStarter.git my-app
cd my-app
npm ci
```

需要 [Node.js](https://nodejs.org/) 22.14 或更高版本。若只是在浏览器中试用，无需安装其他任何东西。

**2. 启动**

```sh
npx expo start
```

这会同时启动应用及其 API。按 **w** 在浏览器中打开，按 **i** 打开 iOS 模拟器，按 **a** 打开 Android 模拟器，也可以用同一网络下手机上的 [Expo Go](https://expo.dev/go) 应用扫描二维码。

**3. 开始使用**

点击 **New here? Create an account**，输入姓名、电子邮件地址和至少八个字符的密码，即可进入你的任务列表。添加一个任务，点击圆圈将其标记为完成，再切换到 **Settings** 试试深色主题或土耳其语。编辑 `src/features/tasks/TasksScreen.tsx`，保存后屏幕就会更新。

## 安装

这个仓库本身就是应用：按上面的方式克隆它，用 `rm -rf .git && git init` 开启你自己的提交历史，然后把它改成你的应用：

1. 在 `app.json` 中修改 `name`、`slug`、`scheme`、`ios.bundleIdentifier` 和 `android.package`。
2. 替换 `assets/icon.svg`，然后运行 `node scripts/render-icons.mjs`，由它生成所有图标。
3. 在 `src/theme/index.ts` 中修改颜色，在 `src/lib/i18n/` 中修改文案。

如果要以原生开发构建（native development build）而不是 Expo Go 来运行，请使用 `npm run ios`（装有 Xcode 的 macOS）或 `npm run android`（Android Studio）。

## 使用方法

下面的示例复制自 [`Examples/`](Examples)，该目录由 `npm run typecheck` 编译、由 `npm test` 运行。

### 添加一个 API route

`src/app/api` 中名为 `<name>+api.ts` 的文件会响应 `/api/<name>`。`handle()` 会把抛出的 `HttpError` 转换成对应的响应，`authenticate()` 则只放行已登录的请求（[`Examples/task-stats/stats+api.ts`](Examples/task-stats/stats+api.ts)）：

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

### 在应用中调用它

API 客户端会附加会话 token、时间限制和大小限制，并用 zod schema 解析响应；如果不匹配，会以 `ApiError` 的形式失败，而不会传到屏幕上（[`Examples/task-stats/schema.ts`](Examples/task-stats/schema.ts)）：

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

### 在屏幕上展示

React Query 负责加载数据；`errorMessageKey()` 把任何失败转换成一句已翻译的提示（[`Examples/task-stats/TaskStatsCard.tsx`](Examples/task-stats/TaskStatsCard.tsx)）：

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

### 把任务存入数据库

任务通过 `TaskRepository` 接口读写。SQLite 版本使用 Node.js 内置的 `node:sqlite`，并与内存版本通过同一套契约测试（[`Examples/sqlite-repository`](Examples/sqlite-repository)）。在 `src/server/app.ts` 的 `createServerApp()` 中替换即可：

```ts
tasks: new SqliteTaskRepository('data/tasks.db', { maxPerUser: MAX_TASKS_PER_USER }),
```

## 演示

| 登录                                             | 任务                                           | 设置                                          |
| ------------------------------------------------ | ---------------------------------------------- | --------------------------------------------- |
| ![登录界面，浅色](docs/images/sign-in-light.png) | ![任务列表，浅色](docs/images/tasks-light.png) | ![设置，浅色](docs/images/settings-light.png) |
| ![登录界面，深色](docs/images/sign-in-dark.png)  | ![任务列表，深色](docs/images/tasks-dark.png)  | ![设置，深色](docs/images/settings-dark.png)  |

截图来自 iPhone 17 Pro 模拟器（iOS 27）上的 Release 构建，应用连接的是由 `npm run build && npm run serve` 启动的生产服务器，由 [`scripts/capture-screenshots.sh`](scripts/capture-screenshots.sh) 完成截取。该脚本会驱动 [Maestro 流程](.maestro/sign-up-and-tasks.yaml)：注册、添加三个任务并完成其中一个。

## 文档

API 参考文档与文章：

- [API 参考](https://muhittincamdali.github.io/ReactNativeStarter/) — 共享的 schema 和限制、API 客户端、会话、翻译以及服务端模块，由 TypeDoc 根据源码注释生成。
- [CHANGELOG.md](CHANGELOG.md) — 每个版本的变更内容。

## 指南

- [入门](https://muhittincamdali.github.io/ReactNativeStarter/documents/Getting_started.html) — 在各个平台上运行、目录结构、脚本，以及为应用改名。
- [添加功能](https://muhittincamdali.github.io/ReactNativeStarter/documents/Adding_a_feature.html) — schema、API route、客户端调用、屏幕及其测试。
- [部署](https://muhittincamdali.github.io/ReactNativeStarter/documents/Deploying.html) — 部署 API、保存数据、让应用指向它，并用 EAS 构建应用。
- [安全](https://muhittincamdali.github.io/ReactNativeStarter/documents/Security.html) — 这个起步项目保护了什么，又把什么留给了你。

同样的指南也以 Markdown 形式放在 [`Documentation/`](Documentation) 中。

## 系统要求

| 工具链   | 最低版本                                            |
| -------- | --------------------------------------------------- |
| Node.js  | 22.14                                               |
| Expo SDK | 58（React Native 0.88，React 19.3）                 |
| iOS      | 16.4，即 Expo SDK 58 的部署目标（在 iOS 27 上测试） |
| Android  | 7.0（API 级别 24），即 React Native 0.88 的最低要求 |

CI 在 Node.js 22 和 24 上运行 lint、类型检查、测试和 Web 构建。原生应用的构建以及其 Maestro 流程，则在本地使用 Xcode 27.1 完成。

## 架构

- **路由就是文件。** `src/app` 存放屏幕和 API routes（Expo Router）。根 layout 在读取已保存的会话期间保持启动画面，随后通过 `Stack.Protected` 显示 `(app)` 或 `(auth)` 分组，因此 deep link 无法在未登录时打开需要登录的屏幕。
- **API 就是普通函数。** 每个 `+api.ts` 文件只有几行，用来调用 `src/server`：`http.ts`（有上限的请求体读取、JSON 响应、错误映射）、`accounts.ts`、`passwords.ts`、`sessions.ts`、`rate-limit.ts` 和 `tasks.ts`。`createServerApp()` 把它们组装起来；测试则为每个测试新建一个实例。
- **存储位于接口之后。** `TaskRepository` 让路由与任务的存放位置无关；默认使用内存版本，SQLite 示例则展示了如何接入数据库。
- **应用的状态很小。** 服务端数据放在 React Query 中；会话（token 和账号）以及偏好设置（外观、语言）是两个 zustand store；会话通过 `expo-secure-store` 保存，偏好设置通过 AsyncStorage 保存，两者在读回时都会经过校验。
- **错误只有一种类型。** API 返回 `{ error: { code, message, fields } }`；客户端把每个失败都转换成带有类别（`network`、`timeout`、`http`……）的 `ApiError`，屏幕再把它映射为一句已翻译的提示。字段错误是翻译键，因此 API 的校验结果会以正确的语言显示在正确的字段下方。
- **不输出任何日志。** ESLint 的 `no-console` 规则在应用和 API 中都是 error 级别。

在本地运行检查：

```sh
npm run lint && npm run typecheck && npm test && npm run build
npm run ios          # development build on a simulator, then in another terminal:
npm run e2e:ios      # Maestro flows (sign-up, tasks, settings, form validation)
```

## 上线生产之前

API 把账号、会话、任务和限流计数都保存在单个进程的内存里，规模按演示设计：1,000 个账号和 100,000 个任务。重启会清空这些数据，多个服务器实例之间也不共享。在真实用户到来之前，请把这些存储迁移到数据库，把限流计数迁移到所有实例共享的存储，从你的代理传递客户端地址，并加上删除账号和重置密码的功能。[安全指南](Documentation/Security.md#demo-server-or-production)列出了每一步。

## 路线图

- 账号删除和密码重置，这是 App Store Review 和真实用户所需要的。
- 在 SQLite 任务存储之外，增加持久化的账号和会话。
- 在 CI 中通过模拟器运行 Android 的 Maestro 流程。

## 参与贡献

欢迎参与贡献。提交 pull request 之前，请先阅读[贡献指南](CONTRIBUTING.md)和[行为准则](https://github.com/muhittincamdali/.github/blob/main/CODE_OF_CONDUCT.md)。如发现安全问题，请按照[安全策略](SECURITY.md)私下报告。

## 许可证

基于 MIT 许可证发布。详见 [LICENSE](LICENSE)。
