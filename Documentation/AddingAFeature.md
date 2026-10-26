---
title: Adding a feature
group: Guides
---

# Adding a feature

A feature usually touches four layers: a schema, an API route, a call from the app and a screen.
This guide adds task statistics ("3 of 5 done") through all four. The finished code, with tests, is
in [`Examples/task-stats`](https://github.com/muhittincamdali/ReactNativeStarter/tree/main/Examples/task-stats).

## 1. Describe the data once

Put the shape of the answer next to the other shared schemas. The API builds it and the app
parses it, so a renamed field breaks a test instead of a screen.

```ts
// src/shared/schemas.ts (or a file of its own, as in the example)
export const taskStatsSchema = z.object({
  total: z.number().int().nonnegative(),
  done: z.number().int().nonnegative(),
  open: z.number().int().nonnegative(),
});
export type TaskStats = z.infer<typeof taskStatsSchema>;
```

## 2. Add the API route

A file named `src/app/api/stats+api.ts` answers `/api/stats`. Export one function per HTTP method.
Wrap the body in `handle()` so a thrown `HttpError` becomes its answer and any other error becomes
a `500` without details, and call `authenticate()` first so only signed-in requests get through.

```ts
import { getServerApp } from '@/server/app';
import { handle, json } from '@/server/http';
import { MAX_PAGE_SIZE, MAX_TASKS_PER_USER } from '@/shared/limits';

const MAX_PAGES = Math.ceil(MAX_TASKS_PER_USER / MAX_PAGE_SIZE);

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

Every loop in the API has a fixed upper bound. Here it is `MAX_PAGES`: an account holds at most
500 tasks, so counting reads at most five pages whatever the data looks like.

If the route reads a body, read it with `readJson(request, schema)`: it refuses anything that is
not `application/json`, stops at 16 KiB and answers `422` with field errors when the schema does
not match. Read query parameters that are numbers with `parseBoundedInteger()` rather than
`Number()`, which would accept `""`, `"1e3"` and `"Infinity"`.

## 3. Call it from the app

Add a function to `createApi()` in `src/lib/api.ts`. The client adds the session token, applies the
time and size limits and parses the answer with the schema:

```ts
stats: () => client.request('/api/stats', { schema: taskStatsSchema }),
```

## 4. Show it

Read it with React Query in a component. Errors arrive as an `ApiError`, and `errorMessageKey()`
turns one into a translated sentence:

```tsx
const api = useApi();
const stats = useQuery({ queryKey: ['task-stats'], queryFn: () => api.stats() });
```

When a mutation changes the numbers, invalidate the query so it loads again:
`queryClient.invalidateQueries({ queryKey: ['task-stats'] })`.

Text shown to people goes through `t()`. Add the key to `src/lib/i18n/en.ts` first; the type of
`tr.ts` then fails until the Turkish text is added too.

## 5. Test each layer

- **Route**: call the exported `GET` with a `Request`, as `__tests__/server/routes.test.ts` does.
  Use `createServerApp({ iterations: 1_000 })` so password hashing is fast in tests.
- **Client**: give `createApiClient` a `fetch` that calls the route directly; the example's
  `stats.node.test.ts` checks the route and the client together this way.
- **Screen**: render the component with `@testing-library/react-native` inside a
  `QueryClientProvider`, and pass a fake API through `ApiProvider`.
- **Whole app**: `__tests__/app/full-stack.test.tsx` renders the real route files with
  `renderRouter` and answers every request from the real API handlers; add a step there when the
  feature changes a user journey.

Files that end in `.node.test.ts` run under Node.js (`node:sqlite`, Web Crypto, `Request`); files
under `__tests__/app` and `*.test.tsx` in `Examples/` run with the React Native preset.
