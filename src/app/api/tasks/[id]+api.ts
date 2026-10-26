import { getServerApp } from '@/server/app';
import { handle, HttpError, json, noContent, readJson } from '@/server/http';
import { idSchema, updateTaskSchema } from '@/shared/schemas';

function taskId(params: Record<string, string | string[] | undefined>): string {
  const parsed = idSchema.safeParse(params.id);
  if (!parsed.success) throw notFound();
  return parsed.data;
}

function notFound(): HttpError {
  return new HttpError(404, 'not_found', 'No task with this id.');
}

/** `PATCH /api/tasks/:id`: changes the title, the state or both. */
export function PATCH(request: Request, params: Record<string, string>): Promise<Response> {
  return handle(async () => {
    const { accounts, tasks } = getServerApp();
    const user = await accounts.authenticate(request);
    const id = taskId(params);
    const changes = await readJson(request, updateTaskSchema);
    const task = tasks.update(user.id, id, changes);
    if (!task) throw notFound();
    return json(task);
  });
}

/** `DELETE /api/tasks/:id`: deletes a task and answers `204`. */
export function DELETE(request: Request, params: Record<string, string>): Promise<Response> {
  return handle(async () => {
    const { accounts, tasks } = getServerApp();
    const user = await accounts.authenticate(request);
    if (!tasks.remove(user.id, taskId(params))) throw notFound();
    return noContent();
  });
}
