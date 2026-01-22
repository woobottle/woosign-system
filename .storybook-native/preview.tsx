import type { Preview } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../src/core/theme/ThemeContext';

const preview: Preview = {
  decorators: [
    (Story: React.ComponentType) => (
      <GestureHandlerRootView style={{ flex: 1, height: '100%' }}>
        <SafeAreaProvider>
          <ThemeProvider>
            <View style={{ flex: 1, padding: 24, backgroundColor: '#f0f0f0', height: '100%' }}>
              <Story />
            </View>
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
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
