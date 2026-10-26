// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettier = require('eslint-config-prettier');

module.exports = defineConfig([
  expoConfig,
  prettier,
  {
    ignores: [
      'dist/**',
      'docs/api/**',
      '.expo/**',
      'ios/**',
      'android/**',
      'coverage/**',
      '_work/**',
      '.maestro/output/**',
    ],
  },
  {
    rules: {
      // Nothing in the app or the API writes to the console: a log line is where tokens, passwords
      // and request bodies leak, so the starter has none to inherit.
      'no-console': 'error',
      eqeqeq: ['error', 'always'],
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    rules: { 'no-console': 'off' },
  },
  {
    // jest.mock() factories run before imports, so they load modules with require().
    files: ['__tests__/**', 'Examples/**/*.test.tsx'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
]);
