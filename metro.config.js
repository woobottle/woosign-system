const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  transformer: {
    unstable_allowRequireContext: true,
  },
};

module.exports = mergeConfig(defaultConfig, config);
