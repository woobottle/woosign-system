const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  transformer: {
    unstable_allowRequireContext: true,
  },
  resolver: {
    unstable_enablePackageExports: true,
  },
};

module.exports = withStorybook(mergeConfig(defaultConfig, config), {
  enabled: true,
  configPath: './.storybook-native',
});
