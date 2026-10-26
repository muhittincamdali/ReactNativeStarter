/**
 * The signed-in session: a small zustand store plus the functions that change it.
 *
 * The session (token and account) is saved in secure storage, so the app opens signed in and
 * offline. {@link restoreSession} then asks the API whether the token is still valid and signs
 * out only on a definite `401`, not on a network error.
 *
 * @module
 */
import { create } from 'zustand';

import { sessionSchema, type Session, type User } from '@/shared/schemas';

import { ApiError } from './api-client';
import { queryClient } from './query-client';
import { deleteSecure, readSecure, writeSecure } from './secure-storage';

const STORAGE_KEY = 'session.v1';

/** State of the session store. */
export interface SessionState {
  /** `loading` until the saved session has been read. */
  status: 'loading' | 'signed-out' | 'signed-in';
  token: string | null;
  user: User | null;
}

/** The session store. Read it with `useSession((state) => state.user)`. */
export const useSession = create<SessionState>()(() => ({
  status: 'loading',
  token: null,
  user: null,
}));

/** Saves a new session and switches the app to the signed-in screens. */
export async function startSession(session: Session): Promise<void> {
  await writeSecure(STORAGE_KEY, JSON.stringify(session));
  useSession.setState({ status: 'signed-in', token: session.token, user: session.user });
}

/**
 * Forgets the session on this device and switches to the sign-in screens. Cached data of the
 * account is dropped too, so the next account never sees it.
 */
export async function endSession(): Promise<void> {
  useSession.setState({ status: 'signed-out', token: null, user: null });
  queryClient.clear();
  await deleteSecure(STORAGE_KEY);
}

/**
 * Reads the saved session, then checks it with `fetchMe`.
 *
 * - Nothing saved, or saved data that does not parse: signed out.
 * - `fetchMe` rejects with a `401`: the token was revoked or expired; signed out.
 * - `fetchMe` fails in any other way (offline, timeout): the saved session is kept.
 * - `fetchMe` succeeds: the account is refreshed (a changed name shows up).
 */
export async function restoreSession(fetchMe: (token: string) => Promise<User>): Promise<void> {
  const saved = parseSaved(await readSecure(STORAGE_KEY));
  if (!saved) {
    await endSession();
    return;
  }
  useSession.setState({ status: 'signed-in', token: saved.token, user: saved.user });
  try {
    const user = await fetchMe(saved.token);
    // The user may have signed out while the check was running.
    if (useSession.getState().token === saved.token) {
      await startSession({ token: saved.token, user });
    }
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) await endSession();
  }
}

function parseSaved(text: string | null): Session | null {
  if (!text) return null;
  try {
    const parsed = sessionSchema.safeParse(JSON.parse(text));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
