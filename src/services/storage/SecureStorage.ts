/**
 * SecureStorage Service
 * 
 * Secure storage for sensitive data like tokens and credentials.
 * Uses expo-secure-store for encrypted storage.
 */

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Storage key prefix
const SECURE_PREFIX = 'secure_';

// SecureStore options
const SECURE_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED,
};

/**
 * Check if secure storage is available
 */
export async function isSecureStorageAvailable(): Promise<boolean> {
  return await SecureStore.isAvailableAsync();
}

/**
 * Get value from secure storage
 */
export async function getSecureValue(key: string): Promise<string | null> {
  try {
    // Web fallback
    if (Platform.OS === 'web') {
      return localStorage.getItem(`${SECURE_PREFIX}${key}`);
    }

    const value = await SecureStore.getItemAsync(key, SECURE_OPTIONS);
    return value;
  } catch (error) {
    console.error(`SecureStorage getSecureValue error for key ${key}:`, error);
    return null;
  }
}

/**
 * Set value in secure storage
 */
export async function setSecureValue(key: string, value: string): Promise<boolean> {
  try {
    // Web fallback
    if (Platform.OS === 'web') {
      localStorage.setItem(`${SECURE_PREFIX}${key}`, value);
      return true;
    }

    await SecureStore.setItemAsync(key, value, SECURE_OPTIONS);
    return true;
  } catch (error) {
    console.error(`SecureStorage setSecureValue error for key ${key}:`, error);
    return false;
  }
}

/**
 * Delete value from secure storage
 */
export async function deleteSecureValue(key: string): Promise<boolean> {
  try {
    // Web fallback
    if (Platform.OS === 'web') {
      localStorage.removeItem(`${SECURE_PREFIX}${key}`);
      return true;
    }

    await SecureStore.deleteItemAsync(key, SECURE_OPTIONS);
    return true;
  } catch (error) {
    console.error(`SecureStorage deleteSecureValue error for key ${key}:`, error);
    return false;
  }
}

/**
 * Get typed value from secure storage
 */
export async function getSecureTypedValue<T>(key: string): Promise<T | null> {
  try {
    const value = await getSecureValue(key);
    if (value === null) return null;
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`SecureStorage getSecureTypedValue error for key ${key}:`, error);
    return null;
  }
}

/**
 * Set typed value in secure storage
 */
export async function setSecureTypedValue<T>(key: string, value: T): Promise<boolean> {
  try {
    return await setSecureValue(key, JSON.stringify(value));
  } catch (error) {
    console.error(`SecureStorage setSecureTypedValue error for key ${key}:`, error);
    return false;
  }
}

/**
 * Secure storage keys used in the app
 */
export const SecureStorageKeys = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  TOKEN_EXPIRY: 'token_expiry',
  BIOMETRIC_CREDENTIALS: 'biometric_credentials',
  PIN_CODE: 'pin_code',
} as const;

export default {
  isSecureStorageAvailable,
  getSecureValue,
  setSecureValue,
  deleteSecureValue,
  getSecureTypedValue,
  setSecureTypedValue,
  SecureStorageKeys,
};
