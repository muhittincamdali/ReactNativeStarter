// Two projects: the app runs under the iOS preset of jest-expo (React Native mocks), the API
// routes and the server code under Node, where Request, Response and Web Crypto are built in.
// watchPlugins and passWithNoTests are root-only options in a multi-project configuration.
const {
  watchPlugins,
  passWithNoTests: _rootOnly,
  ...expoPreset
} = require('jest-expo/ios/jest-preset');

const aliases = { '^@/(.*)$': '<rootDir>/src/$1' };

module.exports = {
  watchPlugins,
  projects: [
    {
      ...expoPreset,
      displayName: 'app',
      clearMocks: true,
      testMatch: [
        '<rootDir>/__tests__/app/**/*.test.ts?(x)',
        '<rootDir>/Examples/**/*.test.ts?(x)',
      ],
      moduleNameMapper: { ...expoPreset.moduleNameMapper, ...aliases },
      setupFilesAfterEnv: ['<rootDir>/__tests__/app/setup.tsx'],
    },
    {
      displayName: 'server',
      clearMocks: true,
      testEnvironment: 'node',
      testMatch: [
        '<rootDir>/__tests__/server/**/*.test.ts',
        '<rootDir>/__tests__/shared/**/*.test.ts',
      ],
      moduleNameMapper: aliases,
    },
  ],
};
