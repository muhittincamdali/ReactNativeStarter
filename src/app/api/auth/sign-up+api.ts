import { getServerApp } from '@/server/app';
import { handle, json, readJson } from '@/server/http';
import { signUpSchema } from '@/shared/schemas';

/** `POST /api/auth/sign-up`: creates an account and answers `201` with a session. */
export function POST(request: Request): Promise<Response> {
  return handle(async () => {
    const input = await readJson(request, signUpSchema);
    return json(await getServerApp().accounts.signUp(input), 201);
  });
}
