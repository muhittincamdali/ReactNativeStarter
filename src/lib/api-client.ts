/**
 * A typed `fetch` wrapper: a time limit, a response size limit, the bearer token, and every
 * answer parsed with a zod schema from `src/shared/schemas`.
 *
 * @module
 */
import type { z } from 'zod';

import { MAX_RESPONSE_BYTES, REQUEST_TIMEOUT_MS } from '@/shared/limits';
import { errorBodySchema } from '@/shared/schemas';

/** Why a request failed. */
export type ApiErrorKind =
  /** No API address is configured (a release build without `EXPO_PUBLIC_API_URL`). */
  | 'config'
  /** The request did not reach the server, or the connection broke. */
  | 'network'
  /** No answer within the time limit. */
  | 'timeout'
  /** The server answered with a 4xx or 5xx status. */
  | 'http'
  /** The answer was too large, not JSON, or did not match the expected schema. */
  | 'invalid-response';

/** The error every API call rejects with. */
export class ApiError extends Error {
  constructor(
    readonly kind: ApiErrorKind,
    message: string,
    readonly status?: number,
    readonly code?: string,
    readonly fields?: Record<string, string>,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  /** `true` for 4xx answers: sending the same request again will not help. */
  get isClientError(): boolean {
    return (
      this.kind === 'http' && this.status !== undefined && this.status >= 400 && this.status < 500
    );
  }
}

/** Options of {@link createApiClient}. */
export interface ApiClientOptions {
  /** Origin of the API (see `resolveApiBaseUrl`); `null` makes every call fail with `config`. */
  baseUrl: string | null;
  /** The current session token, read before each request. */
  getToken: () => string | null;
  /** Called when the server answers `401` to a request that carried a token. */
  onUnauthorized?: () => void;
  fetch?: typeof fetch;
  timeoutMs?: number;
  maxResponseBytes?: number;
}

/** Options of one request. */
export interface RequestOptions<Schema extends z.ZodType | undefined> {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  /** Sent as JSON. */
  body?: unknown;
  /** Schema of a successful answer; leave it out for `204 No Content`. */
  schema?: Schema;
  /** Cancels the request, for example when React Query drops a query. */
  signal?: AbortSignal;
}

/** The client returned by {@link createApiClient}. */
export interface ApiClient {
  request<Schema extends z.ZodType | undefined = undefined>(
    path: string,
    options?: RequestOptions<Schema>,
  ): Promise<Schema extends z.ZodType ? z.output<Schema> : void>;
}

function parseError(status: number, text: string): ApiError {
  try {
    const parsed = errorBodySchema.safeParse(JSON.parse(text));
    if (parsed.success) {
      const { code, message, fields } = parsed.data.error;
      return new ApiError('http', message, status, code, fields);
    }
  } catch {
    // Not JSON: a proxy or a crashed server; fall through to the generic error.
  }
  return new ApiError('http', `The server answered ${status}.`, status);
}

/** Creates an API client. */
export function createApiClient(options: ApiClientOptions): ApiClient {
  const fetchImpl = options.fetch ?? fetch;
  const timeoutMs = options.timeoutMs ?? REQUEST_TIMEOUT_MS;
  const maxBytes = options.maxResponseBytes ?? MAX_RESPONSE_BYTES;

  async function send(path: string, init: RequestInit, signal?: AbortSignal): Promise<Response> {
    if (options.baseUrl === null) {
      throw new ApiError('config', 'Set EXPO_PUBLIC_API_URL to the address of the API.');
    }
    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);
    const forwardAbort = () => controller.abort();
    signal?.addEventListener('abort', forwardAbort);
    try {
      return await fetchImpl(`${options.baseUrl}${path}`, { ...init, signal: controller.signal });
    } catch (error) {
      if (timedOut) throw new ApiError('timeout', 'The server did not answer in time.');
      if (signal?.aborted) throw error;
      throw new ApiError('network', 'Could not reach the server.');
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', forwardAbort);
    }
  }

  async function readText(response: Response): Promise<string> {
    const declared = Number(response.headers.get('content-length') ?? '0');
    if (Number.isFinite(declared) && declared > maxBytes) {
      throw new ApiError('invalid-response', 'The answer is too large.', response.status);
    }
    let text: string;
    try {
      text = await response.text();
    } catch {
      throw new ApiError('network', 'The connection broke while reading the answer.');
    }
    // UTF-16 length is at most the UTF-8 byte length, so this never rejects a body within the limit.
    if (text.length > maxBytes) {
      throw new ApiError('invalid-response', 'The answer is too large.', response.status);
    }
    return text;
  }

  return {
    async request(path, { method = 'GET', body, schema, signal } = {}) {
      const token = options.getToken();
      const headers: Record<string, string> = { Accept: 'application/json' };
      if (body !== undefined) headers['Content-Type'] = 'application/json';
      if (token) headers.Authorization = `Bearer ${token}`;
      const response = await send(
        path,
        { method, headers, body: body === undefined ? undefined : JSON.stringify(body) },
        signal,
      );
      const text = await readText(response);
      if (!response.ok) {
        if (response.status === 401 && token) options.onUnauthorized?.();
        throw parseError(response.status, text);
      }
      if (!schema) return undefined as never;
      let json: unknown;
      try {
        json = JSON.parse(text);
      } catch {
        throw new ApiError('invalid-response', 'The answer is not JSON.', response.status);
      }
      const parsed = schema.safeParse(json);
      if (!parsed.success) {
        throw new ApiError(
          'invalid-response',
          'The answer does not have the expected fields.',
          response.status,
        );
      }
      return parsed.data as never;
    },
  };
}
