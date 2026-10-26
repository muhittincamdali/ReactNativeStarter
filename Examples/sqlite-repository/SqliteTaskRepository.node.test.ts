// The same contract runs against the in-memory repository the starter ships with and against the
// SQLite example, so a database implementation is checked against the behaviour the routes expect.
import { MemoryTaskRepository, type TaskRepository } from '@/server/tasks';

import { SqliteTaskRepository } from './SqliteTaskRepository';

type Factory = (options: {
  maxPerUser: number;
  now: () => number;
  newId: () => string;
}) => TaskRepository;

const factories: [string, Factory][] = [
  ['MemoryTaskRepository', (options) => new MemoryTaskRepository(options)],
  ['SqliteTaskRepository', (options) => new SqliteTaskRepository(':memory:', options)],
];

describe.each(factories)('%s', (_, create) => {
  let repo: TaskRepository;
  let clock: number;

  beforeEach(() => {
    let id = 0;
    clock = Date.UTC(2026, 9, 26);
    repo = create({
      maxPerUser: 3,
      now: () => clock,
      newId: () => `00000000-0000-4000-8000-${String((id += 1)).padStart(12, '0')}`,
    });
  });

  it('lists newest first and pages by cursor', () => {
    for (const title of ['a', 'b', 'c']) repo.create('u', title);
    const first = repo.list('u', { limit: 2 })!;
    expect(first.items.map((task) => task.title)).toEqual(['c', 'b']);
    const second = repo.list('u', { limit: 2, cursor: first.nextCursor! })!;
    expect(second.items.map((task) => task.title)).toEqual(['a']);
    expect(second.nextCursor).toBeNull();
  });

  it('gives no cursor when a page ends exactly at the last task', () => {
    repo.create('u', 'a');
    repo.create('u', 'b');
    expect(repo.list('u', { limit: 2 })!.nextCursor).toBeNull();
  });

  it('refuses a cursor of another account and a task past the limit', () => {
    const own = repo.create('owner', 'x')!;
    expect(repo.list('intruder', { limit: 5, cursor: own.id })).toBeNull();
    repo.create('owner', 'y');
    repo.create('owner', 'z');
    expect(repo.create('owner', 'one too many')).toBeNull();
  });

  it('updates title and state and keeps accounts apart', () => {
    const task = repo.create('u', 'draft')!;
    clock += 1000;
    expect(repo.update('other', task.id, { done: true })).toBeNull();
    const updated = repo.update('u', task.id, { done: true })!;
    expect(updated).toMatchObject({ title: 'draft', done: true, createdAt: task.createdAt });
    expect(updated.updatedAt).not.toBe(task.updatedAt);
    expect(repo.update('u', task.id, { title: 'final' })).toMatchObject({
      title: 'final',
      done: true,
    });
  });

  it('removes only the account’s own task', () => {
    const task = repo.create('u', 'x')!;
    expect(repo.remove('other', task.id)).toBe(false);
    expect(repo.remove('u', task.id)).toBe(true);
    expect(repo.remove('u', task.id)).toBe(false);
    expect(repo.list('u', { limit: 10 })!.items).toEqual([]);
  });

  it('stores titles with quotes and SQL text as plain text', () => {
    const title = "Robert'); DROP TABLE tasks;--";
    repo.create('u', title);
    expect(repo.list('u', { limit: 1 })!.items[0]!.title).toBe(title);
  });
});
