const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // Prioritize .native.tsx/.native.ts extensions for React Native
    sourceExts: ['native.tsx', 'native.ts', 'tsx', 'ts', 'jsx', 'js', 'json'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
