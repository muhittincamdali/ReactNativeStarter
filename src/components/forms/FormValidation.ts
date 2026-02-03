/**
 * Form Validation Utilities
 * 
 * Provides validation schemas and helper functions
 * for form validation using zod.
 */

import { z } from 'zod';

/**
 * Common validation patterns
 */
const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-()]{10,}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  username: /^[a-zA-Z0-9_]{3,20}$/,
  url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
};

/**
 * Custom error messages
 */
const errorMessages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  password: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
  passwordMin: 'Password must be at least 8 characters',
  username: 'Username must be 3-20 characters and contain only letters, numbers, and underscores',
  url: 'Please enter a valid URL',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be no more than ${max} characters`,
  passwordMatch: 'Passwords do not match',
};

/**
 * Login form schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, errorMessages.required)
    .email(errorMessages.email),
  password: z
    .string()
    .min(1, errorMessages.required)
    .min(8, errorMessages.passwordMin),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Registration form schema
 */
export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, errorMessages.required)
    .min(2, errorMessages.minLength(2))
    .max(50, errorMessages.maxLength(50)),
  lastName: z
    .string()
    .min(1, errorMessages.required)
    .min(2, errorMessages.minLength(2))
    .max(50, errorMessages.maxLength(50)),
  email: z
    .string()
    .min(1, errorMessages.required)
    .email(errorMessages.email),
  password: z
    .string()
    .min(1, errorMessages.required)
    .min(8, errorMessages.passwordMin)
    .regex(patterns.password, errorMessages.password),
  confirmPassword: z
    .string()
    .min(1, errorMessages.required),
}).refine(data => data.password === data.confirmPassword, {
  message: errorMessages.passwordMatch,
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Profile form schema
 */
export const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, errorMessages.required)
    .min(2, errorMessages.minLength(2))
    .max(50, errorMessages.maxLength(50)),
  lastName: z
    .string()
    .min(1, errorMessages.required)
    .min(2, errorMessages.minLength(2))
    .max(50, errorMessages.maxLength(50)),
  username: z
    .string()
    .min(1, errorMessages.required)
    .regex(patterns.username, errorMessages.username),
  email: z
    .string()
    .min(1, errorMessages.required)
    .email(errorMessages.email),
  phone: z
    .string()
    .optional()
    .refine(val => !val || patterns.phone.test(val), {
      message: errorMessages.phone,
    }),
  bio: z
    .string()
    .max(150, errorMessages.maxLength(150))
    .optional(),
  website: z
    .string()
    .optional()
    .refine(val => !val || patterns.url.test(val), {
      message: errorMessages.url,
    }),
  location: z
    .string()
    .max(100, errorMessages.maxLength(100))
    .optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

/**
 * Password change schema
 */
export const passwordChangeSchema = z.object({
  currentPassword: z
    .string()
    .min(1, errorMessages.required),
  newPassword: z
    .string()
    .min(1, errorMessages.required)
    .min(8, errorMessages.passwordMin)
    .regex(patterns.password, errorMessages.password),
  confirmPassword: z
    .string()
    .min(1, errorMessages.required),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: errorMessages.passwordMatch,
  path: ['confirmPassword'],
});

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

/**
 * Helper function to validate a single field
 */
export function validateField<T>(
  schema: z.ZodSchema<T>,
  value: unknown
): { isValid: boolean; error?: string } {
  const result = schema.safeParse(value);
  
  if (result.success) {
    return { isValid: true };
  }
  
  return {
    isValid: false,
    error: result.error.errors[0]?.message,
  };
}

/**
 * Export patterns for direct use
 */
export { patterns, errorMessages };
