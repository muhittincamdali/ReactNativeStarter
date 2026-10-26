import { getServerApp } from '@/server/app';
import { handle, HttpError, json, readJson } from '@/server/http';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MAX_TASKS_PER_USER } from '@/shared/limits';
import { parseBoundedInteger } from '@/shared/numbers';
import { createTaskSchema, idSchema } from '@/shared/schemas';

/**
 * `GET /api/tasks?limit=&cursor=`: a page of the account's tasks, newest first.
 * `limit` is 1–100 (default 50); `cursor` is the `nextCursor` of the previous page.
 */
export function GET(request: Request): Promise<Response> {
  return handle(async () => {
    const { accounts, tasks } = getServerApp();
    const user = await accounts.authenticate(request);
    const query = new URL(request.url).searchParams;
    const limit = parseBoundedInteger(query.get('limit'), {
      min: 1,
      max: MAX_PAGE_SIZE,
      fallback: DEFAULT_PAGE_SIZE,
    });
    if (!limit.ok) {
      throw new HttpError(
        400,
        'invalid_query',
        `limit must be an integer from 1 to ${MAX_PAGE_SIZE}.`,
        {
          limit: 'validation.invalid',
        },
      );
    }
    const rawCursor = query.get('cursor');
    const cursor = rawCursor === null ? undefined : idSchema.safeParse(rawCursor);
    if (cursor && !cursor.success) {
      throw new HttpError(400, 'invalid_query', 'cursor is not a task id.', {
        cursor: 'validation.invalid',
      });
    }
    const page = tasks.list(user.id, { limit: limit.value, cursor: cursor?.data });
    if (!page) {
      throw new HttpError(400, 'invalid_query', 'cursor names no task of this account.', {
        cursor: 'validation.invalid',
      });
    }
    return json(page);
  });
}

/** `POST /api/tasks`: adds a task and answers `201`, or `409 task_limit` at 500 tasks. */
export function POST(request: Request): Promise<Response> {
  return handle(async () => {
    const { accounts, tasks } = getServerApp();
    const user = await accounts.authenticate(request);
    const { title } = await readJson(request, createTaskSchema);
    const task = tasks.create(user.id, title);
    if (!task) {
      throw new HttpError(
        409,
        'task_limit',
        `An account can keep at most ${MAX_TASKS_PER_USER} tasks.`,
      );
    }
    return json(task, 201);
  });
}
