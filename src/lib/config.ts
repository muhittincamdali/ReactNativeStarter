/**
 * Where the app finds its API.
 *
 * @module
 */

/** Inputs of {@link resolveApiBaseUrl}, read from the environment by {@link apiBaseUrl}. */
export interface ApiUrlInputs {
  /** `EXPO_PUBLIC_API_URL`, inlined at build time. */
  envUrl: string | undefined;
  /** `Platform.OS`. */
  platform: string;
  /** Host and port of the development server (`Constants.expoConfig.hostUri`). */
  hostUri: string | undefined;
  /** `__DEV__`. */
  isDev: boolean;
}

const HOST_URI = /^[A-Za-z0-9.-]{1,253}(:[0-9]{1,5})?$|^\[[0-9A-Fa-f:.]{2,45}\](:[0-9]{1,5})?$/;

/**
 * The origin the app sends API requests to, without a trailing slash, or `null` when there is
 * none (a release build without `EXPO_PUBLIC_API_URL`).
 *
 * 1. `EXPO_PUBLIC_API_URL` when it is set; it must be an `http:` or `https:` URL.
 * 2. On the web, `''`: the API routes are served by the same origin as the page.
 * 3. In a development build, the Expo development server (`http://<hostUri>`), which serves the
 *    API routes next to the JavaScript bundle.
 *
 * @throws Error when `EXPO_PUBLIC_API_URL` is set but is not an http(s) URL, so a typo fails at
 * start-up instead of on the first request.
 */
export function resolveApiBaseUrl({
  envUrl,
  platform,
  hostUri,
  isDev,
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
  if (isDev && hostUri && HOST_URI.test(hostUri)) return `http://${hostUri}`;
  return null;
}
