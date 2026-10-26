// The whole app, end to end in one process: the real route files under src/app render the
// screens, and the API client talks to the real API route handlers through an in-process fetch.
import { act, fireEvent, renderRouter, screen, waitFor } from 'expo-router/testing-library';

import { endSession, useSession } from '@/lib/session';

jest.mock('@/lib/api', () => {
  const actual = jest.requireActual('@/lib/api');
  const { createApiClient } = jest.requireActual('@/lib/api-client');
  const session = jest.requireActual('@/lib/session');
  const { inProcessServer } = jest.requireActual('./helpers/in-process-server');
  const server = inProcessServer({ maxSignInFailures: 100 });
  return {
    ...actual,
    apiBaseUrl: 'http://localhost:8081',
    mockServer: server,
    api: actual.createApi(
      createApiClient({
        baseUrl: 'http://localhost:8081',
        fetch: server.fetch,
        getToken: () => session.useSession.getState().token,
        onUnauthorized: () => void session.endSession(),
      }),
    ),
  };
});

const { mockServer } = jest.requireMock('@/lib/api') as { mockServer: { requests: string[] } };

async function signUp(name: string, email: string, password: string) {
  await fireEvent.press(await screen.findByText('New here? Create an account'));
  await fireEvent.changeText(await screen.findByTestId('name'), name);
  await fireEvent.changeText(screen.getByTestId('email'), email);
  await fireEvent.changeText(screen.getByTestId('password'), password);
  await fireEvent.press(screen.getByTestId('submit'));
}

describe('the app against its own API', () => {
  it('signs up, adds and completes a task, signs out and signs back in to the same list', async () => {
    await renderRouter('src/app', { initialUrl: '/' });

    // A fresh install has no saved session: the sign-in screen opens.
    expect(await screen.findByText('Welcome back')).toBeOnTheScreen();

    // Client-side validation: nothing is sent for an invalid form.
    await fireEvent.press(await screen.findByText('New here? Create an account'));
    await fireEvent.press(await screen.findByTestId('submit'));
    expect(await screen.findAllByText('Fill in this field.')).toHaveLength(2);
    expect(screen.getByText('Use at least 8 characters.')).toBeOnTheScreen();
    expect(mockServer.requests).toEqual([]);
    await fireEvent.press(screen.getByText('Have an account? Sign in'));

    await signUp('Ada', 'Ada@Example.com', 'correct horse');
    expect(await screen.findByText('Hi, Ada')).toBeOnTheScreen();
    expect(await screen.findByText('No tasks yet')).toBeOnTheScreen();

    await fireEvent.changeText(screen.getByTestId('new-task'), '  Write the release notes ');
    await fireEvent.press(screen.getByTestId('add-task'));
    expect(await screen.findByText('Write the release notes')).toBeOnTheScreen();
    expect(screen.getByText('1 open')).toBeOnTheScreen();

    await fireEvent.press(screen.getByLabelText('Mark Write the release notes as done'));
    expect(await screen.findByText('0 open')).toBeOnTheScreen();
    await waitFor(() =>
      expect(mockServer.requests.some((line) => line.startsWith('PATCH /api/tasks/'))).toBe(true),
    );

    // Sign out from Settings: the device forgets the session and the server revokes the token.
    await fireEvent.press(screen.getByTestId('tab-settings'));
    expect(await screen.findByText('ada@example.com')).toBeOnTheScreen();
    const token = useSession.getState().token;
    await fireEvent.press(screen.getByTestId('sign-out'));
    expect(await screen.findByText('Welcome back')).toBeOnTheScreen();
    expect(useSession.getState().token).toBeNull();
    await waitFor(() => expect(mockServer.requests).toContain('POST /api/auth/sign-out'));
    expect(token).not.toBeNull();

    // Signing in again shows the task that was saved on the server.
    await fireEvent.changeText(screen.getByTestId('email'), 'ada@example.com');
    await fireEvent.changeText(screen.getByTestId('password'), 'wrong password');
    await fireEvent.press(screen.getByTestId('submit'));
    expect(
      await screen.findByText('The e-mail address or the password is wrong.'),
    ).toBeOnTheScreen();

    await fireEvent.changeText(screen.getByTestId('password'), 'correct horse');
    await fireEvent.press(screen.getByTestId('submit'));
    expect(await screen.findByText('Write the release notes')).toBeOnTheScreen();
    expect(screen.getByText('0 open')).toBeOnTheScreen();
  });

  it('shows the error the API returns for a taken e-mail address under the e-mail field', async () => {
    // The first test left a saved session; start from a signed-out device.
    await act(() => endSession());
    await renderRouter('src/app', { initialUrl: '/sign-up' });
    await fireEvent.changeText(await screen.findByTestId('name'), 'Ada again');
    await fireEvent.changeText(screen.getByTestId('email'), 'ada@example.com');
    await fireEvent.changeText(screen.getByTestId('password'), 'another password');
    await fireEvent.press(screen.getByTestId('submit'));
    expect(
      await screen.findByText('An account with this e-mail address exists. Sign in instead.'),
    ).toBeOnTheScreen();
    expect(useSession.getState().status).toBe('signed-out');
  });
});
