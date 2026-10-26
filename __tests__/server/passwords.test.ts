import { base64url, constantTimeEqual, fromBase64url, randomToken } from '@/server/crypto';
import { hashPassword, verifyPassword } from '@/server/passwords';

const FAST = 1_000;

describe('hashPassword and verifyPassword', () => {
  it('verifies the right password and rejects a wrong one', async () => {
    const stored = await hashPassword('correct horse', FAST);
    await expect(verifyPassword('correct horse', stored)).resolves.toBe(true);
    await expect(verifyPassword('correct horse ', stored)).resolves.toBe(false);
    await expect(verifyPassword('', stored)).resolves.toBe(false);
  });

  it('uses a new salt for every hash', async () => {
    const [a, b] = await Promise.all([hashPassword('same', FAST), hashPassword('same', FAST)]);
    expect(a).not.toBe(b);
  });

  it('stores the algorithm and the iteration count, so the count can change later', async () => {
    const stored = await hashPassword('x', 1234);
    expect(stored).toMatch(/^pbkdf2-sha256\$1234\$[A-Za-z0-9_-]{22}\$[A-Za-z0-9_-]{43}$/);
  });

  it('matches a hash computed with the default 600,000 iterations', async () => {
    const stored = await hashPassword('slow but safe');
    expect(stored.split('$')[1]).toBe('600000');
    await expect(verifyPassword('slow but safe', stored)).resolves.toBe(true);
  });

  it.each([Number.NaN, Infinity, 1.5, 0, 999, 10_000_001])(
    'refuses %p iterations',
    async (iterations) => {
      await expect(hashPassword('x', iterations)).rejects.toThrow(RangeError);
    },
  );

  describe('a malformed stored hash never matches and never throws', () => {
    let valid: string;
    beforeAll(async () => {
      valid = await hashPassword('pw', FAST);
    });

    const mutate = (fn: (parts: string[]) => void) => {
      const parts = valid.split('$');
      fn(parts);
      return parts.join('$');
    };

    it.each<[string, () => string]>([
      ['empty', () => ''],
      ['another algorithm', () => mutate((p) => (p[0] = 'bcrypt'))],
      ['NaN iterations', () => mutate((p) => (p[1] = 'NaN'))],
      ['exponent iterations', () => mutate((p) => (p[1] = '1e9'))],
      ['huge iterations', () => mutate((p) => (p[1] = '99999999'))],
      ['too few iterations', () => mutate((p) => (p[1] = '999'))],
      ['leading zero', () => mutate((p) => (p[1] = '01000'))],
      ['bad salt', () => mutate((p) => (p[2] = '***'))],
      ['short salt', () => mutate((p) => (p[2] = 'AAAA'))],
      ['short hash', () => mutate((p) => (p[3] = 'AAAA'))],
      ['extra part', () => `${valid}$x`],
    ])('%s', async (_, stored) => {
      await expect(verifyPassword('pw', stored())).resolves.toBe(false);
    });
  });
});

describe('crypto helpers', () => {
  it('round-trips base64url without padding', () => {
    const bytes = Uint8Array.from({ length: 256 }, (_, i) => i);
    const text = base64url(bytes);
    expect(text).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(fromBase64url(text)).toEqual(bytes);
  });

  it('rejects text that is not base64url', () => {
    expect(fromBase64url('ab+/')).toBeNull();
    expect(fromBase64url('abc=')).toBeNull();
    expect(fromBase64url('a')).toBeNull();
  });

  it('makes 43-character tokens that differ', () => {
    const tokens = new Set(Array.from({ length: 100 }, randomToken));
    expect(tokens.size).toBe(100);
    for (const token of tokens) expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
  });

  it('compares bytes', () => {
    expect(constantTimeEqual(new Uint8Array([1, 2]), new Uint8Array([1, 2]))).toBe(true);
    expect(constantTimeEqual(new Uint8Array([1, 2]), new Uint8Array([1, 3]))).toBe(false);
    expect(constantTimeEqual(new Uint8Array([1]), new Uint8Array([1, 0]))).toBe(false);
  });
});
