/**
 * Storage for the session on iOS and Android: the Keychain and the Android Keystore through
 * `expo-secure-store`. The web build uses `secure-storage.web.ts` instead.
 *
 * @module
 */
import * as SecureStore from 'expo-secure-store';

const OPTIONS: SecureStore.SecureStoreOptions = {
  // Readable after the first unlock, so a background refresh can still read the token, but never
  // copied to another device through a backup.
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
};

/** Reads a value; `null` when it is missing or the store cannot be read. */
export async function readSecure(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key, OPTIONS);
  } catch {
    return null;
  }
}

/** Writes a value. */
export async function writeSecure(key: string, value: string): Promise<void> {
  await SecureStore.setItemAsync(key, value, OPTIONS);
}

/** Deletes a value; deleting a missing value does nothing. */
export async function deleteSecure(key: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(key, OPTIONS);
  } catch {
    // Nothing stored, or the store is unavailable: either way there is nothing left to delete.
  }
}
