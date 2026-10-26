/// <reference types="node" />
// A TaskRepository backed by SQLite through Node.js's built-in node:sqlite module (Node.js 22.13+,
// no package to install). To use it, construct it in src/server/app.ts instead of
// MemoryTaskRepository:
//
//   tasks: new SqliteTaskRepository('data/tasks.db', { maxPerUser: MAX_TASKS_PER_USER }),
//
// Tasks then survive a server restart. Accounts and sessions stay in memory until you give them
// a repository the same way.
import { DatabaseSync } from 'node:sqlite';

import type { ListOptions, TaskPageResult, TaskRepository } from '@/server/tasks';
import type { Task } from '@/shared/schemas';

interface Row {
  id: string;
  title: string;
  done: number;
  created_at: string;
  updated_at: string;
}

export interface SqliteTaskRepositoryOptions {
  maxPerUser: number;
  now?: () => number;
  newId?: () => string;
}

const toTask = (row: Row): Task => ({
  id: row.id,
  title: row.title,
  done: row.done === 1,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export class SqliteTaskRepository implements TaskRepository {
  private readonly db: DatabaseSync;
  private readonly now: () => number;
  private readonly newId: () => string;

  /** `path` is a database file, or `':memory:'` for a database that lives as long as the object. */
  constructor(
    path: string,
    private readonly options: SqliteTaskRepositoryOptions,
  ) {
    this.db = new DatabaseSync(path);
    this.now = options.now ?? Date.now;
    this.newId = options.newId ?? (() => crypto.randomUUID());
    // seq orders tasks by insertion, so pages are stable even when two tasks share a timestamp.
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        seq INTEGER PRIMARY KEY AUTOINCREMENT,
        id TEXT NOT NULL UNIQUE,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        done INTEGER NOT NULL DEFAULT 0 CHECK (done IN (0, 1)),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS tasks_by_user ON tasks (user_id, seq);
    `);
  }

  list(userId: string, { limit, cursor }: ListOptions): TaskPageResult | null {
    let before = Number.MAX_SAFE_INTEGER;
    if (cursor !== undefined) {
      const row = this.db
        .prepare('SELECT seq FROM tasks WHERE id = ? AND user_id = ?')
        .get(cursor, userId) as { seq: number } | undefined;
      if (!row) return null;
      before = row.seq;
    }
    // One extra row tells whether another page exists.
    const rows = this.db
      .prepare(
        `SELECT id, title, done, created_at, updated_at FROM tasks
         WHERE user_id = ? AND seq < ? ORDER BY seq DESC LIMIT ?`,
      )
      .all(userId, before, limit + 1) as unknown as Row[];
    const items = rows.slice(0, limit).map(toTask);
    const last = items[items.length - 1];
    return { items, nextCursor: rows.length > limit && last ? last.id : null };
  }

  create(userId: string, title: string): Task | null {
    const { count } = this.db
      .prepare('SELECT COUNT(*) AS count FROM tasks WHERE user_id = ?')
      .get(userId) as { count: number };
    if (count >= this.options.maxPerUser) return null;
    const timestamp = new Date(this.now()).toISOString();
    const task: Task = {
      id: this.newId(),
      title,
      done: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.db
      .prepare(
        'INSERT INTO tasks (id, user_id, title, done, created_at, updated_at) VALUES (?, ?, ?, 0, ?, ?)',
      )
      .run(task.id, userId, task.title, task.createdAt, task.updatedAt);
    return task;
  }

  update(
    userId: string,
    id: string,
    changes: { title?: string | undefined; done?: boolean | undefined },
  ): Task | null {
    const done = changes.done === undefined ? null : changes.done ? 1 : 0;
    const result = this.db
      .prepare(
        `UPDATE tasks SET title = COALESCE(?, title), done = COALESCE(?, done), updated_at = ?
         WHERE id = ? AND user_id = ?`,
      )
      .run(changes.title ?? null, done, new Date(this.now()).toISOString(), id, userId);
    if (result.changes === 0) return null;
    const row = this.db
      .prepare('SELECT id, title, done, created_at, updated_at FROM tasks WHERE id = ?')
      .get(id) as unknown as Row;
    return toTask(row);
  }

  remove(userId: string, id: string): boolean {
    return (
      this.db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?').run(id, userId).changes > 0
    );
  }

  /** Closes the database file. */
  close(): void {
    this.db.close();
  }
}
