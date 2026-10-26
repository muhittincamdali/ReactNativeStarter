import { z } from 'zod';

import { bearerToken, handle, HttpError, readJson } from '@/server/http';

const schema = z.strictObject({ title: z.string() });
const url = 'http://localhost/api/test';

function post(body: BodyInit | null, headers: Record<string, string> = {}): Request {
  return new Request(url, {
    method: 'POST',
    body,
    headers: { 'content-type': 'application/json', ...headers },
    duplex: 'half',
  } as RequestInit);
}

async function failure(promise: Promise<unknown>): Promise<HttpError> {
  try {
    await promise;
  } catch (error) {
    if (error instanceof HttpError) return error;
    throw error;
  }
  throw new Error('expected an HttpError');
}

function streamOf(chunks: Uint8Array[], onPull?: () => void): ReadableStream<Uint8Array> {
  let index = 0;
  return new ReadableStream({
    pull(controller) {
      onPull?.();
      const chunk = chunks[index];
      index += 1;
      if (chunk) controller.enqueue(chunk);
      else controller.close();
    },
  });
}

describe('readJson', () => {
  it('parses and validates a JSON body', async () => {
    await expect(readJson(post('{"title":"Milk"}'), schema)).resolves.toEqual({ title: 'Milk' });
  });

  it('accepts a charset parameter and any case in the media type', async () => {
    const request = post('{"title":"x"}', { 'content-type': 'Application/JSON; charset=utf-8' });
    await expect(readJson(request, schema)).resolves.toEqual({ title: 'x' });
  });

  it.each([
    ['no content type', null],
    ['text/plain', 'text/plain'],
    ['a JSON-looking subtype', 'application/json-patch+json'],
    ['a form', 'application/x-www-form-urlencoded'],
  ])('answers 415 for %s', async (_, type) => {
    const request = new Request(url, {
      method: 'POST',
      body: '{"title":"x"}',
      headers: type ? { 'content-type': type } : {},
    });
    if (!type) request.headers.delete('content-type');
    const error = await failure(readJson(request, schema));
    expect(error).toMatchObject({ status: 415, code: 'unsupported_media_type' });
  });

  it('answers 413 when Content-Length is above the limit, before reading the body', async () => {
    let pulls = 0;
    const body = streamOf([new TextEncoder().encode('{}')], () => {
      pulls += 1;
    });
    const error = await failure(readJson(post(body, { 'content-length': '20000' }), schema, 16));
    expect(error).toMatchObject({ status: 413, code: 'payload_too_large' });
    expect(pulls).toBeLessThanOrEqual(1);
  });

  it('answers 413 for a Content-Length that is not a plain number', async () => {
    for (const length of ['1e9', '-1', '10.5', '9'.repeat(30)]) {
      const request = post('{}');
      Object.defineProperty(request, 'headers', {
        value: new Headers({ 'content-type': 'application/json', 'content-length': length }),
      });
      const error = await failure(readJson(request, schema));
      expect(error.status).toBe(413);
    }
  });

  it('stops reading a streamed body without Content-Length once it passes the limit', async () => {
    let pulls = 0;
    const chunk = new Uint8Array(10).fill(0x20);
    const body = streamOf(
      Array.from({ length: 1000 }, () => chunk),
      () => {
        pulls += 1;
      },
    );
    const error = await failure(readJson(post(body), schema, 25));
    expect(error.status).toBe(413);
    // 3 chunks pass 25 bytes; a few more pulls may be queued by the stream, not 1000.
    expect(pulls).toBeLessThan(10);
  });

  it('accepts a body of exactly the limit', async () => {
    const text = '{"title":"abc"}';
    const bytes = new TextEncoder().encode(text).byteLength;
    await expect(readJson(post(text), schema, bytes)).resolves.toEqual({ title: 'abc' });
  });

  it.each([
    ['invalid UTF-8', new Uint8Array([0x7b, 0x22, 0xff, 0x22, 0x7d])],
    ['truncated JSON', new TextEncoder().encode('{"title":')],
    ['an empty body', new Uint8Array(0)],
  ])('answers 400 for %s', async (_, bytes) => {
    const error = await failure(readJson(post(bytes), schema));
    expect(error).toMatchObject({ status: 400, code: 'invalid_json' });
  });

  it('answers 422, without a stack overflow, for deeply nested JSON within the size limit', async () => {
    const depth = 8_000;
    const body = `{"title":${'['.repeat(depth)}${']'.repeat(depth)}}`;
    const error = await failure(readJson(post(body), schema));
    expect(error).toMatchObject({ status: 422, fields: { title: 'validation.invalid' } });
  });

  it('answers 422 with field keys when the JSON does not match the schema', async () => {
    const error = await failure(readJson(post('{"title":5,"extra":1}'), schema));
    expect(error.status).toBe(422);
    expect(error.code).toBe('validation_failed');
    expect(error.fields).toEqual({ title: 'validation.invalid', _form: 'validation.invalid' });
  });
});

describe('bearerToken', () => {
  const token = 'A'.repeat(43);
  const withAuth = (value: string) => new Request(url, { headers: { authorization: value } });

  it('reads a well-formed bearer token', () => {
    expect(bearerToken(withAuth(`Bearer ${token}`))).toBe(token);
  });

  it.each([
    ['no header', null],
    ['another scheme', `Basic ${token}`],
    ['lower-case scheme', `bearer ${token}`],
    ['a short token', `Bearer ${'A'.repeat(42)}`],
    ['a long token', `Bearer ${'A'.repeat(44)}`],
    ['characters outside base64url', `Bearer ${'A'.repeat(42)}=`],
    ['two spaces', `Bearer  ${token}`],
    ['a very long header', `Bearer ${'A'.repeat(10_000)}`],
  ])('returns null for %s', (_, value) => {
    const request = value === null ? new Request(url) : withAuth(value);
    expect(bearerToken(request)).toBeNull();
  });
});

describe('handle', () => {
  it('answers an HttpError with its status, code, fields and headers', async () => {
    const response = await handle(async () => {
      throw new HttpError(429, 'too_many_attempts', 'Later.', undefined, { 'Retry-After': '60' });
    });
    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('60');
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(await response.json()).toEqual({
      error: { code: 'too_many_attempts', message: 'Later.' },
    });
  });

  it('adds WWW-Authenticate to a 401', async () => {
    const response = await handle(async () => {
      throw new HttpError(401, 'unauthorized', 'Sign in.');
    });
    expect(response.headers.get('www-authenticate')).toBe('Bearer');
  });

  it('answers 500 without the message of an unexpected error', async () => {
    const response = await handle(async () => {
      throw new Error('password=hunter2 leaked in a message');
    });
    expect(response.status).toBe(500);
    const text = await response.text();
    expect(text).not.toContain('hunter2');
    expect(JSON.parse(text).error.code).toBe('internal');
  });
});
