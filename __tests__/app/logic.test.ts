import type { InfiniteData } from '@tanstack/react-query';

import { mapCachedTasks } from '@/features/tasks/use-tasks';
import { ApiError } from '@/lib/api-client';
import { resolveApiBaseUrl } from '@/lib/config';
import { errorMessageKey, isMessageKey, resolveLanguage, translate } from '@/lib/i18n';
import { en } from '@/lib/i18n/en';
import { tr } from '@/lib/i18n/tr';
import { parseSavedPreferences } from '@/lib/preferences';
import { shouldRetry } from '@/lib/query-client';
import type { Task, TaskPage } from '@/shared/schemas';
import { palettes, resolveScheme } from '@/theme';

describe('resolveApiBaseUrl', () => {
  const base = { envUrl: undefined, platform: 'ios', locationOrigin: undefined };

  it('uses EXPO_PUBLIC_API_URL without a trailing slash', () => {
    expect(resolveApiBaseUrl({ ...base, envUrl: 'https://api.example.com/' })).toBe(
      'https://api.example.com',
    );
    expect(resolveApiBaseUrl({ ...base, envUrl: ' https://example.com/app// ' })).toBe(
      'https://example.com/app',
    );
  });

  it.each([
    ['not a URL', 'api.example.com'],
    ['another scheme', 'ftp://example.com'],
    ['a javascript URL', 'javascript:alert(1)'],
    ['credentials', 'https://user:pass@example.com'],
    ['a query', 'https://example.com?x=1'],
  ])('throws for %s', (_, envUrl) => {
    expect(() => resolveApiBaseUrl({ ...base, envUrl })).toThrow(/EXPO_PUBLIC_API_URL/);
  });

  it('prefers EXPO_PUBLIC_API_URL over the location origin', () => {
    expect(
      resolveApiBaseUrl({
        ...base,
        envUrl: 'https://api.example.com',
        locationOrigin: 'http://localhost:8081',
      }),
    ).toBe('https://api.example.com');
  });

  it('uses the same origin on the web', () => {
    expect(resolveApiBaseUrl({ ...base, platform: 'web' })).toBe('');
  });

  it('uses the origin Expo gives window.location on iOS and Android', () => {
    expect(resolveApiBaseUrl({ ...base, locationOrigin: 'http://192.168.1.20:8081' })).toBe(
      'http://192.168.1.20:8081',
    );
  });

  it.each(['null', 'file://', 'not a url', 'javascript:alert(1)'])(
    'ignores the location origin %p',
    (locationOrigin) => {
      expect(resolveApiBaseUrl({ ...base, locationOrigin })).toBeNull();
    },
  );

  it('has no address when neither is set', () => {
    expect(resolveApiBaseUrl(base)).toBeNull();
  });
});

describe('translate', () => {
  it('fills placeholders', () => {
    expect(translate('en', 'tasks.greeting', { name: 'Ada' })).toBe('Hi, Ada');
    expect(translate('tr', 'tasks.open', { count: 3 })).toBe('3 açık');
  });

  it('leaves a placeholder without a value visible', () => {
    expect(translate('en', 'tasks.greeting', {})).toBe('Hi, {name}');
  });

  it('does not expand placeholders inside inserted values', () => {
    expect(translate('en', 'tasks.delete', { title: '{title} {constructor}' })).toBe(
      'Delete {title} {constructor}',
    );
  });

  it('does not read inherited properties as parameters', () => {
    expect(translate('en', 'tasks.greeting', Object.create({ name: 'inherited' }))).toBe(
      'Hi, {name}',
    );
  });

  it('has a non-empty Turkish string for every English key and the same placeholders', () => {
    for (const key of Object.keys(en) as (keyof typeof en)[]) {
      expect(tr[key].trim()).not.toBe('');
      const placeholders = (text: string) =>
        [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
      expect(placeholders(tr[key])).toEqual(placeholders(en[key]));
    }
  });

  it('recognises translation keys that arrive as data', () => {
    expect(isMessageKey('validation.email')).toBe(true);
    expect(isMessageKey('toString')).toBe(false);
    expect(isMessageKey('__proto__')).toBe(false);
  });
});

describe('resolveLanguage', () => {
  it('prefers the saved choice, then the first device language the app has, then English', () => {
    expect(resolveLanguage('tr', ['en'])).toBe('tr');
    expect(resolveLanguage('system', ['de', 'tr', 'en'])).toBe('tr');
    expect(resolveLanguage('system', ['de', null])).toBe('en');
    expect(resolveLanguage('system', [])).toBe('en');
  });
});

describe('errorMessageKey', () => {
  it.each<[unknown, string]>([
    [new ApiError('network', ''), 'errors.network'],
    [new ApiError('timeout', ''), 'errors.timeout'],
    [new ApiError('config', ''), 'errors.config'],
    [new ApiError('invalid-response', ''), 'errors.invalidResponse'],
    [new ApiError('http', '', 401, 'invalid_credentials'), 'errors.invalidCredentials'],
    [new ApiError('http', '', 429, 'too_many_attempts'), 'errors.tooManyAttempts'],
    [new ApiError('http', '', 409, 'task_limit'), 'errors.taskLimit'],
    [new ApiError('http', '', 503, 'capacity'), 'errors.server'],
    [new ApiError('http', '', 418, 'teapot'), 'errors.unknown'],
    [new Error('boom'), 'errors.unknown'],
    ['string', 'errors.unknown'],
  ])('maps %p to %s', (error, key) => {
    expect(errorMessageKey(error)).toBe(key);
  });
});

describe('shouldRetry', () => {
  it('retries network trouble, timeouts and 5xx at most twice', () => {
    expect(shouldRetry(0, new ApiError('network', ''))).toBe(true);
    expect(shouldRetry(1, new ApiError('timeout', ''))).toBe(true);
    expect(shouldRetry(0, new ApiError('http', '', 503))).toBe(true);
    expect(shouldRetry(2, new ApiError('network', ''))).toBe(false);
  });

  it('never retries 4xx, config, invalid answers or unknown errors', () => {
    expect(shouldRetry(0, new ApiError('http', '', 401))).toBe(false);
    expect(shouldRetry(0, new ApiError('http', '', 429))).toBe(false);
    expect(shouldRetry(0, new ApiError('config', ''))).toBe(false);
    expect(shouldRetry(0, new ApiError('invalid-response', ''))).toBe(false);
    expect(shouldRetry(0, new Error('x'))).toBe(false);
  });
});

describe('parseSavedPreferences', () => {
  it('keeps valid values and replaces anything else with the default', () => {
    expect(parseSavedPreferences({ appearance: 'dark', language: 'tr' })).toEqual({
      appearance: 'dark',
      language: 'tr',
    });
    expect(parseSavedPreferences({ appearance: 'neon', language: 42 })).toEqual({
      appearance: 'system',
      language: 'system',
    });
    expect(parseSavedPreferences(null)).toEqual({ appearance: 'system', language: 'system' });
    expect(parseSavedPreferences('corrupt')).toEqual({ appearance: 'system', language: 'system' });
  });
});

describe('theme', () => {
  function luminance(hex: string): number {
    const channel = (offset: number) => {
      const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
  }
  function contrast(a: string, b: string): number {
    const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
    return (light + 0.05) / (dark + 0.05);
  }

  it.each(['light', 'dark'] as const)(
    'meets WCAG AA (4.5:1) for text colours in the %s palette',
    (scheme) => {
      const colors = palettes[scheme];
      for (const background of [colors.background, colors.surface]) {
        for (const text of [colors.text, colors.muted, colors.accent, colors.danger]) {
          expect(contrast(text, background)).toBeGreaterThanOrEqual(4.5);
        }
      }
      expect(contrast(colors.onAccent, colors.accent)).toBeGreaterThanOrEqual(4.5);
    },
  );

  it('follows the device unless a scheme is chosen', () => {
    expect(resolveScheme('system', 'dark')).toBe('dark');
    expect(resolveScheme('system', null)).toBe('light');
    expect(resolveScheme('light', 'dark')).toBe('light');
  });
});

describe('mapCachedTasks', () => {
  const task = (id: string, done = false): Task => ({
    id,
    title: id,
    done,
    createdAt: '2026-10-26T00:00:00.000Z',
    updatedAt: '2026-10-26T00:00:00.000Z',
  });

  it('changes every page and keeps page params', () => {
    const data: InfiniteData<TaskPage, string | undefined> = {
      pages: [
        { items: [task('a'), task('b')], nextCursor: 'b' },
        { items: [task('c')], nextCursor: null },
      ],
      pageParams: [undefined, 'b'],
    };
    const result = mapCachedTasks(data, (items) => items.filter((item) => item.id !== 'b'));
    expect(result?.pages.map((page) => page.items.map((item) => item.id))).toEqual([['a'], ['c']]);
    expect(result?.pageParams).toEqual([undefined, 'b']);
    expect(data.pages[0]!.items).toHaveLength(2);
  });

  it('leaves an empty cache empty', () => {
    expect(mapCachedTasks(undefined, (items) => items)).toBeUndefined();
  });
});
