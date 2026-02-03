/**
 * Formatters Tests
 */

import {
  formatRelativeTime,
  formatDate,
  formatTime,
  formatCompactNumber,
  formatCurrency,
  formatPercentage,
  formatFileSize,
  formatPhoneNumber,
  truncateText,
  capitalize,
  titleCase,
} from '../../src/utils/formatters';

describe('Formatters', () => {
  describe('formatRelativeTime', () => {
    it('formats recent time correctly', () => {
      const now = new Date();
      expect(formatRelativeTime(now)).toBe('just now');
      
      const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
      expect(formatRelativeTime(oneMinuteAgo)).toBe('1m ago');
      
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      expect(formatRelativeTime(oneHourAgo)).toBe('1h ago');
      
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      expect(formatRelativeTime(oneDayAgo)).toBe('1d ago');
    });
  });

  describe('formatCompactNumber', () => {
    it('formats numbers correctly', () => {
      expect(formatCompactNumber(0)).toBe('0');
      expect(formatCompactNumber(999)).toBe('999');
      expect(formatCompactNumber(1000)).toBe('1K');
      expect(formatCompactNumber(1500)).toBe('1.5K');
      expect(formatCompactNumber(1000000)).toBe('1M');
      expect(formatCompactNumber(1500000)).toBe('1.5M');
      expect(formatCompactNumber(1000000000)).toBe('1B');
    });
  });

  describe('formatCurrency', () => {
    it('formats currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(1000, 'EUR', 'de-DE')).toContain('1.000');
    });
  });

  describe('formatPercentage', () => {
    it('formats percentages correctly', () => {
      expect(formatPercentage(50)).toBe('50%');
      expect(formatPercentage(33.333, 2)).toBe('33.33%');
    });
  });

  describe('formatFileSize', () => {
    it('formats file sizes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });
  });

  describe('formatPhoneNumber', () => {
    it('formats phone numbers correctly', () => {
      expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
      expect(formatPhoneNumber('123')).toBe('123');
    });
  });

  describe('truncateText', () => {
    it('truncates text correctly', () => {
      expect(truncateText('Hello World', 5)).toBe('He...');
      expect(truncateText('Hi', 10)).toBe('Hi');
      expect(truncateText('Hello World', 8, '…')).toBe('Hello W…');
    });
  });

  describe('capitalize', () => {
    it('capitalizes correctly', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('HELLO')).toBe('Hello');
      expect(capitalize('')).toBe('');
    });
  });

  describe('titleCase', () => {
    it('converts to title case correctly', () => {
      expect(titleCase('hello world')).toBe('Hello World');
      expect(titleCase('HELLO WORLD')).toBe('Hello World');
    });
  });
});
