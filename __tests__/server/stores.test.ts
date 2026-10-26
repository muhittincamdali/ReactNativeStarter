import { AttemptLimiter } from '@/server/rate-limit';
import { SessionStore } from '@/server/sessions';
import { MemoryTaskRepository } from '@/server/tasks';

function clock(start = 1_000_000) {
  let now = start;
  return { now: () => now, advance: (ms: number) => (now += ms) };
}

describe('AttemptLimiter', () => {
  it('blocks a key after the allowed attempts until the window ends', () => {
    const time = clock();
    const limiter = new AttemptLimiter({
      maxAttempts: 3,
      windowMs: 1000,
      maxKeys: 10,
      now: time.now,
    });
    for (let i = 0; i < 2; i += 1) limiter.record('a');
    expect(limiter.retryAfter('a')).toBe(0);
    expect(limiter.attempts('a')).toBe(2);
    limiter.record('a');
    expect(limiter.retryAfter('a')).toBe(1000);
    time.advance(400);
    expect(limiter.retryAfter('a')).toBe(600);
    time.advance(600);
    expect(limiter.retryAfter('a')).toBe(0);
    expect(limiter.attempts('a')).toBe(0);
    expect(limiter.size).toBe(0);
  });

  it('keeps keys apart and forgets a key on reset', () => {
    const limiter = new AttemptLimiter({ maxAttempts: 1, windowMs: 1000, maxKeys: 10 });
    limiter.record('a');
    expect(limiter.retryAfter('a')).toBeGreaterThan(0);
    expect(limiter.retryAfter('b')).toBe(0);
    limiter.reset('a');
    expect(limiter.retryAfter('a')).toBe(0);
  });

  it('keeps a locked key locked after maxKeys + 1000 new keys, refusing the new ones', () => {
    const time = clock();
    const limiter = new AttemptLimiter({
      maxAttempts: 1,
      windowMs: 1000,
      maxKeys: 100,
      now: time.now,
    });
    limiter.record('locked');
    let refused = 0;
    for (let i = 0; i < 1_100; i += 1) {
      if (!limiter.record(`spray-${i}`)) refused += 1;
    }
    expect(limiter.size).toBe(100);
    expect(refused).toBe(1_001);
    expect(limiter.retryAfter('locked')).toBe(1000);
    expect(limiter.retryAfter('spray-1099')).toBe(1000);
    expect(limiter.record('spray-1099')).toBe(false);
  });

  it('makes room only from keys whose window has ended', () => {
    const time = clock();
    const limiter = new AttemptLimiter({
      maxAttempts: 1,
      windowMs: 1000,
      maxKeys: 2,
      now: time.now,
    });
    limiter.record('old');
    time.advance(600);
    limiter.record('newer');
    expect(limiter.retryAfter('third')).toBe(400);
    time.advance(400);
    expect(limiter.retryAfter('third')).toBe(0);
    expect(limiter.record('third')).toBe(true);
    expect(limiter.retryAfter('newer')).toBe(600);
    expect(limiter.size).toBe(2);
  });
});

describe('SessionStore', () => {
  const options = { ttlMs: 1000, maxPerUser: 2, maxTotal: 5 };

  it('resolves a token to its account until it is revoked', async () => {
    const store = new SessionStore(options);
    const token = await store.create('user-1');
    await expect(store.resolve(token)).resolves.toBe('user-1');
    await store.revoke(token);
    await expect(store.resolve(token)).resolves.toBeNull();
  });

  it('expires a session after its lifetime', async () => {
    const time = clock();
    const store = new SessionStore({ ...options, now: time.now });
    const token = await store.create('user-1');
    time.advance(999);
    await expect(store.resolve(token)).resolves.toBe('user-1');
    time.advance(1);
    await expect(store.resolve(token)).resolves.toBeNull();
    expect(store.size).toBe(0);
  });

  it('keeps at most maxPerUser sessions per account, dropping the oldest', async () => {
    const store = new SessionStore(options);
    const first = await store.create('user-1');
    const second = await store.create('user-1');
    const third = await store.create('user-1');
    await expect(store.resolve(first)).resolves.toBeNull();
    await expect(store.resolve(second)).resolves.toBe('user-1');
    await expect(store.resolve(third)).resolves.toBe('user-1');
  });

  it('refuses a new session with 503 when the table is full, keeping the others', async () => {
    const store = new SessionStore({ ttlMs: 1000, maxPerUser: 2, maxTotal: 3 });
    const first = await store.create('user-1');
    const second = await store.create('user-1');
    const other = await store.create('user-2');
    await expect(store.create('user-3')).rejects.toMatchObject({ status: 503, code: 'capacity' });
    for (let i = 0; i < 50; i += 1) {
      await expect(store.create(`spray-${i}`)).rejects.toMatchObject({ status: 503 });
    }
    await expect(store.resolve(first)).resolves.toBe('user-1');
    await expect(store.resolve(second)).resolves.toBe('user-1');
    await expect(store.resolve(other)).resolves.toBe('user-2');
    expect(store.size).toBe(3);
  });

  it('lets an account at its own limit replace its oldest session when the table is full', async () => {
    const store = new SessionStore({ ttlMs: 1000, maxPerUser: 2, maxTotal: 3 });
    const first = await store.create('user-1');
    await store.create('user-1');
    const other = await store.create('user-2');
    const third = await store.create('user-1');
    await expect(store.resolve(first)).resolves.toBeNull();
    await expect(store.resolve(third)).resolves.toBe('user-1');
    await expect(store.resolve(other)).resolves.toBe('user-2');
  });

  it('makes room from expired sessions only', async () => {
    const time = clock();
    const store = new SessionStore({ ttlMs: 1000, maxPerUser: 2, maxTotal: 2, now: time.now });
    await store.create('user-1');
    time.advance(500);
    const live = await store.create('user-2');
    await expect(store.create('user-3')).rejects.toMatchObject({ status: 503 });
    time.advance(500);
    const next = await store.create('user-3');
    await expect(store.resolve(live)).resolves.toBe('user-2');
    await expect(store.resolve(next)).resolves.toBe('user-3');
    expect(store.size).toBe(2);
  });

  it('counts parallel sessions of one account against its limit', async () => {
    const store = new SessionStore({ ttlMs: 1000, maxPerUser: 2, maxTotal: 10 });
    const tokens = await Promise.all(Array.from({ length: 6 }, () => store.create('user-1')));
    const resolved = await Promise.all(tokens.map((token) => store.resolve(token)));
    expect(resolved.filter((id) => id === 'user-1')).toHaveLength(2);
    expect(store.size).toBe(2);
  });

  it('frees the slot of a revoked session', async () => {
    const store = new SessionStore({ ttlMs: 1000, maxPerUser: 2, maxTotal: 2 });
    const token = await store.create('user-1');
    await store.create('user-2');
    await store.revoke(token);
    await expect(store.create('user-3')).resolves.toEqual(expect.any(String));
  });

  it('does not resolve an unknown token', async () => {
    const store = new SessionStore(options);
    await store.create('user-1');
    await expect(store.resolve('A'.repeat(43))).resolves.toBeNull();
  });
});

describe('MemoryTaskRepository', () => {
  function repository(maxPerUser = 100) {
    let id = 0;
    const time = clock(Date.UTC(2026, 9, 26));
    const repo = new MemoryTaskRepository({
      maxPerUser,
      now: time.now,
      newId: () => `00000000-0000-4000-8000-${String((id += 1)).padStart(12, '0')}`,
    });
    return { repo, time };
  }

  it('lists newest first in pages joined by nextCursor', () => {
    const { repo } = repository();
    for (let i = 1; i <= 5; i += 1) repo.create('u', `Task ${i}`);
    const first = repo.list('u', { limit: 2 })!;
    expect(first.items.map((t) => t.title)).toEqual(['Task 5', 'Task 4']);
    const second = repo.list('u', { limit: 2, cursor: first.nextCursor! })!;
    expect(second.items.map((t) => t.title)).toEqual(['Task 3', 'Task 2']);
    const third = repo.list('u', { limit: 2, cursor: second.nextCursor! })!;
    expect(third.items.map((t) => t.title)).toEqual(['Task 1']);
    expect(third.nextCursor).toBeNull();
  });

  it('returns no cursor when the page holds the last task exactly', () => {
    const { repo } = repository();
    repo.create('u', 'a');
    repo.create('u', 'b');
    expect(repo.list('u', { limit: 2 })!.nextCursor).toBeNull();
  });

  it('returns null for a cursor of another account', () => {
    const { repo } = repository();
    const task = repo.create('owner', 'secret')!;
    expect(repo.list('intruder', { limit: 10, cursor: task.id })).toBeNull();
  });

  it('keeps accounts apart for update and remove', () => {
    const { repo } = repository();
    const task = repo.create('owner', 'mine')!;
    expect(repo.update('intruder', task.id, { done: true })).toBeNull();
    expect(repo.remove('intruder', task.id)).toBe(false);
    expect(repo.list('owner', { limit: 10 })!.items[0]).toMatchObject({
      title: 'mine',
      done: false,
    });
  });

  it('refuses a task past maxPerUser', () => {
    const { repo } = repository(2);
    expect(repo.create('u', 'a')).not.toBeNull();
    expect(repo.create('u', 'b')).not.toBeNull();
    expect(repo.create('u', 'c')).toBeNull();
    expect(repo.create('other', 'a')).not.toBeNull();
  });

  it('updates the title, the state and updatedAt', () => {
    const { repo, time } = repository();
    const task = repo.create('u', 'draft')!;
    time.advance(60_000);
    const updated = repo.update('u', task.id, { title: 'final', done: true })!;
    expect(updated).toMatchObject({ title: 'final', done: true, createdAt: task.createdAt });
    expect(Date.parse(updated.updatedAt) - Date.parse(task.createdAt)).toBe(60_000);
  });

  it('returns copies, so a caller cannot change stored tasks', () => {
    const { repo } = repository();
    const task = repo.create('u', 'original')!;
    task.title = 'changed outside';
    repo.list('u', { limit: 1 })!.items[0]!.title = 'changed again';
    expect(repo.list('u', { limit: 1 })!.items[0]!.title).toBe('original');
  });
});
