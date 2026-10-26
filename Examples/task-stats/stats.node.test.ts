import { createApiClient } from '@/lib/api-client';
import { createServerApp, setServerApp } from '@/server/app';
import { UNKNOWN_CLIENT } from '@/server/client-address';

import { fetchTaskStats } from './schema';
import { GET } from './stats+api';

afterAll(() => setServerApp(undefined));

it('counts the account’s tasks through the route and the API client', async () => {
  const app = createServerApp({ iterations: 1_000 });
  setServerApp(app);
  const { token, user } = await app.accounts.signUp(
    { name: 'Ada', email: 'ada@example.com', password: 'correct horse' },
    UNKNOWN_CLIENT,
  );
  for (let i = 0; i < 120; i += 1) app.tasks.create(user.id, `Task ${i}`);
  const first = app.tasks.list(user.id, { limit: 1 })!.items[0]!;
  app.tasks.update(user.id, first.id, { done: true });
  app.tasks.create('someone-else', 'not counted');

  const client = createApiClient({
    baseUrl: 'http://localhost',
    getToken: () => token,
    fetch: async (input, init) => GET(new Request(input, init)),
  });
  await expect(fetchTaskStats(client)).resolves.toEqual({ total: 120, done: 1, open: 119 });
});

it('answers 401 without a session', async () => {
  setServerApp(createServerApp({ iterations: 1_000 }));
  expect((await GET(new Request('http://localhost/api/stats'))).status).toBe(401);
});
