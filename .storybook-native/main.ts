import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: ['../src/**/*.native.stories.@(ts|tsx)'],
  addons: [],
};

export default main;
