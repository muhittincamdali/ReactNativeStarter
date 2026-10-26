// The answer of GET /api/stats, shared by the route and the screen like src/shared/schemas.ts.
import { z } from 'zod';

import type { ApiClient } from '@/lib/api-client';

export const taskStatsSchema = z.object({
  total: z.number().int().nonnegative(),
  done: z.number().int().nonnegative(),
  open: z.number().int().nonnegative(),
});

export type TaskStats = z.infer<typeof taskStatsSchema>;

/** Calls GET /api/stats with the app's API client. */
export function fetchTaskStats(client: ApiClient, signal?: AbortSignal): Promise<TaskStats> {
  return client.request('/api/stats', { schema: taskStatsSchema, ...(signal ? { signal } : {}) });
}
