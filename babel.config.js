// Babel configuration for Expo + React Native Reanimated
// Order matters: reanimated plugin must be last

module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'react' }],
    ],
    plugins: [
      // Path aliases for clean imports
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@/components': './src/components',
            '@/core': './src/core',
            '@/hooks': './src/hooks',
            '@/stores': './src/stores',
            '@/utils': './src/utils',
            '@/types': './src/types',
          },
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
      ],
      // Expo Router requires this
      'expo-router/babel',
      // Reanimated MUST be last
      'react-native-reanimated/plugin',
    ],
    env: {
      production: {
        plugins: ['transform-remove-console'],
      },
      test: {
        plugins: ['@babel/plugin-transform-runtime'],
      },
    },
  };
};
