import type {Preview} from '@storybook/react';
import React from 'react';
import {ThemeProvider} from '../src/core/theme/ThemeContext';
import {useResolvedColors} from '../src/core/hooks';

function StoryFrame({children}: {children: React.ReactNode}) {
  const colors = useResolvedColors();
  return (
    <div
      style={{
        padding: 24,
        alignSelf: 'flex-start',
        display: 'block',
        backgroundColor: colors.background,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
      {children}
    </div>
  );
}

const preview: Preview = {
  globalTypes: {
    colorScheme: {
      description: 'Light / dark theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: [
          {value: 'light', title: 'Light'},
          {value: 'dark', title: 'Dark'},
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const scheme = context.globals.colorScheme as 'light' | 'dark';
      return (
        <ThemeProvider key={scheme} defaultColorScheme={scheme}>
          <StoryFrame>
            <Story />
          </StoryFrame>
        </ThemeProvider>
      );
    },
  ],
  parameters: {
    actions: {argTypesRegex: '^on[A-Z].*'},
    controls: {
      matchers: {color: /(background|color)$/i, date: /Date$/i},
    },
    backgrounds: {
      default: 'canvas',
      values: [
        {name: 'canvas', value: '#F4EFE6'},
        {name: 'section', value: '#EAE4D8'},
        {name: 'white', value: '#FFFFFF'},
        {name: 'inverse', value: '#171513'},
      ],
    },
  },
};

export default preview;
