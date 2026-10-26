/**
 * Where the app finds its API.
 *
 * @module
 */

/** Inputs of {@link resolveApiBaseUrl}, read from the environment by `apiBaseUrl` in src/lib/api.ts. */
export interface ApiUrlInputs {
  /** `EXPO_PUBLIC_API_URL`, inlined at build time. */
  envUrl: string | undefined;
  /** `Platform.OS`. */
  platform: string;
  /**
   * `window.location.origin` on iOS and Android. Expo sets it to the development server in a
   * development build, and to the `origin` of the expo-router config plugin in a release build.
   */
  locationOrigin: string | undefined;
}

/**
 * The origin the app sends API requests to, without a trailing slash, or `null` when there is
 * none (a release build with neither `EXPO_PUBLIC_API_URL` nor an expo-router `origin`).
 *
 * 1. `EXPO_PUBLIC_API_URL` when it is set; it must be an `http:` or `https:` URL.
 * 2. On the web, `''`: the API routes are served by the same origin as the page.
 * 3. On iOS and Android, the origin Expo gives `window.location`: the development server, which
 *    serves the API routes next to the JavaScript bundle, or the expo-router `origin` setting.
 *
 * @throws Error when `EXPO_PUBLIC_API_URL` is set but is not an http(s) URL, so a typo fails at
 * start-up instead of on the first request.
 */
export function resolveApiBaseUrl({
  envUrl,
  platform,
  locationOrigin,
}: ApiUrlInputs): string | null {
  const configured = envUrl?.trim();
  if (configured) {
    let url: URL;
    try {
      url = new URL(configured);
    } catch {
      throw new Error(`EXPO_PUBLIC_API_URL is not a URL: "${configured}"`);
    }
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      throw new Error('EXPO_PUBLIC_API_URL must start with https:// or http://');
    }
    if (url.username || url.password || url.search || url.hash) {
      throw new Error('EXPO_PUBLIC_API_URL must not contain credentials, a query or a fragment');
    }
    return `${url.origin}${url.pathname}`.replace(/\/+$/, '');
  }
  if (platform === 'web') return '';
  if (!locationOrigin) return null;
  try {
    const url = new URL(locationOrigin);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.origin : null;
  } catch {
    return null;
  }
}
