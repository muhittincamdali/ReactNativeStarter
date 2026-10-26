import { getServerApp } from '@/server/app';
import { handle, json } from '@/server/http';

/** `GET /api/auth/me`: the signed-in account, or `401`. */
export function GET(request: Request): Promise<Response> {
  return handle(async () => json({ user: await getServerApp().accounts.authenticate(request) }));
}
