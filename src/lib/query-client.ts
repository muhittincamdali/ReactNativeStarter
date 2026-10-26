/**
 * The React Query client: retries only errors that a retry can fix.
 *
 * @module
 */
import { QueryClient } from '@tanstack/react-query';

import { ApiError } from './api-client';

const MAX_RETRIES = 2;

/** `true` when a failed request is worth sending again (network trouble, timeouts, 5xx). */
export function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= MAX_RETRIES) return false;
  if (!(error instanceof ApiError)) return false;
  return (
    error.kind === 'network' ||
    error.kind === 'timeout' ||
    (error.kind === 'http' && !error.isClientError)
  );
}

/** The app-wide query client. */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: shouldRetry, staleTime: 30_000 },
    mutations: { retry: false },
  },
});
