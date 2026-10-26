import {
  createTaskSchema,
  fieldErrors,
  signInSchema,
  signUpSchema,
  taskTitleSchema,
  updateTaskSchema,
} from '@/shared/schemas';

describe('signUpSchema', () => {
  const valid = { name: 'Ada', email: 'ada@example.com', password: 'correct horse' };

  it('trims and lower-cases the e-mail address', () => {
    const result = signUpSchema.parse({ ...valid, email: '  Ada@Example.COM ' });
    expect(result.email).toBe('ada@example.com');
  });

  it('rejects a password shorter than 8 characters with a translation key', () => {
    const result = signUpSchema.safeParse({ ...valid, password: 'short' });
    expect(result.success).toBe(false);
    expect(fieldErrors(result.error!)).toEqual({ password: 'validation.passwordTooShort' });
  });

  it('rejects a password longer than 128 characters', () => {
    const result = signUpSchema.safeParse({ ...valid, password: 'x'.repeat(129) });
    expect(fieldErrors(result.error!)).toEqual({ password: 'validation.tooLong' });
  });

  it('normalises the password with NFKC, so full-width and ASCII spellings match', () => {
    const fullWidth = signUpSchema.parse({ ...valid, password: 'ｐａｓｓｗｏｒｄ１' });
    expect(fullWidth.password).toBe('password1');
  });

  it('rejects an unknown field instead of ignoring it', () => {
    const result = signUpSchema.safeParse({ ...valid, admin: true });
    expect(fieldErrors(result.error!)).toEqual({ _form: 'validation.invalid' });
  });

  it('rejects a body that is not an object', () => {
    for (const body of [null, [], 'text', 42]) {
      const result = signUpSchema.safeParse(body);
      expect(result.success).toBe(false);
      expect(fieldErrors(result.error!)).toEqual({ _form: 'validation.invalid' });
    }
  });

  it('rejects an e-mail address longer than 254 characters before checking its format', () => {
    const email = `${'a'.repeat(250)}@example.com`;
    const result = signUpSchema.safeParse({ ...valid, email });
    expect(fieldErrors(result.error!).email).toBe('validation.tooLong');
  });

  it('reports one message per field', () => {
    const result = signUpSchema.safeParse({ name: '', email: 'nope', password: '' });
    expect(fieldErrors(result.error!)).toEqual({
      name: 'validation.required',
      email: 'validation.email',
      password: 'validation.passwordTooShort',
    });
  });
});

describe('signInSchema', () => {
  it('does not apply the new-password length rule, so old short passwords can still sign in', () => {
    expect(signInSchema.safeParse({ email: 'a@b.co', password: 'short' }).success).toBe(true);
  });

  it('requires a password', () => {
    const result = signInSchema.safeParse({ email: 'a@b.co', password: '' });
    expect(fieldErrors(result.error!)).toEqual({ password: 'validation.required' });
  });
});

describe('taskTitleSchema', () => {
  it('trims the title and keeps emoji sequences with joiners', () => {
    expect(taskTitleSchema.parse('  Ship 👩‍💻 build  ')).toBe('Ship 👩‍💻 build');
  });

  it('normalises to NFC, so a decomposed \u00E9 is stored as one character', () => {
    expect(taskTitleSchema.parse('Cafe\u0301')).toBe('Caf\u00E9');
  });

  it.each([
    ['only spaces', '   ', 'validation.required'],
    ['a NUL character', 'a\u0000b', 'validation.invalidCharacters'],
    ['a newline', 'line\nbreak', 'validation.invalidCharacters'],
    ['a right-to-left override', 'abc\u202Edcb', 'validation.invalidCharacters'],
    ['a line separator', 'a\u2028b', 'validation.invalidCharacters'],
    ['201 characters', 'x'.repeat(201), 'validation.tooLong'],
  ])('rejects %s', (_, title, key) => {
    const result = createTaskSchema.safeParse({ title });
    expect(fieldErrors(result.error!)).toEqual({ title: key });
  });

  it('accepts exactly 200 characters', () => {
    expect(taskTitleSchema.parse('x'.repeat(200))).toHaveLength(200);
  });
});

describe('updateTaskSchema', () => {
  it('requires a title or a state', () => {
    const result = updateTaskSchema.safeParse({});
    expect(fieldErrors(result.error!)).toEqual({ _form: 'validation.nothingToUpdate' });
  });

  it('rejects a state that is not a boolean', () => {
    const result = updateTaskSchema.safeParse({ done: 'true' });
    expect(fieldErrors(result.error!)).toEqual({ done: 'validation.invalid' });
  });

  it('accepts a state alone', () => {
    expect(updateTaskSchema.parse({ done: true })).toEqual({ done: true });
  });
});

describe('fieldErrors', () => {
  it('keeps at most 20 fields', () => {
    const many = Object.fromEntries(Array.from({ length: 40 }, (_, i) => [`f${i}`, 1]));
    const result = signInSchema.safeParse(many);
    expect(Object.keys(fieldErrors(result.error!)).length).toBeLessThanOrEqual(20);
  });
});
