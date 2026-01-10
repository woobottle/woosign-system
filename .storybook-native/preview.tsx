import type { Preview } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';
import { ThemeProvider } from '../src/core/theme/ThemeContext';

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ flex: 1, padding: 24 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
