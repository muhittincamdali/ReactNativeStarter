import { getServerApp } from '@/server/app';
import { handle, json, readJson } from '@/server/http';
import { signInSchema } from '@/shared/schemas';

/** `POST /api/auth/sign-in`: answers a session, `401` for wrong credentials, `429` when locked. */
export function POST(request: Request): Promise<Response> {
  return handle(async () => {
    const input = await readJson(request, signInSchema);
    return json(await getServerApp().accounts.signIn(input));
  });
}
