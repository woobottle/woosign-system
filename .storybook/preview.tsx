import type { Preview } from '@storybook/react';
import React from 'react';
import { ThemeProvider } from '../src/core/theme/ThemeContext';

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div
          style={{
            padding: 24,
            // Keep content to its natural size — prevents Storybook's root
            // flex container from stretching children to fill the viewport.
            alignSelf: 'flex-start',
            display: 'block',
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'canvas',
      values: [
        { name: 'canvas', value: '#F4EFE6' },
        { name: 'section', value: '#EAE4D8' },
        { name: 'white', value: '#FFFFFF' },
        { name: 'inverse', value: '#171513' },
      ],
    },
  },
};

export default preview;
