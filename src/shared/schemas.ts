/**
 * Request and response shapes shared by the app and the API.
 *
 * The API parses every request body with these schemas and the app parses every response with
 * them, so a field renamed on one side fails a test instead of reaching a screen as `undefined`.
 * Validation messages are translation keys (see `src/lib/i18n`), not English text.
 *
 * @module
 */
import { z } from 'zod';

import {
  MAX_EMAIL_LENGTH,
  MAX_NAME_LENGTH,
  MAX_PASSWORD_LENGTH,
  MAX_TASK_TITLE_LENGTH,
  MIN_PASSWORD_LENGTH,
} from './limits';

// C0/C1 controls, line and paragraph separators and the bidirectional overrides and isolates
// (the "Trojan Source" characters). Joiners and variation selectors stay, so emoji sequences
// such as 👩‍💻 are accepted.
const UNSAFE_TEXT = /[\p{Cc}\u2028\u2029\u202A-\u202E\u2066-\u2069]/u;

const visibleText = (max: number) =>
  z
    .string({ error: 'validation.required' })
    .normalize('NFC')
    .trim()
    .min(1, { error: 'validation.required' })
    .max(max, { error: 'validation.tooLong' })
    .refine((value) => !UNSAFE_TEXT.test(value), { error: 'validation.invalidCharacters' });

/** An e-mail address, trimmed and lower-cased before it is checked. */
export const emailSchema = z
  .string({ error: 'validation.required' })
  .trim()
  .toLowerCase()
  .min(1, { error: 'validation.required' })
  .max(MAX_EMAIL_LENGTH, { error: 'validation.tooLong' })
  .pipe(z.email({ error: 'validation.email' }));

/** A new password: 8 to 128 characters after NFKC normalisation (NIST SP 800-63B §5.1.1.2). */
export const newPasswordSchema = z
  .string({ error: 'validation.required' })
  .normalize('NFKC')
  .min(MIN_PASSWORD_LENGTH, { error: 'validation.passwordTooShort' })
  .max(MAX_PASSWORD_LENGTH, { error: 'validation.tooLong' });

/** A password typed at sign-in: only presence and the upper bound are checked. */
export const passwordSchema = z
  .string({ error: 'validation.required' })
  .normalize('NFKC')
  .min(1, { error: 'validation.required' })
  .max(MAX_PASSWORD_LENGTH, { error: 'validation.tooLong' });

/** Body of `POST /api/auth/sign-up`. */
export const signUpSchema = z.strictObject({
  name: visibleText(MAX_NAME_LENGTH),
  email: emailSchema,
  password: newPasswordSchema,
});

/** Body of `POST /api/auth/sign-in`. */
export const signInSchema = z.strictObject({
  email: emailSchema,
  password: passwordSchema,
});

/** A task title: 1 to 200 characters of visible text. */
export const taskTitleSchema = visibleText(MAX_TASK_TITLE_LENGTH);

/** Body of `POST /api/tasks`. */
export const createTaskSchema = z.strictObject({ title: taskTitleSchema });

/** Body of `PATCH /api/tasks/:id`: a new title, a new state, or both. */
export const updateTaskSchema = z
  .strictObject({ title: taskTitleSchema.optional(), done: z.boolean().optional() })
  .refine((value) => value.title !== undefined || value.done !== undefined, {
    error: 'validation.nothingToUpdate',
  });

/** Identifier of a user or a task: a random UUID. */
export const idSchema = z.uuid();

/** The signed-in account as the API returns it. */
export const userSchema = z.object({
  id: idSchema,
  name: z.string(),
  email: z.string(),
});

/** Answer of sign-up and sign-in. */
export const sessionSchema = z.object({
  token: z.string().regex(/^[A-Za-z0-9_-]{43}$/),
  user: userSchema,
});

/** A task as the API returns it. Dates are ISO 8601 strings. */
export const taskSchema = z.object({
  id: idSchema,
  title: z.string(),
  done: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

/** One page of `GET /api/tasks`, newest first. */
export const taskPageSchema = z.object({
  items: z.array(taskSchema),
  nextCursor: idSchema.nullable(),
});

/** Every error answer of the API. */
export const errorBodySchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    fields: z.record(z.string(), z.string()).optional(),
  }),
});

export type SignUpInput = z.input<typeof signUpSchema>;
export type SignInInput = z.input<typeof signInSchema>;
export type CreateTaskInput = z.input<typeof createTaskSchema>;
export type UpdateTaskInput = z.input<typeof updateTaskSchema>;
export type User = z.infer<typeof userSchema>;
export type Session = z.infer<typeof sessionSchema>;
export type Task = z.infer<typeof taskSchema>;
export type TaskPage = z.infer<typeof taskPageSchema>;
export type ErrorBody = z.infer<typeof errorBodySchema>;

const MAX_FIELD_ERRORS = 20;

/**
 * Turns validation issues into `{ field: messageKey }`, one entry per field (the first issue),
 * at most 20 entries. A form-level issue (a body that is not an object, an unknown field) is
 * stored under `_form`. Messages that are not translation keys, such as zod's own English text
 * for a wrong type, become `validation.invalid`.
 */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    if (Object.keys(fields).length >= MAX_FIELD_ERRORS) break;
    const key =
      issue.path.length && issue.code !== 'unrecognized_keys' ? String(issue.path[0]) : '_form';
    fields[key] ??= issue.message.startsWith('validation.') ? issue.message : 'validation.invalid';
  }
  return fields;
}
