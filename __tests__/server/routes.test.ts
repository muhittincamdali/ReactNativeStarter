// Drives the API route files the way the Expo server does: a Request in, a Response out.
import { GET as me } from '@/app/api/auth/me+api';
import { POST as signIn } from '@/app/api/auth/sign-in+api';
import { POST as signOut } from '@/app/api/auth/sign-out+api';
import { POST as signUp } from '@/app/api/auth/sign-up+api';
import { GET as health } from '@/app/api/health+api';
import { DELETE as deleteTask, PATCH as patchTask } from '@/app/api/tasks/[id]+api';
import { GET as listTasks, POST as createTask } from '@/app/api/tasks+api';
import { createServerApp, setServerApp } from '@/server/app';
import { sessionSchema, taskPageSchema, taskSchema } from '@/shared/schemas';

const BASE = 'http://localhost:8081';

function request(path: string, init: { method?: string; body?: unknown; token?: string } = {}) {
  const headers: Record<string, string> = {};
  if (init.body !== undefined) headers['content-type'] = 'application/json';
  if (init.token) headers.authorization = `Bearer ${init.token}`;
  return new Request(`${BASE}${path}`, {
    method: init.method ?? 'GET',
    headers,
    body: init.body === undefined ? null : JSON.stringify(init.body),
  });
}

async function register(email = 'ada@example.com') {
  const response = await signUp(
    request('/api/auth/sign-up', {
      method: 'POST',
      body: { name: 'Ada', email, password: 'correct horse' },
    }),
  );
  expect(response.status).toBe(201);
  return sessionSchema.parse(await response.json());
}

beforeEach(() => {
  setServerApp(createServerApp({ iterations: 1_000, maxSignInFailures: 3, maxTasksPerUser: 3 }));
});

afterAll(() => setServerApp(undefined));

describe('health', () => {
  it('answers ok', async () => {
    expect(await health().json()).toEqual({ status: 'ok' });
  });
});

describe('auth routes', () => {
  it('signs up, reads the account, signs out and then refuses the token', async () => {
    const session = await register();
    expect(session.user).toMatchObject({ name: 'Ada', email: 'ada@example.com' });
    expect(JSON.stringify(session)).not.toContain('passwordHash');

    const current = await me(request('/api/auth/me', { token: session.token }));
    expect(current.status).toBe(200);
    expect(await current.json()).toEqual({ user: session.user });

    const out = await signOut(
      request('/api/auth/sign-out', { method: 'POST', token: session.token }),
    );
    expect(out.status).toBe(204);
    expect((await me(request('/api/auth/me', { token: session.token }))).status).toBe(401);
  });

  it('answers 409 for an e-mail address that is taken, in any letter case', async () => {
    await register('ada@example.com');
    const response = await signUp(
      request('/api/auth/sign-up', {
        method: 'POST',
        body: { name: 'Ada 2', email: 'ADA@example.com', password: 'another one' },
      }),
    );
    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({
      error: { code: 'email_taken', fields: { email: 'validation.emailTaken' } },
    });
  });

  it('answers 422 with field keys for an invalid sign-up', async () => {
    const response = await signUp(
      request('/api/auth/sign-up', {
        method: 'POST',
        body: { name: '', email: 'x', password: '1' },
      }),
    );
    expect(response.status).toBe(422);
    const body = await response.json();
    expect(Object.keys(body.error.fields)).toEqual(['name', 'email', 'password']);
  });

  it('signs in with the right password and gives a new token', async () => {
    const first = await register();
    const response = await signIn(
      request('/api/auth/sign-in', {
        method: 'POST',
        body: { email: ' Ada@Example.com ', password: 'correct horse' },
      }),
    );
    expect(response.status).toBe(200);
    const second = sessionSchema.parse(await response.json());
    expect(second.token).not.toBe(first.token);
    expect(second.user.id).toBe(first.user.id);
  });

  it('answers the same 401 for a wrong password and an unknown address', async () => {
    await register();
    const wrongPassword = await signIn(
      request('/api/auth/sign-in', {
        method: 'POST',
        body: { email: 'ada@example.com', password: 'wrong' },
      }),
    );
    const unknown = await signIn(
      request('/api/auth/sign-in', {
        method: 'POST',
        body: { email: 'nobody@example.com', password: 'wrong' },
      }),
    );
    expect(wrongPassword.status).toBe(401);
    expect(unknown.status).toBe(401);
    expect(await wrongPassword.json()).toEqual(await unknown.json());
  });

  it('locks an address after 3 failures with 429 and Retry-After, even for the right password', async () => {
    await register();
    const attempt = (password: string) =>
      signIn(
        request('/api/auth/sign-in', {
          method: 'POST',
          body: { email: 'ada@example.com', password },
        }),
      );
    for (let i = 0; i < 3; i += 1) expect((await attempt('wrong')).status).toBe(401);
    const locked = await attempt('correct horse');
    expect(locked.status).toBe(429);
    expect(Number(locked.headers.get('retry-after'))).toBeGreaterThan(0);
  });

  it('counts parallel attempts, so they cannot all pass the limit at once', async () => {
    await register();
    const results = await Promise.all(
      Array.from({ length: 10 }, () =>
        signIn(
          request('/api/auth/sign-in', {
            method: 'POST',
            body: { email: 'ada@example.com', password: 'wrong' },
          }),
        ),
      ),
    );
    const statuses = results.map((response) => response.status);
    expect(statuses.filter((status) => status === 401)).toHaveLength(3);
    expect(statuses.filter((status) => status === 429)).toHaveLength(7);
  });

  it('answers 401 for a missing, malformed or unknown token', async () => {
    for (const token of [undefined, 'short', 'A'.repeat(43)]) {
      const response = await me(request('/api/auth/me', token ? { token } : {}));
      expect(response.status).toBe(401);
      expect(response.headers.get('www-authenticate')).toBe('Bearer');
    }
  });

  it('answers 204 to a sign-out without a token', async () => {
    expect((await signOut(request('/api/auth/sign-out', { method: 'POST' }))).status).toBe(204);
  });
});

describe('task routes', () => {
  it('creates, lists, updates and deletes a task', async () => {
    const { token } = await register();
    const created = await createTask(
      request('/api/tasks', { method: 'POST', token, body: { title: '  Buy milk ' } }),
    );
    expect(created.status).toBe(201);
    const task = taskSchema.parse(await created.json());
    expect(task).toMatchObject({ title: 'Buy milk', done: false });

    const page = taskPageSchema.parse(
      await (await listTasks(request('/api/tasks', { token }))).json(),
    );
    expect(page.items.map((t) => t.id)).toEqual([task.id]);

    const patched = await patchTask(
      request(`/api/tasks/${task.id}`, { method: 'PATCH', token, body: { done: true } }),
      { id: task.id },
    );
    expect(await patched.json()).toMatchObject({ id: task.id, done: true });

    const deleted = await deleteTask(
      request(`/api/tasks/${task.id}`, { method: 'DELETE', token }),
      {
        id: task.id,
      },
    );
    expect(deleted.status).toBe(204);
    const empty = await (await listTasks(request('/api/tasks', { token }))).json();
    expect(empty).toEqual({ items: [], nextCursor: null });
  });

  it('requires a session for every task route', async () => {
    const id = '00000000-0000-4000-8000-000000000001';
    const responses = await Promise.all([
      listTasks(request('/api/tasks')),
      createTask(request('/api/tasks', { method: 'POST', body: { title: 'x' } })),
      patchTask(request(`/api/tasks/${id}`, { method: 'PATCH', body: { done: true } }), { id }),
      deleteTask(request(`/api/tasks/${id}`, { method: 'DELETE' }), { id }),
    ]);
    expect(responses.map((r) => r.status)).toEqual([401, 401, 401, 401]);
  });

  it('answers 404 for a task of another account and for an id that is not a UUID', async () => {
    const owner = await register('owner@example.com');
    const intruder = await register('intruder@example.com');
    const task = taskSchema.parse(
      await (
        await createTask(
          request('/api/tasks', { method: 'POST', token: owner.token, body: { title: 'mine' } }),
        )
      ).json(),
    );
    const patch = await patchTask(
      request(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        token: intruder.token,
        body: { done: true },
      }),
      { id: task.id },
    );
    expect(patch.status).toBe(404);
    const bad = await deleteTask(
      request('/api/tasks/../../etc', { method: 'DELETE', token: owner.token }),
      { id: '../../etc' },
    );
    expect(bad.status).toBe(404);
  });

  it.each(['0', '101', '-5', '1.5', 'NaN', '1e2', '', '9'.repeat(40)])(
    'answers 400 for limit=%p',
    async (limit) => {
      const { token } = await register();
      const response = await listTasks(
        request(`/api/tasks?limit=${encodeURIComponent(limit)}`, { token }),
      );
      expect(response.status).toBe(400);
      expect(await response.json()).toMatchObject({
        error: { fields: { limit: 'validation.invalid' } },
      });
    },
  );

  it('answers 400 for a cursor that is not a task id of this account', async () => {
    const { token } = await register();
    for (const cursor of ['nope', '00000000-0000-4000-8000-000000000999']) {
      const response = await listTasks(request(`/api/tasks?cursor=${cursor}`, { token }));
      expect(response.status).toBe(400);
    }
  });

  it('pages with limit and cursor', async () => {
    const { token } = await register();
    for (const title of ['a', 'b', 'c']) {
      await createTask(request('/api/tasks', { method: 'POST', token, body: { title } }));
    }
    const first = taskPageSchema.parse(
      await (await listTasks(request('/api/tasks?limit=2', { token }))).json(),
    );
    expect(first.items.map((t) => t.title)).toEqual(['c', 'b']);
    const second = taskPageSchema.parse(
      await (
        await listTasks(request(`/api/tasks?limit=2&cursor=${first.nextCursor}`, { token }))
      ).json(),
    );
    expect(second.items.map((t) => t.title)).toEqual(['a']);
    expect(second.nextCursor).toBeNull();
  });

  it('answers 409 task_limit past the per-account maximum', async () => {
    const { token } = await register();
    const statuses = [];
    for (let i = 0; i < 4; i += 1) {
      const response = await createTask(
        request('/api/tasks', { method: 'POST', token, body: { title: `t${i}` } }),
      );
      statuses.push(response.status);
    }
    expect(statuses).toEqual([201, 201, 201, 409]);
  });

  it('answers 422 for an empty patch and for a title with control characters', async () => {
    const { token } = await register();
    const task = taskSchema.parse(
      await (
        await createTask(request('/api/tasks', { method: 'POST', token, body: { title: 'x' } }))
      ).json(),
    );
    for (const body of [{}, { title: 'a\u0007b' }]) {
      const response = await patchTask(
        request(`/api/tasks/${task.id}`, { method: 'PATCH', token, body }),
        { id: task.id },
      );
      expect(response.status).toBe(422);
    }
  });
});
