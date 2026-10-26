import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react-native';

import { ApiError } from '@/lib/api-client';

import { TaskStatsCard } from './TaskStatsCard';

function renderCard(fetchStats: () => Promise<{ total: number; done: number; open: number }>) {
  // gcTime: Infinity schedules no garbage-collection timer that would keep Jest running.
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  return render(
    <QueryClientProvider client={client}>
      <TaskStatsCard fetchStats={fetchStats} />
    </QueryClientProvider>,
  );
}

it('shows done and total', async () => {
  await renderCard(async () => ({ total: 5, done: 3, open: 2 }));
  expect(await screen.findByText('3 / 5')).toBeOnTheScreen();
});

it('explains a failed request', async () => {
  await renderCard(async () => {
    throw new ApiError('network', 'offline');
  });
  expect(
    await screen.findByText('No connection to the server. Check your network and try again.'),
  ).toBeOnTheScreen();
});
