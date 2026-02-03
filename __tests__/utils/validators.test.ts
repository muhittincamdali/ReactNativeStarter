/**
 * Validators Tests
 */

import {
  validateEmail,
  validatePassword,
  validateStrongPassword,
  validateConfirmPassword,
  validateName,
  validatePhone,
  validateUrl,
  validateUsername,
  getPasswordStrength,
} from '../../src/utils/validators';

describe('Validators', () => {
  describe('validateEmail', () => {
    it('returns valid for correct email', () => {
      expect(validateEmail('test@example.com').isValid).toBe(true);
      expect(validateEmail('user.name@domain.co.uk').isValid).toBe(true);
    });

    it('returns invalid for incorrect email', () => {
      expect(validateEmail('').isValid).toBe(false);
      expect(validateEmail('invalid').isValid).toBe(false);
      expect(validateEmail('invalid@').isValid).toBe(false);
      expect(validateEmail('@domain.com').isValid).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('returns valid for password >= 8 chars', () => {
      expect(validatePassword('password123').isValid).toBe(true);
      expect(validatePassword('12345678').isValid).toBe(true);
    });

    it('returns invalid for short password', () => {
      expect(validatePassword('').isValid).toBe(false);
      expect(validatePassword('short').isValid).toBe(false);
      expect(validatePassword('1234567').isValid).toBe(false);
    });
  });

  describe('validateStrongPassword', () => {
    it('returns valid for strong password', () => {
      expect(validateStrongPassword('Password1!').isValid).toBe(true);
      expect(validateStrongPassword('Str0ng@Pass').isValid).toBe(true);
    });

    it('returns invalid for weak password', () => {
      expect(validateStrongPassword('password').isValid).toBe(false);
      expect(validateStrongPassword('PASSWORD123').isValid).toBe(false);
      expect(validateStrongPassword('Password123').isValid).toBe(false);
    });
  });

  describe('validateConfirmPassword', () => {
    it('returns valid when passwords match', () => {
      expect(validateConfirmPassword('password123', 'password123').isValid).toBe(true);
    });

    it('returns invalid when passwords do not match', () => {
      expect(validateConfirmPassword('password123', 'password456').isValid).toBe(false);
      expect(validateConfirmPassword('password123', '').isValid).toBe(false);
    });
  });

  describe('validateName', () => {
    it('returns valid for correct names', () => {
      expect(validateName('John').isValid).toBe(true);
      expect(validateName('Mary Jane').isValid).toBe(true);
      expect(validateName("O'Connor").isValid).toBe(true);
    });

    it('returns invalid for incorrect names', () => {
      expect(validateName('').isValid).toBe(false);
      expect(validateName('A').isValid).toBe(false);
      expect(validateName('Name123').isValid).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('returns valid for correct phone numbers', () => {
      expect(validatePhone('1234567890').isValid).toBe(true);
      expect(validatePhone('+1 (234) 567-8900').isValid).toBe(true);
    });

    it('returns invalid for incorrect phone numbers', () => {
      expect(validatePhone('').isValid).toBe(false);
      expect(validatePhone('123').isValid).toBe(false);
    });
  });

  describe('validateUrl', () => {
    it('returns valid for correct URLs', () => {
      expect(validateUrl('https://example.com').isValid).toBe(true);
      expect(validateUrl('http://sub.domain.co.uk/path').isValid).toBe(true);
      expect(validateUrl('').isValid).toBe(true); // Optional
    });

    it('returns invalid for incorrect URLs', () => {
      expect(validateUrl('not-a-url').isValid).toBe(false);
    });
  });

  describe('validateUsername', () => {
    it('returns valid for correct usernames', () => {
      expect(validateUsername('john_doe').isValid).toBe(true);
      expect(validateUsername('user123').isValid).toBe(true);
    });

    it('returns invalid for incorrect usernames', () => {
      expect(validateUsername('').isValid).toBe(false);
      expect(validateUsername('ab').isValid).toBe(false);
      expect(validateUsername('user-name').isValid).toBe(false);
      expect(validateUsername('a'.repeat(21)).isValid).toBe(false);
    });
  });

  describe('getPasswordStrength', () => {
    it('returns correct strength levels', () => {
      expect(getPasswordStrength('').level).toBe('none');
      expect(getPasswordStrength('password').level).toBe('weak');
      expect(getPasswordStrength('Password1').level).toBe('fair');
      expect(getPasswordStrength('Password1!').level).toBe('good');
      expect(getPasswordStrength('MyStr0ng@Pass!').level).toBe('strong');
    });

    it('returns correct scores', () => {
      expect(getPasswordStrength('').score).toBe(0);
      expect(getPasswordStrength('MyStr0ng@Pass!').score).toBe(4);
    });
  });
});
