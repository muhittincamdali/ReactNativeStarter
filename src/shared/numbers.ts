/**
 * Strict integer parsing for query parameters.
 *
 * `Number()` and `parseInt()` accept too much for a query string: `Number('')` is `0`,
 * `Number('1e3')` is `1000`, `parseInt('12abc')` is `12` and `Number('9'.repeat(400))` is
 * `Infinity`. A value read with them can reach a `slice()` or a loop as `NaN` or `Infinity`.
 * {@link parseBoundedInteger} accepts only plain decimal digits inside a range.
 *
 * @module
 */

/** The result of {@link parseBoundedInteger}. */
export type IntegerResult = { ok: true; value: number } | { ok: false };

/** Options for {@link parseBoundedInteger}. */
export interface IntegerRange {
  /** Smallest accepted value. */
  min: number;
  /** Largest accepted value; must be a safe integer. */
  max: number;
  /** Value used when the parameter is absent (`null` or `undefined`). */
  fallback: number;
}

const DIGITS = /^[0-9]{1,15}$/;

/**
 * Reads a query parameter as an integer in `[min, max]`.
 *
 * Only ASCII digits are accepted: no sign, spaces, decimal point, exponent, hex prefix or
 * non-ASCII digits. A missing value gives `fallback`; any other input outside the rules gives
 * `{ ok: false }`, so the caller can answer `400` instead of guessing.
 *
 * @example
 * parseBoundedInteger('25', { min: 1, max: 100, fallback: 50 }); // { ok: true, value: 25 }
 * parseBoundedInteger('1e3', { min: 1, max: 100, fallback: 50 }); // { ok: false }
 */
export function parseBoundedInteger(
  raw: string | null | undefined,
  { min, max, fallback }: IntegerRange,
): IntegerResult {
  if (raw === null || raw === undefined) return { ok: true, value: fallback };
  if (!DIGITS.test(raw)) return { ok: false };
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < min || value > max) return { ok: false };
  return { ok: true, value };
}
