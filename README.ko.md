<!-- i18n-source: README.md@467b99b41b2762a14345517b546a0b0320caf6ff status=reviewed -->
<!-- brand:start -->

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/banner-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/banner-light.svg" alt="React Native Starter: An Expo app with its own API: accounts, a task list, light and dark themes, two languages and tests."></picture></p>

<!-- lang-selector:start -->
<p align="center"><a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a></p>
<!-- lang-selector:end -->

<p align="center">
<a href="https://github.com/muhittincamdali/ReactNativeStarter/actions/workflows/ci.yml"><img src="https://github.com/muhittincamdali/ReactNativeStarter/actions/workflows/ci.yml/badge.svg" alt="CI 상태"></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/releases"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-version-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-version-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-version-light.svg" alt="최신 버전: v1.0.0"></picture></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/blob/main/package.json"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-language-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-language-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-language-light.svg" alt="언어 버전: Node.js 22.14+"></picture></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-license-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-license-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-license-light.svg" alt="라이선스: MIT"></picture></a>
</p>

<p align="center">
<a href="#빠른-시작"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-start-ko-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-start-ko-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-start-ko-light.svg" alt="시작하기"></picture></a>
<a href="https://muhittincamdali.github.io/ReactNativeStarter/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-docs-ko-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-docs-ko-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-docs-ko-light.svg" alt="문서"></picture></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/tree/main/Examples"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-examples-ko-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-examples-ko-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-examples-ko-light.svg" alt="예제"></picture></a>
</p>

> 이 문서는 영어 README의 번역본입니다. 내용이 다를 경우 영어 버전이 최신입니다.

<!-- brand:end -->

바로 시작점으로 삼을 수 있는 Expo 앱입니다. iOS, Android, 웹에서 실행되며 백엔드를 Expo Router API routes로 내장하고 있어서, `npm ci`와 `npx expo start`만 실행하면 다른 서버를 따로 준비하지 않아도 회원가입, 로그인, 할 일 목록이 처음부터 끝까지 동작합니다. 빈 화면만 있는 폴더가 아니라, 계정, 데이터, 테마, 번역, 테스트를 갖춘 동작하는 앱을 첫날부터 쓰고 싶은 개발자를 위한 것이며, 읽고 바꿀 수 있는 TypeScript로 작성되어 있습니다.

## 주요 기능

- **같은 프로젝트 안의 백엔드** — `src/app/api`의 API routes가 회원가입, 로그인, 로그아웃과 할 일의 생성, 목록 조회, 수정, 삭제를 처리합니다. 개발 서버는 이를 앱과 함께 실행하고, `npm run build`는 Node.js, EAS Hosting, Vercel, Netlify, Cloudflare용으로 내보냅니다.
- **양쪽이 공유하는 하나의 schema** — 요청과 응답의 형태는 `src/shared`의 zod schema입니다. API는 모든 본문을 이 schema로 검증하고, 앱은 모든 응답을 이 schema로 파싱합니다.
- **꼼꼼하게 만든 계정** — PBKDF2 비밀번호 해시(반복 600,000회), SHA-256 해시로만 저장되는 무작위 세션 토큰, iOS Keychain과 Android Keystore에 보관되는 토큰, 공격받는 계정의 소유자를 잠그지 않고 속도만 늦추는, 클라이언트 주소별 로그인·가입 제한, 그리고 잘못된 주소와 잘못된 비밀번호에 대한 동일한 응답.
- **설계 단계부터 한도를 둠** — 스트림으로 읽는 16 KiB 요청 본문, 1 MiB 응답, 계정당 할 일 500개, 최대 100개 단위의 페이지, 엄격한 정수 쿼리 매개변수, 상한이 있는 세션 테이블과 제한기(limiter) 테이블. 어떤 요청도 서버가 더 많은 메모리를 붙잡거나 더 오래 반복하게 만들 수 없습니다.
- **사용자를 위한 준비** — 라이트 테마와 다크 테마, 타입이 지정된 키를 쓰는 영어와 터키어, 오프라인에 강한 로그인, 낙관적(optimistic) 할 일 업데이트, 접근성 역할과 레이블, 48포인트 터치 영역.
- **schema부터 화면까지 테스트** — 실제 화면을 실제 API 핸들러에 연결해 같은 프로세스에서 렌더링하는 테스트를 포함한 250개의 Jest 테스트와, 빌드된 앱을 iOS 시뮬레이터에서 실행하는 Maestro 플로우가 있습니다.

## 빠른 시작

**1. 코드 받기**

```sh
git clone https://github.com/muhittincamdali/ReactNativeStarter.git my-app
cd my-app
npm ci
```

[Node.js](https://nodejs.org/) 22.14 이상이 필요합니다. 브라우저에서 사용해 보는 데는 다른 것을 설치할 필요가 없습니다.

**2. 실행하기**

```sh
npx expo start
```

앱과 API가 함께 시작됩니다. **w**를 누르면 브라우저에서, **i**를 누르면 iOS 시뮬레이터에서, **a**를 누르면 Android 에뮬레이터에서 열리며, 같은 네트워크의 휴대폰에서 [Expo Go](https://expo.dev/go) 앱으로 QR 코드를 스캔할 수도 있습니다.

**3. 사용하기**

**New here? Create an account**를 탭하고 이름, 이메일 주소, 8자 이상의 비밀번호를 입력하면 할 일 목록 화면이 나타납니다. 할 일을 추가하고, 원을 탭해 완료로 표시한 뒤, **Settings**로 이동해 다크 테마나 터키어를 사용해 보세요. `src/features/tasks/TasksScreen.tsx`를 수정하고 저장하면 화면이 바로 업데이트됩니다.

## 설치

이 저장소가 곧 앱입니다. 위와 같이 클론한 다음 `rm -rf .git && git init`으로 자신만의 기록을 새로 시작하고, 내 앱으로 만드세요.

1. `app.json`에서 `name`, `slug`, `scheme`, `ios.bundleIdentifier`, `android.package`를 바꿉니다.
2. `assets/icon.svg`를 교체한 뒤 `node scripts/render-icons.mjs`를 실행해 모든 아이콘을 생성합니다.
3. 색상은 `src/theme/index.ts`에서, 문구는 `src/lib/i18n/`에서 바꿉니다.

Expo Go 대신 네이티브 개발 빌드로 실행하려면 `npm run ios`(Xcode가 설치된 macOS) 또는 `npm run android`(Android Studio)를 사용하세요.

## 사용법

아래 예제는 [`Examples/`](Examples)에서 복사한 것으로, 이 디렉터리는 `npm run typecheck`로 컴파일되고 `npm test`로 실행됩니다.

### API route 추가하기

`src/app/api`에 있는 `<name>+api.ts` 파일은 `/api/<name>` 요청에 응답합니다. `handle()`은 던져진 `HttpError`를 해당 응답으로 바꾸고, `authenticate()`는 로그인한 요청만 통과시킵니다([`Examples/task-stats/stats+api.ts`](Examples/task-stats/stats+api.ts)).

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

### 앱에서 호출하기

API 클라이언트는 세션 토큰, 시간 제한, 크기 제한을 추가하고 응답을 zod schema로 파싱합니다. 일치하지 않으면 화면에 도달하기 전에 `ApiError`로 실패합니다([`Examples/task-stats/schema.ts`](Examples/task-stats/schema.ts)).

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

### 화면에 표시하기

데이터는 React Query가 불러오고, `errorMessageKey()`는 모든 실패를 번역된 문장으로 바꿔 줍니다([`Examples/task-stats/TaskStatsCard.tsx`](Examples/task-stats/TaskStatsCard.tsx)).

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

### 할 일을 데이터베이스에 보관하기

할 일은 `TaskRepository` 인터페이스를 통해 처리됩니다. SQLite 버전은 Node.js에 내장된 `node:sqlite`를 사용하며 인메모리 버전과 같은 컨트랙트 테스트를 통과합니다([`Examples/sqlite-repository`](Examples/sqlite-repository)). `src/server/app.ts`의 `createServerApp()` 안에서 교체하세요.

```ts
tasks: new SqliteTaskRepository('data/tasks.db', { maxPerUser: MAX_TASKS_PER_USER }),
```

## 데모

| 로그인                                                | 할 일                                              | 설정                                            |
| ----------------------------------------------------- | -------------------------------------------------- | ----------------------------------------------- |
| ![로그인 화면, 라이트](docs/images/sign-in-light.png) | ![할 일 목록, 라이트](docs/images/tasks-light.png) | ![설정, 라이트](docs/images/settings-light.png) |
| ![로그인 화면, 다크](docs/images/sign-in-dark.png)    | ![할 일 목록, 다크](docs/images/tasks-dark.png)    | ![설정, 다크](docs/images/settings-dark.png)    |

스크린샷은 iOS 27이 설치된 iPhone 17 Pro 시뮬레이터의 Release 빌드에서, `npm run build && npm run serve`로 실행한 프로덕션 서버에 연결해 [`scripts/capture-screenshots.sh`](scripts/capture-screenshots.sh)로 촬영했습니다. 이 스크립트는 회원가입을 하고 할 일 세 개를 추가한 뒤 하나를 완료하는 [Maestro 플로우](.maestro/sign-up-and-tasks.yaml)를 실행합니다.

## 문서

API 레퍼런스와 문서:

- [API 레퍼런스](https://muhittincamdali.github.io/ReactNativeStarter/) — 공유 schema와 한도, API 클라이언트, 세션, 번역, 서버 모듈을 소스 코드 주석에서 TypeDoc으로 생성한 문서입니다.
- [CHANGELOG.md](CHANGELOG.md) — 버전별 변경 사항.

## 가이드

- [시작하기](https://muhittincamdali.github.io/ReactNativeStarter/documents/Getting_started.html) — 모든 환경에서 실행하기, 폴더 구조, 스크립트, 앱 이름 바꾸기.
- [기능 추가하기](https://muhittincamdali.github.io/ReactNativeStarter/documents/Adding_a_feature.html) — schema, API route, 클라이언트 호출, 화면, 그리고 그 테스트.
- [배포하기](https://muhittincamdali.github.io/ReactNativeStarter/documents/Deploying.html) — API 제공, 데이터 보관, 앱이 API를 가리키게 하기, EAS로 빌드하기.
- [보안](https://muhittincamdali.github.io/ReactNativeStarter/documents/Security.html) — 스타터가 보호하는 것과 사용자에게 맡기는 것.

같은 가이드가 Markdown 형식으로 [`Documentation/`](Documentation)에도 있습니다.

## 요구 사항

| 툴체인   | 최소 버전                                             |
| -------- | ----------------------------------------------------- |
| Node.js  | 22.14                                                 |
| Expo SDK | 58 (React Native 0.88, React 19.3)                    |
| iOS      | 16.4, Expo SDK 58의 배포 타깃 (iOS 27에서 테스트함)   |
| Android  | 7.0 (API 레벨 24), React Native 0.88의 최소 요구 사항 |

CI는 Node.js 22와 24에서 lint, 타입 검사, 테스트, 웹 빌드를 실행합니다. 네이티브 앱은 Xcode 27.1로 로컬에서 빌드하고 Maestro 플로우도 로컬에서 실행합니다.

## 아키텍처

- **라우트는 파일입니다.** `src/app`에 화면과 API routes가 있습니다(Expo Router). 루트 layout은 저장된 세션을 읽는 동안 스플래시 화면을 유지한 다음 `Stack.Protected`로 `(app)` 또는 `(auth)` 그룹을 보여 주므로, deep link로도 로그아웃 상태에서 로그인이 필요한 화면을 열 수 없습니다.
- **API는 평범한 함수입니다.** 각 `+api.ts` 파일은 `src/server`를 호출하는 몇 줄로 이루어져 있습니다. `http.ts`(한도가 있는 본문 읽기, JSON 응답, 오류 매핑), `accounts.ts`, `passwords.ts`, `sessions.ts`, `rate-limit.ts`, `tasks.ts`가 있습니다. `createServerApp()`이 이들을 연결하며, 테스트는 테스트마다 새것을 만듭니다.
- **저장소는 인터페이스 뒤에 있습니다.** `TaskRepository` 덕분에 라우트는 할 일이 어디에 저장되는지와 무관합니다. 기본값은 인메모리 버전이고, SQLite 예제는 데이터베이스를 쓰는 방법을 보여 줍니다.
- **앱의 상태는 작습니다.** 서버 데이터는 React Query에 있고, 세션(토큰과 계정)과 환경설정(화면 모드, 언어)은 두 개의 zustand store입니다. 세션은 `expo-secure-store`에, 환경설정은 AsyncStorage에 저장되며 둘 다 다시 읽을 때 검증합니다.
- **오류의 타입은 하나입니다.** API는 `{ error: { code, message, fields } }`로 응답하고, 클라이언트는 모든 실패를 종류(`network`, `timeout`, `http`, ...)가 있는 `ApiError`로 바꾸며, 화면은 이를 번역된 문장에 대응시킵니다. 필드 오류는 번역 키이므로 API의 검사 결과가 올바른 필드 아래에 올바른 언어로 표시됩니다.
- **아무것도 로그로 남기지 않습니다.** ESLint의 `no-console` 규칙은 앱과 API에서 error입니다.

검사를 로컬에서 실행하려면 다음과 같이 합니다.

```sh
npm run lint && npm run typecheck && npm test && npm run build
npm run ios          # development build on a simulator, then in another terminal:
npm run e2e:ios      # Maestro flows (sign-up, tasks, settings, form validation)
```

## 프로덕션 전에

API는 계정, 세션, 할 일, 요청 제한 카운트를 하나의 프로세스 메모리에 보관하며, 규모는 데모용(계정 1,000개, 할 일 100,000개)입니다. 재시작하면 비워지고, 여러 서버 인스턴스는 이를 공유하지 않습니다. 실제 사용자를 받기 전에 저장소를 데이터베이스로, 요청 제한 카운트를 모든 인스턴스가 공유하는 저장소로 옮기고, 프록시에서 클라이언트 주소를 전달하고, 계정 삭제와 비밀번호 재설정을 추가하세요. 각 단계는 [보안 가이드](Documentation/Security.md#demo-server-or-production)에 정리되어 있습니다.

## 로드맵

- App Store Review와 실제 사용자에게 필요한 계정 삭제와 비밀번호 재설정.
- SQLite 할 일 저장소와 함께 쓸 영속적인 계정과 세션.
- CI에서 에뮬레이터로 실행하는 Android Maestro.

## 기여하기

기여를 환영합니다. pull request를 열기 전에 [기여 가이드](CONTRIBUTING.md)와 [행동 강령](https://github.com/muhittincamdali/.github/blob/main/CODE_OF_CONDUCT.md)을 읽어 주세요. 보안 문제는 [보안 정책](SECURITY.md)에 따라 비공개로 제보해 주세요.

## 라이선스

MIT 라이선스로 배포됩니다. 자세한 내용은 [LICENSE](LICENSE)를 참고하세요.
