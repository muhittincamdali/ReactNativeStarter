/**
 * Session storage for the web build. Browsers have no keychain, so the session lives in
 * `sessionStorage`: it survives a reload but not closing the tab, and other sites cannot read it.
 * Any script on this origin can, which is why the app loads no third-party scripts. For a
 * public web app, prefer an `HttpOnly` cookie set by the API.
 *
 * @module
 */

function storage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

/** Reads a value; `null` when it is missing or storage is blocked. */
export async function readSecure(key: string): Promise<string | null> {
  try {
    return storage()?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

/** Writes a value; does nothing when storage is blocked (private mode, server rendering). */
export async function writeSecure(key: string, value: string): Promise<void> {
  try {
    storage()?.setItem(key, value);
  } catch {
    // Storage full or blocked: the session then lasts until the page is closed.
  }
}

/** Deletes a value. */
export async function deleteSecure(key: string): Promise<void> {
  try {
    storage()?.removeItem(key);
  } catch {
    // Blocked storage holds nothing to delete.
  }
}
