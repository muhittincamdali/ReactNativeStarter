/**
 * Tasks of each account, kept in memory.
 *
 * {@link TaskRepository} is the seam for a database: replace {@link MemoryTaskRepository} with an
 * implementation backed by Postgres, SQLite or a hosted service and the routes stay the same.
 *
 * @module
 */
import type { Task } from '@/shared/schemas';

import { HttpError } from './http';

/** Options of {@link TaskRepository.list}. */
export interface ListOptions {
  /** Page size, already validated by the route. */
  limit: number;
  /** Id of the last task of the previous page. */
  cursor?: string | undefined;
}

/** One page of tasks, newest first. */
export interface TaskPageResult {
  items: Task[];
  nextCursor: string | null;
}

/** Storage of tasks. Every method is scoped to one account. */
export interface TaskRepository {
  /** A page of the account's tasks, or `null` when `cursor` names no task of this account. */
  list(userId: string, options: ListOptions): TaskPageResult | null;
  /**
   * Adds a task, or returns `null` when the account already has the maximum number. A store with
   * a limit for all accounts may throw `503 capacity` when it is full.
   */
  create(userId: string, title: string): Task | null;
  /** Changes a task, or returns `null` when the account has no task with this id. */
  update(
    userId: string,
    id: string,
    changes: { title?: string | undefined; done?: boolean | undefined },
  ): Task | null;
  /** Deletes a task; `false` when the account has no task with this id. */
  remove(userId: string, id: string): boolean;
}

/** Options of {@link MemoryTaskRepository}. */
export interface MemoryTaskRepositoryOptions {
  maxPerUser: number;
  /** Tasks kept for all accounts together; no limit when it is left out. */
  maxTotal?: number;
  now?: () => number;
  newId?: () => string;
}

/** {@link TaskRepository} in process memory. Data is lost when the server restarts. */
export class MemoryTaskRepository implements TaskRepository {
  // Per account, oldest first; a page is read from the end.
  private readonly tasks = new Map<string, Task[]>();
  private readonly now: () => number;
  private readonly newId: () => string;
  private total = 0;

  constructor(private readonly options: MemoryTaskRepositoryOptions) {
    this.now = options.now ?? Date.now;
    this.newId = options.newId ?? (() => crypto.randomUUID());
  }

  list(userId: string, { limit, cursor }: ListOptions): TaskPageResult | null {
    const own = this.tasks.get(userId) ?? [];
    let end = own.length;
    if (cursor !== undefined) {
      const index = own.findIndex((task) => task.id === cursor);
      if (index === -1) return null;
      end = index;
    }
    const start = Math.max(0, end - limit);
    const items = own
      .slice(start, end)
      .reverse()
      .map((task) => ({ ...task }));
    const last = items[items.length - 1];
    return { items, nextCursor: start > 0 && last ? last.id : null };
  }

  create(userId: string, title: string): Task | null {
    const own = this.tasks.get(userId) ?? [];
    if (own.length >= this.options.maxPerUser) return null;
    if (this.total >= (this.options.maxTotal ?? Number.POSITIVE_INFINITY)) {
      throw new HttpError(503, 'capacity', 'The server cannot store more tasks.');
    }
    const timestamp = new Date(this.now()).toISOString();
    const task: Task = {
      id: this.newId(),
      title,
      done: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    own.push(task);
    this.tasks.set(userId, own);
    this.total += 1;
    return { ...task };
  }

  update(
    userId: string,
    id: string,
    changes: { title?: string | undefined; done?: boolean | undefined },
  ): Task | null {
    const task = this.tasks.get(userId)?.find((candidate) => candidate.id === id);
    if (!task) return null;
    if (changes.title !== undefined) task.title = changes.title;
    if (changes.done !== undefined) task.done = changes.done;
    task.updatedAt = new Date(this.now()).toISOString();
    return { ...task };
  }

  remove(userId: string, id: string): boolean {
    const own = this.tasks.get(userId);
    const index = own?.findIndex((task) => task.id === id) ?? -1;
    if (!own || index === -1) return false;
    own.splice(index, 1);
    this.total -= 1;
    return true;
  }
}
