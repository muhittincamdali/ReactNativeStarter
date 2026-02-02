// Metro bundler configuration
// https://docs.expo.dev/guides/customizing-metro/

const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for additional file extensions
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  'mjs',
  'cjs',
];

// Asset extensions for bundling
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'lottie',
  'db',
  'sql',
];

// Enable package exports for modern npm packages
config.resolver.unstable_enablePackageExports = true;

// Symlink support for monorepo setups
config.resolver.unstable_enableSymlinks = true;

// Watch folders for monorepo or linked packages
config.watchFolders = [
  path.resolve(__dirname, 'src'),
];

// Transformer configuration
config.transformer = {
  ...config.transformer,
  // Enable inline requires for better startup performance
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
      nonInlinedRequires: [
        'React',
        'react',
        'react-native',
        'react/jsx-dev-runtime',
        'react/jsx-runtime',
      ],
    },
  }),
  // Minifier configuration
  minifierConfig: {
    compress: {
      drop_console: false,
      reduce_funcs: false,
    },
    mangle: {
      keep_classnames: true,
      keep_fnames: true,
    },
    output: {
      ascii_only: true,
      quote_style: 3,
      wrap_iife: true,
    },
  },
};

// Serializer options
config.serializer = {
  ...config.serializer,
  // Tree shaking support
  experimentalSerializerHook: (graph, delta) => {
    return delta;
  },
};

module.exports = config;
