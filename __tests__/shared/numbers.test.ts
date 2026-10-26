import { parseBoundedInteger } from '@/shared/numbers';

const range = { min: 1, max: 100, fallback: 50 };

describe('parseBoundedInteger', () => {
  it('uses the fallback when the parameter is absent', () => {
    expect(parseBoundedInteger(null, range)).toEqual({ ok: true, value: 50 });
    expect(parseBoundedInteger(undefined, range)).toEqual({ ok: true, value: 50 });
  });

  it('accepts plain digits inside the range, including both ends', () => {
    expect(parseBoundedInteger('1', range)).toEqual({ ok: true, value: 1 });
    expect(parseBoundedInteger('100', range)).toEqual({ ok: true, value: 100 });
    expect(parseBoundedInteger('007', range)).toEqual({ ok: true, value: 7 });
  });

  it.each([
    ['empty string', ''],
    ['zero below the minimum', '0'],
    ['above the maximum', '101'],
    ['negative', '-1'],
    ['plus sign', '+5'],
    ['leading space', ' 5'],
    ['trailing space', '5 '],
    ['decimal', '5.0'],
    ['exponent', '1e2'],
    ['hex', '0x10'],
    ['NaN', 'NaN'],
    ['Infinity', 'Infinity'],
    ['digits then letters', '12abc'],
    ['Arabic-Indic digits', '٥'],
    ['full-width digits', '５'],
    ['400 digits', '9'.repeat(400)],
  ])('rejects %s', (_, raw) => {
    expect(parseBoundedInteger(raw, range)).toEqual({ ok: false });
  });

  it('reads at most 15 digits, so no accepted value can lose precision', () => {
    const wide = { min: 0, max: Number.MAX_SAFE_INTEGER, fallback: 0 };
    expect(parseBoundedInteger('9007199254740991', wide)).toEqual({ ok: false });
    expect(parseBoundedInteger('900719925474099', wide)).toEqual({
      ok: true,
      value: 900719925474099,
    });
  });
});
