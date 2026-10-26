// GET /api/stats: how many tasks the signed-in account has, and how many are done.
// Copy this file to src/app/api/stats+api.ts to serve it.
import { getServerApp } from '@/server/app';
import { handle, json } from '@/server/http';
import { MAX_PAGE_SIZE, MAX_TASKS_PER_USER } from '@/shared/limits';

// An account holds at most MAX_TASKS_PER_USER tasks, so counting never reads more pages than this.
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
