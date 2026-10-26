/**
 * Typed translations without a library: a dictionary per language, `{name}` placeholders and
 * a fallback to English.
 *
 * @module
 */
import { getLocales } from 'expo-localization';

import { ApiError } from '../api-client';
import { usePreferences, type LanguagePreference } from '../preferences';

import { en, type MessageKey } from './en';
import { tr } from './tr';

export type { MessageKey } from './en';

/** Languages the app has. */
export type Language = 'en' | 'tr';

const DICTIONARIES: Record<Language, Record<MessageKey, string>> = { en, tr };

/** Values for `{placeholders}`. */
export type MessageParams = Record<string, string | number>;

/** `true` when `key` is a translation key, for keys that arrive as data (API field errors). */
export function isMessageKey(key: string): key is MessageKey {
  return Object.prototype.hasOwnProperty.call(en, key);
}

/**
 * Translates `key` into `language`, replacing `{name}` with `params.name`. A placeholder without
 * a value stays as written, so a missing parameter is visible instead of printing `undefined`.
 */
export function translate(language: Language, key: MessageKey, params?: MessageParams): string {
  const template = DICTIONARIES[language][key] ?? en[key];
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : match,
  );
}

/** The language to show: the saved choice, else the first device language the app has, else English. */
export function resolveLanguage(
  preference: LanguagePreference,
  deviceLanguages: readonly (string | null)[],
): Language {
  if (preference !== 'system') return preference;
  for (const code of deviceLanguages) {
    if (code === 'en' || code === 'tr') return code;
  }
  return 'en';
}

/** The current language and a bound `t()`. Re-renders when the language preference changes. */
export function useTranslation(): {
  language: Language;
  t: (key: MessageKey, params?: MessageParams) => string;
} {
  const preference = usePreferences((state) => state.language);
  const language = resolveLanguage(
    preference,
    getLocales().map((locale) => locale.languageCode),
  );
  return { language, t: (key, params) => translate(language, key, params) };
}

/** The message key that explains an error to the user. */
export function errorMessageKey(error: unknown): MessageKey {
  if (!(error instanceof ApiError)) return 'errors.unknown';
  switch (error.kind) {
    case 'config':
      return 'errors.config';
    case 'network':
      return 'errors.network';
    case 'timeout':
      return 'errors.timeout';
    case 'invalid-response':
      return 'errors.invalidResponse';
    case 'http':
      break;
  }
  switch (error.code) {
    case 'invalid_credentials':
      return 'errors.invalidCredentials';
    case 'too_many_attempts':
      return 'errors.tooManyAttempts';
    case 'task_limit':
      return 'errors.taskLimit';
    case 'email_taken':
      return 'validation.emailTaken';
  }
  return error.status !== undefined && error.status >= 500 ? 'errors.server' : 'errors.unknown';
}
