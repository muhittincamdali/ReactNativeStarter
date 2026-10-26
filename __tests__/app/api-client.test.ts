import { z } from 'zod';

import { ApiError, createApiClient, type ApiClientOptions } from '@/lib/api-client';

const schema = z.object({ value: z.number() });

function reply(body: string, init: ResponseInit = {}) {
  return jest.fn(async () => new Response(body, { status: 200, ...init }));
}

function client(overrides: Partial<ApiClientOptions> = {}) {
  return createApiClient({ baseUrl: 'https://api.test', getToken: () => null, ...overrides });
}

async function rejection(promise: Promise<unknown>): Promise<ApiError> {
  try {
    await promise;
  } catch (error) {
    if (error instanceof ApiError) return error;
    throw error;
  }
  throw new Error('expected an ApiError');
}

describe('createApiClient', () => {
  it('sends JSON with the bearer token and parses the answer with the schema', async () => {
    const fetch = reply('{"value":3}');
    const api = client({ fetch, getToken: () => 'T'.repeat(43) });
    await expect(
      api.request('/api/x', { method: 'POST', body: { a: 1 }, schema }),
    ).resolves.toEqual({ value: 3 });
    const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://api.test/api/x');
    expect(init.method).toBe('POST');
    expect(init.body).toBe('{"a":1}');
    expect(init.headers).toMatchObject({
      Authorization: `Bearer ${'T'.repeat(43)}`,
      'Content-Type': 'application/json',
    });
  });

  it('sends no Authorization header without a token', async () => {
    const fetch = reply('{"value":1}');
    await client({ fetch }).request('/api/x', { schema });
    const [, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(init.headers).not.toHaveProperty('Authorization');
  });

  it('resolves to undefined for 204 without a schema', async () => {
    const fetch = jest.fn(async () => new Response(null, { status: 204 }));
    await expect(
      client({ fetch }).request('/api/x', { method: 'DELETE' }),
    ).resolves.toBeUndefined();
  });

  it('turns an API error body into kind, status, code and fields', async () => {
    const body =
      '{"error":{"code":"validation_failed","message":"bad","fields":{"email":"validation.email"}}}';
    const error = await rejection(
      client({ fetch: reply(body, { status: 422 }) }).request('/api/x', { schema }),
    );
    expect(error).toMatchObject({
      kind: 'http',
      status: 422,
      code: 'validation_failed',
      fields: { email: 'validation.email' },
    });
    expect(error.isClientError).toBe(true);
  });

  it('turns a non-JSON error page into a plain http error', async () => {
    const error = await rejection(
      client({ fetch: reply('<html>502</html>', { status: 502 }) }).request('/api/x'),
    );
    expect(error).toMatchObject({ kind: 'http', status: 502, code: undefined });
    expect(error.isClientError).toBe(false);
  });

  it('calls onUnauthorized for a 401 only when a token was sent', async () => {
    const onUnauthorized = jest.fn();
    const body = '{"error":{"code":"unauthorized","message":"no"}}';
    await rejection(
      client({ fetch: reply(body, { status: 401 }), onUnauthorized }).request('/api/x'),
    );
    expect(onUnauthorized).not.toHaveBeenCalled();
    await rejection(
      client({ fetch: reply(body, { status: 401 }), onUnauthorized, getToken: () => 'x' }).request(
        '/api/x',
      ),
    );
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['not JSON', 'not json'],
    ['a missing field', '{}'],
    ['a field of the wrong type', '{"value":"3"}'],
  ])('rejects a successful answer that is %s as invalid-response', async (_, body) => {
    const error = await rejection(client({ fetch: reply(body) }).request('/api/x', { schema }));
    expect(error.kind).toBe('invalid-response');
  });

  it('rejects an answer whose Content-Length is above the limit without reading it', async () => {
    const response = new Response('{"value":1}', { headers: { 'content-length': '5000' } });
    const text = jest.spyOn(response, 'text');
    const api = client({ fetch: jest.fn(async () => response), maxResponseBytes: 1000 });
    const error = await rejection(api.request('/api/x', { schema }));
    expect(error.kind).toBe('invalid-response');
    expect(text).not.toHaveBeenCalled();
  });

  it('rejects an answer longer than the limit when no length is declared', async () => {
    const api = client({
      fetch: reply(`{"value":1,"pad":"${'x'.repeat(2000)}"}`),
      maxResponseBytes: 1000,
    });
    expect((await rejection(api.request('/api/x', { schema }))).kind).toBe('invalid-response');
  });

  it('stops reading a body without Content-Length once it passes the limit', async () => {
    let pulls = 0;
    let cancelled = false;
    const endless = new ReadableStream<Uint8Array>({
      pull(controller) {
        pulls += 1;
        controller.enqueue(new Uint8Array(400).fill(0x20));
      },
      cancel() {
        cancelled = true;
      },
    });
    const api = client({
      fetch: jest.fn(async () => new Response(endless)),
      maxResponseBytes: 1000,
    });
    expect((await rejection(api.request('/api/x', { schema }))).kind).toBe('invalid-response');
    // Three chunks pass the limit; the stream may have queued a couple more ahead of the reader.
    expect(pulls).toBeLessThanOrEqual(6);
    expect(cancelled).toBe(true);
  });

  it('keeps the time limit while the body is read', async () => {
    const stalled = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('{"value":'));
      },
    });
    const api = client({ fetch: jest.fn(async () => new Response(stalled)), timeoutMs: 20 });
    expect((await rejection(api.request('/api/x', { schema }))).kind).toBe('timeout');
  });

  it('reads a streamed answer split inside a multi-byte character', async () => {
    const bytes = new TextEncoder().encode('{"value":1,"name":"Çağrı"}');
    const split = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(bytes.slice(0, 21));
        controller.enqueue(bytes.slice(21));
        controller.close();
      },
    });
    const named = schema.extend({ name: z.string() });
    const api = client({ fetch: jest.fn(async () => new Response(split)) });
    await expect(api.request('/api/x', { schema: named })).resolves.toEqual({
      value: 1,
      name: 'Çağrı',
    });
  });

  it('reports a failed connection as network', async () => {
    const fetch = jest.fn(async () => {
      throw new TypeError('Network request failed');
    });
    expect((await rejection(client({ fetch }).request('/api/x'))).kind).toBe('network');
  });

  it('aborts after the time limit and reports timeout', async () => {
    const fetch = jest.fn(
      (_url: string, init?: RequestInit) =>
        new Promise<Response>((_, reject) => {
          init?.signal?.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError')),
          );
        }),
    );
    const error = await rejection(
      client({ fetch: fetch as typeof globalThis.fetch, timeoutMs: 20 }).request('/api/x'),
    );
    expect(error.kind).toBe('timeout');
  });

  it('passes a caller abort through instead of reporting it as a network error', async () => {
    const controller = new AbortController();
    const fetch = jest.fn(
      (_url: string, init?: RequestInit) =>
        new Promise<Response>((_, reject) => {
          init?.signal?.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError')),
          );
        }),
    );
    const pending = client({ fetch: fetch as typeof globalThis.fetch }).request('/api/x', {
      signal: controller.signal,
    });
    controller.abort();
    await expect(pending).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('does not start the request when the caller aborted before it', async () => {
    const controller = new AbortController();
    controller.abort();
    const fetch = jest.fn();
    const pending = client({ fetch }).request('/api/x', { signal: controller.signal });
    await expect(pending).rejects.toMatchObject({ name: 'AbortError' });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('fails with config, without a request, when there is no base URL', async () => {
    const fetch = jest.fn();
    const error = await rejection(client({ baseUrl: null, fetch }).request('/api/x'));
    expect(error.kind).toBe('config');
    expect(fetch).not.toHaveBeenCalled();
  });
});
