import { json } from '@/server/http';

/** `GET /api/health`: answers `{ "status": "ok" }` while the server runs. */
export function GET(): Response {
  return json({ status: 'ok' });
}
