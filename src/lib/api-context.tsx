/**
 * Hands the API to screens through context, so tests can render a screen with a fake API.
 *
 * @module
 */
import { createContext, useContext, type ReactNode } from 'react';

import { api as defaultApi, type Api } from './api';

const ApiContext = createContext<Api>(defaultApi);

/** Provides `value` to every {@link useApi} call below it. */
export function ApiProvider({ value, children }: { value: Api; children: ReactNode }) {
  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

/** The API of the nearest {@link ApiProvider}, or the app-wide one. */
export function useApi(): Api {
  return useContext(ApiContext);
}
