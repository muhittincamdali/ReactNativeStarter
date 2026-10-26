import { getServerApp } from '@/server/app';
import { clientKey } from '@/server/client-address';
import { handle, json, readJson } from '@/server/http';
import { signUpSchema } from '@/shared/schemas';

/**
 * `POST /api/auth/sign-up`: creates an account and answers `201` with a session, `409` for a
 * taken address, `429` after too many sign-ups from one client and `503` when the server is full.
 */
export function POST(request: Request): Promise<Response> {
  return handle(async () => {
    const input = await readJson(request, signUpSchema);
    return json(await getServerApp().accounts.signUp(input, clientKey(request)), 201);
  });
}
