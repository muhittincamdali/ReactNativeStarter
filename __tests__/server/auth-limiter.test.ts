import { AuthLimiter, attemptDelayMs, type AuthLimiterOptions } from '@/server/auth-limiter';
import { parseClientAddress, type ClientAddress } from '@/server/client-address';
import { HttpError } from '@/server/http';
import { MAX_SIGN_IN_DELAY_MS } from '@/shared/limits';

function address(raw: string): ClientAddress {
  const parsed = parseClientAddress(raw);
  if (!parsed) throw new Error(`not an address: ${raw}`);
  return parsed;
}

function setup(options: Partial<AuthLimiterOptions> = {}) {
  const delays: number[] = [];
  const limiter = new AuthLimiter({
    windowMs: 60_000,
    maxKeys: 1_000,
    maxPerClient: 5,
    maxPerNetwork: 20,
    sleep: async (ms) => {
      delays.push(ms);
    },
    ...options,
  });
  return { limiter, delays };
}

const fail = async (): Promise<never> => {
  throw new HttpError(401, 'invalid_credentials', 'Wrong.');
};
const pass = async () => 'ok';

async function status(promise: Promise<unknown>): Promise<number> {
  try {
    await promise;
    return 200;
  } catch (error) {
    return error instanceof HttpError ? error.status : 500;
  }
}

function count(statuses: number[], code: number): number {
  return statuses.filter((value) => value === code).length;
}

describe('attemptDelayMs', () => {
  it('waits only after 5 earlier attempts, then doubles up to the cap', () => {
    expect([0, 4, 5, 6, 9, 10, 50].map(attemptDelayMs)).toEqual([
      0,
      0,
      250,
      500,
      4000,
      MAX_SIGN_IN_DELAY_MS,
      MAX_SIGN_IN_DELAY_MS,
    ]);
  });
});

describe('AuthLimiter address layer', () => {
  it('limits one client and lets another client in', async () => {
    const { limiter } = setup();
    const attacker = address('203.0.113.9');
    for (let i = 0; i < 5; i += 1)
      expect(await status(limiter.run({ address: attacker }, pass))).toBe(200);
    const refused = await limiter
      .run({ address: attacker }, pass)
      .catch((error: HttpError) => error);
    expect(refused).toMatchObject({ status: 429 });
    expect(Number((refused as HttpError).headers['Retry-After'])).toBeGreaterThan(0);
    expect(await status(limiter.run({ address: address('198.51.100.7') }, pass))).toBe(200);
  });

  it('counts 100 parallel attempts of one client exactly', async () => {
    const { limiter } = setup({ maxPerClient: 30, maxPerNetwork: 300 });
    const client = address('203.0.113.9');
    const statuses = await Promise.all(
      Array.from({ length: 100 }, () => status(limiter.run({ address: client }, pass))),
    );
    expect(count(statuses, 200)).toBe(30);
    expect(count(statuses, 429)).toBe(70);
  });

  it('stops 50,000 /64 networks of one /48 at the network budget; a new client still gets in', async () => {
    const { limiter, delays } = setup({ maxKeys: 50_000, maxPerClient: 30, maxPerNetwork: 300 });
    let refused = 0;
    for (let i = 0; i < 50_000; i += 1) {
      const raw = `2001:db8:7:${i.toString(16)}::1`;
      if ((await status(limiter.run({ address: address(raw) }, pass))) === 429) refused += 1;
    }
    expect(refused).toBe(50_000 - 300);
    expect(await status(limiter.run({ address: address('2001:db8:8:1::1') }, pass))).toBe(200);
    expect(await status(limiter.run({ address: address('192.0.2.1') }, pass))).toBe(200);
    expect(delays).toEqual([]);
  });

  it('keeps a locked client locked and admits new clients while many networks fill the table', async () => {
    const { limiter, delays } = setup({ maxKeys: 100, maxPerClient: 2, maxPerNetwork: 10 });
    const locked = address('203.0.113.9');
    await limiter.run({ address: locked }, pass);
    await limiter.run({ address: locked }, pass);
    for (let i = 0; i < 1_100; i += 1) {
      const raw = `2001:db8:${i.toString(16)}::1`;
      expect(await status(limiter.run({ address: address(raw) }, pass))).toBe(200);
    }
    expect(await status(limiter.run({ address: locked }, pass))).toBe(429);
    expect(await status(limiter.run({ address: address('198.51.100.7') }, pass))).toBe(200);
    expect(delays).toEqual([]);
  });

  it('slows down, never refuses, a client a table full of locked keys cannot count', async () => {
    const { limiter, delays } = setup({ maxKeys: 3, maxPerClient: 1, maxPerNetwork: 10 });
    for (const raw of ['192.0.2.1', '192.0.2.2', '192.0.2.3']) {
      await limiter.run({ address: address(raw) }, pass);
    }
    expect(await status(limiter.run({ address: address('192.0.2.4') }, pass))).toBe(200);
    expect(delays).toEqual([MAX_SIGN_IN_DELAY_MS]);
  });

  it('slows down, never refuses, requests without an address, also 100 in parallel', async () => {
    const { limiter, delays } = setup({ maxPerClient: 1, maxPerNetwork: 1 });
    const statuses = await Promise.all(
      Array.from({ length: 100 }, () => status(limiter.run({ address: null }, pass))),
    );
    expect(count(statuses, 200)).toBe(100);
    expect(delays).toHaveLength(95);
    expect(delays.at(-1)).toBe(MAX_SIGN_IN_DELAY_MS);
  });
});

describe('AuthLimiter subject layer', () => {
  const subject = 'ada@example.com';

  it('locks a pair after its failures without affecting other clients', async () => {
    const { limiter } = setup({ maxFailuresPerPair: 3 });
    const attacker = address('203.0.113.9');
    for (let i = 0; i < 3; i += 1) {
      expect(await status(limiter.run({ address: attacker, subject }, fail))).toBe(401);
    }
    expect(await status(limiter.run({ address: attacker, subject }, pass))).toBe(429);
    expect(
      await status(limiter.run({ address: attacker, subject: 'other@example.com' }, pass)),
    ).toBe(200);
    expect(await status(limiter.run({ address: address('198.51.100.7'), subject }, pass))).toBe(
      200,
    );
  });

  it('checks 100 parallel attempts for one subject one at a time and refuses past the queue', async () => {
    const { limiter } = setup({ maxPendingPerSubject: 2, maxPerNetwork: 1_000 });
    let active = 0;
    let mostActive = 0;
    let checked = 0;
    const slowFail = async (): Promise<never> => {
      active += 1;
      checked += 1;
      mostActive = Math.max(mostActive, active);
      await new Promise((resolve) => setTimeout(resolve, 2));
      active -= 1;
      throw new HttpError(401, 'invalid_credentials', 'Wrong.');
    };
    const statuses = await Promise.all(
      Array.from({ length: 100 }, (_, i) =>
        status(limiter.run({ address: address(`198.51.100.${i + 1}`), subject }, slowFail)),
      ),
    );
    expect(count(statuses, 401)).toBe(2);
    expect(count(statuses, 429)).toBe(98);
    expect(checked).toBe(2);
    expect(mostActive).toBe(1);
  });

  it('delays queued attempts in order and stops at the hard limit', async () => {
    const { limiter, delays } = setup({ maxFailuresPerSubject: 8, maxPerNetwork: 1_000 });
    let active = 0;
    let mostActive = 0;
    const tracked = async (): Promise<never> => {
      active += 1;
      mostActive = Math.max(mostActive, active);
      await Promise.resolve();
      active -= 1;
      throw new HttpError(401, 'invalid_credentials', 'Wrong.');
    };
    const statuses = await Promise.all(
      Array.from({ length: 100 }, (_, i) =>
        status(limiter.run({ address: address(`198.51.100.${i + 1}`), subject }, tracked)),
      ),
    );
    expect(count(statuses, 401)).toBe(8);
    expect(count(statuses, 429)).toBe(92);
    expect(mostActive).toBe(1);
    expect(delays).toEqual([250, 500, 1000]);
  });

  it('lets a trusted client past the hard limit, but not past its pair limit', async () => {
    const { limiter } = setup({ maxFailuresPerSubject: 2, maxFailuresPerPair: 2 });
    for (const raw of ['203.0.113.1', '203.0.113.2']) {
      await status(limiter.run({ address: address(raw), subject }, fail));
    }
    const stranger = address('203.0.113.3');
    expect(await status(limiter.run({ address: stranger, subject }, pass))).toBe(429);
    const owner = address('198.51.100.7');
    expect(await status(limiter.run({ address: owner, subject, trusted: true }, fail))).toBe(401);
    expect(await status(limiter.run({ address: owner, subject, trusted: true }, fail))).toBe(401);
    expect(await status(limiter.run({ address: owner, subject, trusted: true }, pass))).toBe(429);
  });

  it('clears the pair and subject failures after a success', async () => {
    const { limiter } = setup({ maxFailuresPerSubject: 2, maxFailuresPerPair: 2 });
    const client = address('203.0.113.1');
    await status(limiter.run({ address: client, subject }, fail));
    await status(limiter.run({ address: client, subject }, pass));
    expect(await status(limiter.run({ address: client, subject }, fail))).toBe(401);
    expect(await status(limiter.run({ address: client, subject }, pass))).toBe(200);
  });

  it('queues attempts without an address for a subject, but never refuses them for the address', async () => {
    const { limiter, delays } = setup({ maxPerClient: 1, maxPerNetwork: 1 });
    for (let i = 0; i < 7; i += 1) {
      expect(await status(limiter.run({ address: null, subject }, fail))).toBe(401);
    }
    expect(delays).toEqual([250, 500]);
  });
});
