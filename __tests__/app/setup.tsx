// Shared setup of the app tests: in-memory replacements for the native storage modules and a
// fixed device language, so results do not depend on the machine running the tests.

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('expo-secure-store', () => {
  const values = new Map<string, string>();
  return {
    AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY: 1,
    getItemAsync: jest.fn(async (key: string) => values.get(key) ?? null),
    setItemAsync: jest.fn(async (key: string, value: string) => {
      values.set(key, value);
    }),
    deleteItemAsync: jest.fn(async (key: string) => {
      values.delete(key);
    }),
    __values: values,
  };
});

jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageCode: 'en', languageTag: 'en-US' }],
}));

// The icon fonts are native assets; in tests an icon renders as an empty view with its name.
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  const Icon = ({ name }: { name: string }) => <View testID={`icon-${name}`} />;
  return { Ionicons: Icon };
});
