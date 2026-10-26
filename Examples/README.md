# Examples

Code to copy into the starter when you need it. Each folder type-checks with the app
(`npm run typecheck`), passes ESLint and has tests that run in `npm test`, so it keeps working as
the starter changes.

| Folder                                   | What it adds                                                                                                    | Tests                                                                               |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| [`task-stats`](task-stats)               | `GET /api/stats` (task counts for the signed-in account), a typed client call and a card that shows the numbers | the route and the client together under Node.js; the card's loaded and error states |
| [`sqlite-repository`](sqlite-repository) | A `TaskRepository` backed by SQLite through Node.js's built-in `node:sqlite`, so tasks survive a restart        | the same contract run against the in-memory repository and the SQLite one           |

## Use one

**task-stats**

1. Copy `stats+api.ts` to `src/app/api/stats+api.ts` and `schema.ts` next to it, or into
   `src/shared/`.
2. Show `<TaskStatsCard fetchStats={(signal) => fetchTaskStats(client, signal)} />` on a screen, or
   add `stats` to `createApi()` in `src/lib/api.ts` as the
   [Adding a feature](../Documentation/AddingAFeature.md) guide does.

**sqlite-repository**

1. Copy `SqliteTaskRepository.ts` to `src/server/`.
2. In `createServerApp()` (`src/server/app.ts`), replace `new MemoryTaskRepository(...)` with
   `new SqliteTaskRepository('data/tasks.db', { maxPerUser: MAX_TASKS_PER_USER })`.

`node:sqlite` needs Node.js 22.13 or later on the server. The web build and the apps are not
affected: the repository runs only inside the API routes.

## Run the tests

```sh
npx jest Examples
```
