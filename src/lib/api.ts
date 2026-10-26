/**
 * The app's API: one function per route, all typed by the shared schemas.
 *
 * @module
 */
import Constants from 'expo-constants';
import { Platform } from 'react-native';

import {
  sessionSchema,
  taskPageSchema,
  taskSchema,
  userSchema,
  type CreateTaskInput,
  type SignInInput,
  type SignUpInput,
  type UpdateTaskInput,
} from '@/shared/schemas';
import { z } from 'zod';

import { createApiClient, type ApiClient } from './api-client';
import { resolveApiBaseUrl } from './config';
import { endSession, useSession } from './session';

/** Builds the API functions on top of a client; tests pass a client with a fake `fetch`. */
export function createApi(client: ApiClient) {
  return {
    signUp: (input: SignUpInput) =>
      client.request('/api/auth/sign-up', { method: 'POST', body: input, schema: sessionSchema }),
    signIn: (input: SignInInput) =>
      client.request('/api/auth/sign-in', { method: 'POST', body: input, schema: sessionSchema }),
    signOut: () => client.request('/api/auth/sign-out', { method: 'POST' }),
    me: async () =>
      (await client.request('/api/auth/me', { schema: z.object({ user: userSchema }) })).user,
    listTasks: ({ cursor, signal }: { cursor?: string | undefined; signal?: AbortSignal } = {}) =>
      client.request(cursor ? `/api/tasks?cursor=${encodeURIComponent(cursor)}` : '/api/tasks', {
        schema: taskPageSchema,
        ...(signal ? { signal } : {}),
      }),
    createTask: (input: CreateTaskInput) =>
      client.request('/api/tasks', { method: 'POST', body: input, schema: taskSchema }),
    updateTask: (id: string, changes: UpdateTaskInput) =>
      client.request(`/api/tasks/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: changes,
        schema: taskSchema,
      }),
    deleteTask: (id: string) =>
      client.request(`/api/tasks/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  };
}

/** The API functions, as returned by {@link createApi}. */
export type Api = ReturnType<typeof createApi>;

/** Origin of the API this build talks to (`null` when none is configured). */
export const apiBaseUrl = resolveApiBaseUrl({
  envUrl: process.env.EXPO_PUBLIC_API_URL,
  platform: Platform.OS,
  hostUri: Constants.expoConfig?.hostUri,
  isDev: __DEV__,
});

/** The app-wide API, sending the current session token. */
export const api: Api = createApi(
  createApiClient({
    baseUrl: apiBaseUrl,
    getToken: () => useSession.getState().token,
    onUnauthorized: () => {
      void endSession();
    },
  }),
);
