/**
 * AsyncStorage Service
 * 
 * Wrapper around AsyncStorage with type safety,
 * batch operations, and error handling.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage key prefix to avoid conflicts
const STORAGE_PREFIX = '@ReactNativeStarter:';

/**
 * Build prefixed key
 */
function buildKey(key: string): string {
  return `${STORAGE_PREFIX}${key}`;
}

/**
 * Get value from storage
 */
export async function getValue(key: string): Promise<string | null> {
  try {
    const value = await AsyncStorage.getItem(buildKey(key));
    return value;
  } catch (error) {
    console.error(`AsyncStorage getValue error for key ${key}:`, error);
    return null;
  }
}

/**
 * Get typed value from storage
 */
export async function getTypedValue<T>(key: string): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(buildKey(key));
    if (value === null) return null;
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`AsyncStorage getTypedValue error for key ${key}:`, error);
    return null;
  }
}

/**
 * Set value in storage
 */
export async function setValue(key: string, value: string): Promise<boolean> {
  try {
    await AsyncStorage.setItem(buildKey(key), value);
    return true;
  } catch (error) {
    console.error(`AsyncStorage setValue error for key ${key}:`, error);
    return false;
  }
}

/**
 * Set typed value in storage
 */
export async function setTypedValue<T>(key: string, value: T): Promise<boolean> {
  try {
    await AsyncStorage.setItem(buildKey(key), JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`AsyncStorage setTypedValue error for key ${key}:`, error);
    return false;
  }
}

/**
 * Remove value from storage
 */
export async function removeValue(key: string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(buildKey(key));
    return true;
  } catch (error) {
    console.error(`AsyncStorage removeValue error for key ${key}:`, error);
    return false;
  }
}

/**
 * Get multiple values
 */
export async function getMultipleValues(keys: string[]): Promise<Map<string, string | null>> {
  try {
    const prefixedKeys = keys.map(buildKey);
    const pairs = await AsyncStorage.multiGet(prefixedKeys);
    
    const result = new Map<string, string | null>();
    pairs.forEach(([key, value]) => {
      const originalKey = key.replace(STORAGE_PREFIX, '');
      result.set(originalKey, value);
    });
    
    return result;
  } catch (error) {
    console.error('AsyncStorage getMultipleValues error:', error);
    return new Map();
  }
}

/**
 * Set multiple values
 */
export async function setMultipleValues(entries: [string, string][]): Promise<boolean> {
  try {
    const prefixedEntries: [string, string][] = entries.map(([key, value]) => [
      buildKey(key),
      value,
    ]);
    await AsyncStorage.multiSet(prefixedEntries);
    return true;
  } catch (error) {
    console.error('AsyncStorage setMultipleValues error:', error);
    return false;
  }
}

/**
 * Remove multiple values
 */
export async function removeMultipleValues(keys: string[]): Promise<boolean> {
  try {
    const prefixedKeys = keys.map(buildKey);
    await AsyncStorage.multiRemove(prefixedKeys);
    return true;
  } catch (error) {
    console.error('AsyncStorage removeMultipleValues error:', error);
    return false;
  }
}

/**
 * Get all keys
 */
export async function getAllKeys(): Promise<string[]> {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    return allKeys
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .map(key => key.replace(STORAGE_PREFIX, ''));
  } catch (error) {
    console.error('AsyncStorage getAllKeys error:', error);
    return [];
  }
}

/**
 * Clear all storage
 */
export async function clear(): Promise<boolean> {
  try {
    const keys = await getAllKeys();
    await removeMultipleValues(keys);
    return true;
  } catch (error) {
    console.error('AsyncStorage clear error:', error);
    return false;
  }
}

/**
 * Merge value with existing
 */
export async function mergeValue(key: string, value: object): Promise<boolean> {
  try {
    await AsyncStorage.mergeItem(buildKey(key), JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`AsyncStorage mergeValue error for key ${key}:`, error);
    return false;
  }
}

export default {
  getValue,
  getTypedValue,
  setValue,
  setTypedValue,
  removeValue,
  getMultipleValues,
  setMultipleValues,
  removeMultipleValues,
  getAllKeys,
  clear,
  mergeValue,
};
