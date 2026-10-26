/**
 * React Query hooks for the task list. Toggling and deleting update the list at once and roll
 * back if the server refuses; adding waits for the server, which assigns the id.
 *
 * @module
 */
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
  type QueryClient,
} from '@tanstack/react-query';

import type { Api } from '@/lib/api';
import type { Task, TaskPage } from '@/shared/schemas';

/** Query key of the task list. */
export const tasksKey = ['tasks'] as const;

type TaskPages = InfiniteData<TaskPage, string | undefined>;

/** Applies `change` to every page of the cached list. */
export function mapCachedTasks(
  data: TaskPages | undefined,
  change: (items: Task[]) => Task[],
): TaskPages | undefined {
  if (!data) return data;
  return { ...data, pages: data.pages.map((page) => ({ ...page, items: change(page.items) })) };
}

async function optimistic(
  queryClient: QueryClient,
  change: (items: Task[]) => Task[],
): Promise<{ previous: TaskPages | undefined }> {
  await queryClient.cancelQueries({ queryKey: tasksKey });
  const previous = queryClient.getQueryData<TaskPages>(tasksKey);
  queryClient.setQueryData<TaskPages>(tasksKey, (data) => mapCachedTasks(data, change));
  return { previous };
}

/** The task list, loaded page by page. */
export function useTasks(api: Api) {
  return useInfiniteQuery({
    queryKey: tasksKey,
    queryFn: ({ pageParam, signal }) => api.listTasks({ cursor: pageParam, signal }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
}

/** Adds a task, then reloads the list. */
export function useCreateTask(api: Api) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (title: string) => api.createTask({ title }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tasksKey }),
  });
}

/** Marks a task as done or not done. */
export function useToggleTask(api: Api) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (task: Task) => api.updateTask(task.id, { done: !task.done }),
    onMutate: (task) =>
      optimistic(queryClient, (items) =>
        items.map((item) => (item.id === task.id ? { ...item, done: !task.done } : item)),
      ),
    onError: (_error, _task, context) => queryClient.setQueryData(tasksKey, context?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: tasksKey }),
  });
}

/** Deletes a task. */
export function useDeleteTask(api: Api) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (task: Task) => api.deleteTask(task.id),
    onMutate: (task) =>
      optimistic(queryClient, (items) => items.filter((item) => item.id !== task.id)),
    onError: (_error, _task, context) => queryClient.setQueryData(tasksKey, context?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: tasksKey }),
  });
}
