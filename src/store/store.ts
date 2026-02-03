/**
 * Store Configuration
 * 
 * Central store configuration using Zustand with persistence
 * and devtools support.
 */

import { create, StateCreator } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Zustand storage adapter for AsyncStorage
 */
const zustandStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const value = await AsyncStorage.getItem(name);
    return value ?? null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await AsyncStorage.removeItem(name);
  },
};

/**
 * Create a persisted store with devtools
 */
export function createPersistedStore<T extends object>(
  name: string,
  initializer: StateCreator<T, [['zustand/devtools', never], ['zustand/persist', T]]>,
  partialize?: (state: T) => Partial<T>
) {
  return create<T>()(
    devtools(
      persist(initializer, {
        name,
        storage: createJSONStorage(() => zustandStorage),
        partialize: partialize as any,
      }),
      { name }
    )
  );
}

/**
 * Create a simple store with devtools
 */
export function createStore<T extends object>(
  name: string,
  initializer: StateCreator<T, [['zustand/devtools', never]]>
) {
  return create<T>()(
    devtools(initializer, { name })
  );
}

/**
 * Store reset helper
 */
type StoreResetFn = () => void;
const storeResetFns = new Set<StoreResetFn>();

export function registerStoreReset(resetFn: StoreResetFn): void {
  storeResetFns.add(resetFn);
}

export function unregisterStoreReset(resetFn: StoreResetFn): void {
  storeResetFns.delete(resetFn);
}

/**
 * Reset all registered stores
 */
export function resetAllStores(): void {
  storeResetFns.forEach((resetFn) => {
    resetFn();
  });
}

/**
 * Selectors helper for memoized state selection
 */
export function createSelectors<T extends object>(store: ReturnType<typeof create<T>>) {
  const selectors: Record<string, () => any> = {};
  
  // Create selectors for each key
  const keys = Object.keys(store.getState());
  keys.forEach((key) => {
    selectors[key] = () => store((state) => (state as any)[key]);
  });
  
  return selectors;
}

export default {
  createPersistedStore,
  createStore,
  registerStoreReset,
  unregisterStoreReset,
  resetAllStores,
  createSelectors,
};
