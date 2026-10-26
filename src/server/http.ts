/**
 * Request reading and response writing for the API routes.
 *
 * Bodies are read as a stream and abandoned at {@link MAX_REQUEST_BYTES}, so a client cannot make
 * the server buffer more than that, whatever `Content-Length` says. Errors are answered as
 * `{ error: { code, message, fields? } }` and nothing is written to a log.
 *
 * @module
 */
import type { z } from 'zod';

import { MAX_REQUEST_BYTES } from '@/shared/limits';
import { fieldErrors } from '@/shared/schemas';

/** An error that becomes an HTTP answer. `code` is stable; `message` is for developers. */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly fields?: Record<string, string>,
    readonly headers: Record<string, string> = {},
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

const BASE_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
} as const;

/** A JSON answer with `Cache-Control: no-store`. */
export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...BASE_HEADERS, ...headers } });
}

/** A `204 No Content` answer. */
export function noContent(): Response {
  return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
}

function errorResponse(error: HttpError): Response {
  const headers: Record<string, string> =
    error.status === 401 ? { 'WWW-Authenticate': 'Bearer', ...error.headers } : error.headers;
  const body = {
    error: {
      code: error.code,
      message: error.message,
      ...(error.fields ? { fields: error.fields } : {}),
    },
  };
  return json(body, error.status, headers);
}

/**
 * Runs a route handler and turns a thrown {@link HttpError} into its answer. Any other error is
 * answered `500 internal` without its message, which could hold user data.
 */
export async function handle(run: () => Promise<Response>): Promise<Response> {
  try {
    return await run();
  } catch (error) {
    if (error instanceof HttpError) return errorResponse(error);
    return errorResponse(
      new HttpError(500, 'internal', 'The server could not complete the request.'),
    );
  }
}

function isJsonMediaType(contentType: string | null): boolean {
  if (!contentType) return false;
  const mediaType = contentType.split(';', 1)[0]?.trim().toLowerCase();
  return mediaType === 'application/json';
}

async function readLimitedBytes(request: Request, limit: number): Promise<Uint8Array> {
  const declared = request.headers.get('content-length');
  if (declared !== null && (!/^[0-9]{1,15}$/.test(declared) || Number(declared) > limit)) {
    throw new HttpError(413, 'payload_too_large', `The body must be at most ${limit} bytes.`);
  }
  if (!request.body) return new Uint8Array(0);
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > limit) {
      await reader.cancel();
      throw new HttpError(413, 'payload_too_large', `The body must be at most ${limit} bytes.`);
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

/**
 * Reads a JSON body and validates it.
 *
 * | Problem | Answer |
 * | --- | --- |
 * | `Content-Type` is not `application/json` | `415 unsupported_media_type` |
 * | more than `limit` bytes (declared or streamed) | `413 payload_too_large` |
 * | not UTF-8, or not JSON | `400 invalid_json` |
 * | JSON that fails `schema` | `422 validation_failed` with `fields` |
 */
export async function readJson<Schema extends z.ZodType>(
  request: Request,
  schema: Schema,
  limit = MAX_REQUEST_BYTES,
): Promise<z.output<Schema>> {
  if (!isJsonMediaType(request.headers.get('content-type'))) {
    throw new HttpError(415, 'unsupported_media_type', 'Send the body as application/json.');
  }
  const bytes = await readLimitedBytes(request, limit);
  let parsed: unknown;
  try {
    parsed = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } catch {
    throw new HttpError(400, 'invalid_json', 'The body is not valid UTF-8 JSON.');
  }
  const result = schema.safeParse(parsed);
  if (!result.success) {
    throw new HttpError(
      422,
      'validation_failed',
      'Some fields are not valid.',
      fieldErrors(result.error),
    );
  }
  return result.data;
}

const BEARER = /^Bearer ([A-Za-z0-9_-]{43})$/;

/** The session token of `Authorization: Bearer <token>`, or `null` when it is missing or malformed. */
export function bearerToken(request: Request): string | null {
  const header = request.headers.get('authorization');
  if (!header || header.length > 64) return null;
  return BEARER.exec(header)?.[1] ?? null;
}
