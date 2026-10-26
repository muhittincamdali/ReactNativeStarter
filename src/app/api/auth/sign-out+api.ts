import { getServerApp } from '@/server/app';
import { handle, noContent } from '@/server/http';

/** `POST /api/auth/sign-out`: ends the session of the bearer token and answers `204`. */
export function POST(request: Request): Promise<Response> {
  return handle(async () => {
    await getServerApp().accounts.signOut(request);
    return noContent();
  });
}
