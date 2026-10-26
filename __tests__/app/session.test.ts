import * as SecureStore from 'expo-secure-store';

import { ApiError } from '@/lib/api-client';
import { queryClient } from '@/lib/query-client';
import { endSession, restoreSession, startSession, useSession } from '@/lib/session';
import type { User } from '@/shared/schemas';

const user: User = {
  id: '00000000-0000-4000-8000-000000000001',
  name: 'Ada',
  email: 'ada@example.com',
};
const token = 'A'.repeat(43);
const values = (SecureStore as unknown as { __values: Map<string, string> }).__values;

beforeEach(async () => {
  await endSession();
  values.clear();
});

describe('startSession and endSession', () => {
  it('saves the session in secure storage and removes it on sign-out', async () => {
    await startSession({ token, user });
    expect(useSession.getState()).toMatchObject({ status: 'signed-in', token, user });
    expect(JSON.parse(values.get('session.v1')!)).toEqual({ token, user });

    await endSession();
    expect(useSession.getState()).toMatchObject({ status: 'signed-out', token: null, user: null });
    expect(values.has('session.v1')).toBe(false);
  });

  it('drops cached queries on sign-out, so the next account cannot see them', async () => {
    queryClient.setQueryData(['tasks'], { pages: [], pageParams: [] });
    await endSession();
    expect(queryClient.getQueryData(['tasks'])).toBeUndefined();
  });
});

describe('restoreSession', () => {
  it('signs out when nothing is saved', async () => {
    const fetchMe = jest.fn();
    await restoreSession(fetchMe);
    expect(useSession.getState().status).toBe('signed-out');
    expect(fetchMe).not.toHaveBeenCalled();
  });

  it.each([
    ['not JSON', '{'],
    ['a malformed token', JSON.stringify({ token: 'short', user })],
    ['a missing account', JSON.stringify({ token })],
  ])('signs out and deletes saved data that is %s', async (_, saved) => {
    values.set('session.v1', saved);
    await restoreSession(jest.fn());
    expect(useSession.getState().status).toBe('signed-out');
    expect(values.has('session.v1')).toBe(false);
  });

  it('refreshes the saved account when the token is still valid', async () => {
    values.set('session.v1', JSON.stringify({ token, user }));
    await restoreSession(async () => ({ ...user, name: 'Ada Lovelace' }));
    expect(useSession.getState()).toMatchObject({
      status: 'signed-in',
      user: { name: 'Ada Lovelace' },
    });
    expect(JSON.parse(values.get('session.v1')!).user.name).toBe('Ada Lovelace');
  });

  it('signs out when the server answers 401', async () => {
    values.set('session.v1', JSON.stringify({ token, user }));
    await restoreSession(async () => {
      throw new ApiError('http', 'expired', 401, 'unauthorized');
    });
    expect(useSession.getState().status).toBe('signed-out');
    expect(values.has('session.v1')).toBe(false);
  });

  it.each([
    ['offline', new ApiError('network', 'offline')],
    ['a timeout', new ApiError('timeout', 'slow')],
    ['a server error', new ApiError('http', 'down', 503)],
  ])('keeps the saved session when the check fails with %s', async (_, error) => {
    values.set('session.v1', JSON.stringify({ token, user }));
    await restoreSession(async () => {
      throw error;
    });
    expect(useSession.getState()).toMatchObject({ status: 'signed-in', token, user });
  });

  it('does not sign back in when the user signed out during the check', async () => {
    values.set('session.v1', JSON.stringify({ token, user }));
    await restoreSession(async () => {
      await endSession();
      return user;
    });
    expect(useSession.getState().status).toBe('signed-out');
    expect(values.has('session.v1')).toBe(false);
  });
});
