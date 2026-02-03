/**
 * useStorage Hook
 * 
 * Provides persistent storage with async state management.
 * Supports both AsyncStorage and SecureStorage.
 */

import { useState, useCallback, useEffect, useRef } from 'react';

import { getValue, setValue, removeValue, getAllKeys, clear } from '../services/storage/AsyncStorage';
import { getSecureValue, setSecureValue, deleteSecureValue } from '../services/storage/SecureStorage';

interface UseStorageOptions<T> {
  defaultValue?: T;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
  secure?: boolean;
}

interface UseStorageReturn<T> {
  value: T | undefined;
  setValue: (value: T) => Promise<void>;
  removeValue: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook for persisted state with AsyncStorage
 */
export function useStorage<T>(
  key: string,
  options: UseStorageOptions<T> = {}
): UseStorageReturn<T> {
  const {
    defaultValue,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    secure = false,
  } = options;

  const [value, setValueState] = useState<T | undefined>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  // Load value on mount
  useEffect(() => {
    mountedRef.current = true;
    
    const loadValue = async () => {
      try {
        const getter = secure ? getSecureValue : getValue;
        const storedValue = await getter(key);
        
        if (mountedRef.current) {
          if (storedValue !== null) {
            setValueState(deserialize(storedValue));
          } else {
            setValueState(defaultValue);
          }
        }
      } catch (err) {
        if (mountedRef.current) {
          setError(err as Error);
          setValueState(defaultValue);
        }
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    loadValue();

    return () => {
      mountedRef.current = false;
    };
  }, [key, defaultValue, deserialize, secure]);

  // Set value
  const setStoredValue = useCallback(async (newValue: T) => {
    try {
      setError(null);
      const setter = secure ? setSecureValue : setValue;
      await setter(key, serialize(newValue));
      
      if (mountedRef.current) {
        setValueState(newValue);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err as Error);
      }
      throw err;
    }
  }, [key, serialize, secure]);

  // Remove value
  const removeStoredValue = useCallback(async () => {
    try {
      setError(null);
      const remover = secure ? deleteSecureValue : removeValue;
      await remover(key);
      
      if (mountedRef.current) {
        setValueState(defaultValue);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err as Error);
      }
      throw err;
    }
  }, [key, defaultValue, secure]);

  return {
    value,
    setValue: setStoredValue,
    removeValue: removeStoredValue,
    isLoading,
    error,
  };
}

/**
 * Hook for managing multiple storage keys
 */
export function useMultiStorage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getMultiple = useCallback(async <T>(keys: string[]): Promise<Map<string, T | null>> => {
    setIsLoading(true);
    setError(null);

    try {
      const results = new Map<string, T | null>();
      
      await Promise.all(
        keys.map(async (key) => {
          const value = await getValue(key);
          results.set(key, value ? JSON.parse(value) : null);
        })
      );

      return results;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setMultiple = useCallback(async <T>(data: Map<string, T>): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await Promise.all(
        Array.from(data.entries()).map(([key, value]) =>
          setValue(key, JSON.stringify(value))
        )
      );
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeMultiple = useCallback(async (keys: string[]): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await Promise.all(keys.map(key => removeValue(key)));
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearAll = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await clear();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const listKeys = useCallback(async (): Promise<string[]> => {
    try {
      return await getAllKeys();
    } catch (err) {
      setError(err as Error);
      return [];
    }
  }, []);

  return {
    getMultiple,
    setMultiple,
    removeMultiple,
    clearAll,
    listKeys,
    isLoading,
    error,
  };
}

export default useStorage;
