import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: [
    '../node_modules/@woosign/ui/src/components/**/*.native.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [],
};

export default main;
