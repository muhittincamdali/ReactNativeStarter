/**
 * A typed `fetch` wrapper: a time limit for the whole exchange, a response size limit enforced
 * while the body streams in, the bearer token, and every answer parsed with a zod schema from
 * `src/shared/schemas`.
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

// Settles like `promise`, or rejects as soon as `signal` aborts, for fetch implementations whose
// body reads do not stop on abort.
function untilAborted<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  if (signal.aborted) return Promise.reject(new DOMException('Aborted', 'AbortError'));
  return new Promise<T>((resolve, reject) => {
    const onAbort = () => reject(new DOMException('Aborted', 'AbortError'));
    signal.addEventListener('abort', onAbort, { once: true });
    promise.then(resolve, reject).finally(() => signal.removeEventListener('abort', onAbort));
  });
}

/** Creates an API client. */
export function createApiClient(options: ApiClientOptions): ApiClient {
  const fetchImpl = options.fetch ?? fetch;
  const timeoutMs = options.timeoutMs ?? REQUEST_TIMEOUT_MS;
  const maxBytes = options.maxResponseBytes ?? MAX_RESPONSE_BYTES;

  function tooLarge(status: number): ApiError {
    return new ApiError('invalid-response', 'The answer is too large.', status);
  }

  // Reads the body as a stream and stops at maxBytes. React Native's fetch has no body stream and
  // resolves only once the whole body has arrived, so there only its length can be checked.
  async function readBody(response: Response, signal: AbortSignal): Promise<string> {
    const declared = Number(response.headers.get('content-length') ?? '0');
    if (Number.isFinite(declared) && declared > maxBytes) throw tooLarge(response.status);
    const reader = response.body?.getReader();
    if (!reader || typeof TextDecoder === 'undefined') {
      const text = await untilAborted(response.text(), signal);
      // UTF-16 length is at most the UTF-8 byte length, so this never rejects a body within the limit.
      if (text.length > maxBytes) throw tooLarge(response.status);
      return text;
    }
    const decoder = new TextDecoder();
    let text = '';
    let total = 0;
    try {
      for (;;) {
        const { done, value } = await untilAborted(reader.read(), signal);
        if (done) return text + decoder.decode();
        total += value.byteLength;
        if (total > maxBytes) throw tooLarge(response.status);
        text += decoder.decode(value, { stream: true });
      }
    } catch (error) {
      reader.cancel().catch(() => undefined);
      throw error;
    }
  }

  // The time limit covers the whole exchange, from sending the request to the last byte of the
  // answer, so a server that sends its body slowly cannot hold the request open.
  async function exchange(
    path: string,
    init: RequestInit,
    signal?: AbortSignal,
  ): Promise<{ response: Response; text: string }> {
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
    const failure = (error: unknown, message: string): unknown => {
      if (error instanceof ApiError) return error;
      if (timedOut) return new ApiError('timeout', 'The server did not answer in time.');
      if (signal?.aborted) return error;
      return new ApiError('network', message);
    };
    try {
      let response: Response;
      try {
        response = await fetchImpl(`${options.baseUrl}${path}`, {
          ...init,
          signal: controller.signal,
        });
      } catch (error) {
        throw failure(error, 'Could not reach the server.');
      }
      try {
        return { response, text: await readBody(response, controller.signal) };
      } catch (error) {
        throw failure(error, 'The connection broke while reading the answer.');
      }
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', forwardAbort);
    }
  }

  return {
    async request(path, { method = 'GET', body, schema, signal } = {}) {
      const token = options.getToken();
      const headers: Record<string, string> = { Accept: 'application/json' };
      if (body !== undefined) headers['Content-Type'] = 'application/json';
      if (token) headers.Authorization = `Bearer ${token}`;
      const { response, text } = await exchange(
        path,
        { method, headers, body: body === undefined ? undefined : JSON.stringify(body) },
        signal,
      );
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
