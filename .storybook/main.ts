import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.web.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    // Web extension resolution for cross-platform components
    config.resolve = config.resolve || {};
    config.resolve.extensions = [
      '.web.tsx',
      '.web.ts',
      '.tsx',
      '.ts',
      '.web.jsx',
      '.web.js',
      '.jsx',
      '.js',
      '.json',
    ];

    // Force React 18 for web Storybook
    config.resolve.alias = {
      ...config.resolve.alias,
      'react': path.resolve(__dirname, '../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../node_modules/react-dom'),
    };

    return config;
  },
};

export default config;
