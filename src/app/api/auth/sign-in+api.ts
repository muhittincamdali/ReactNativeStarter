import { getServerApp } from '@/server/app';
import { clientKey } from '@/server/client-address';
import { handle, json, readJson } from '@/server/http';
import { signInSchema } from '@/shared/schemas';

/**
 * `POST /api/auth/sign-in`: answers a session, `401` for wrong credentials and `429` when a limit
 * is reached.
 */
export function POST(request: Request): Promise<Response> {
  return handle(async () => {
    const input = await readJson(request, signInSchema);
    return json(await getServerApp().accounts.signIn(input, clientKey(request)));
  });
}
