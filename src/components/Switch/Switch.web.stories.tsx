/**
 * Switch component stories (Web)
 * shadcn/ui inspired design showcase
 */

import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Switch } from './Switch';
import { Box } from '../Box';
import { Text } from '../Text';
import type { SwitchSize } from './types';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
      description: 'The size of the switch',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    checked: {
      control: 'boolean',
      description: 'Whether the switch is on',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the switch is disabled',
    },
    label: {
      control: 'text',
      description: 'Label text next to the switch',
    },
  },
  args: {
    checked: false,
    size: 'default',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

// Default story
export const Default: Story = {
  args: {
    label: 'Airplane Mode',
  },
};

// Controlled example
export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Switch
        checked={checked}
        onCheckedChange={setChecked}
        label="Airplane Mode"
      />
    );
  },
};

// Checked
export const Checked: Story = {
  args: {
    checked: true,
    label: 'Enabled',
  },
};

// All Sizes
export const AllSizes: Story = {
  render: () => {
    const sizes: SwitchSize[] = ['sm', 'default', 'lg'];

    return (
      <Box flexDirection="column" gap={16}>
        {sizes.map((size) => (
          <Switch key={size} size={size} checked label={size.toUpperCase()} />
        ))}
      </Box>
    );
  },
};

// Disabled
export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled',
  },
};

// Disabled Checked
export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
    label: 'Disabled (On)',
  },
};

// Without Label
export const WithoutLabel: Story = {
  args: {
    checked: true,
  },
};

// Common Patterns
export const CommonPatterns: Story = {
  render: () => {
    const [notifications, setNotifications] = useState(true);
    const [marketing, setMarketing] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    return (
      <Box flexDirection="column" gap={24}>
        <Box>
          <Text variant="h4" style={{ marginBottom: 12 }}>Settings</Text>
          <Box flexDirection="column" gap={16}>
            <Box flexDirection="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Text variant="p" style={{ fontWeight: '500' }}>Push Notifications</Text>
                <Text variant="muted">Receive push notifications on your device</Text>
              </Box>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </Box>
            <Box flexDirection="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Text variant="p" style={{ fontWeight: '500' }}>Marketing Emails</Text>
                <Text variant="muted">Receive marketing emails from us</Text>
              </Box>
              <Switch
                checked={marketing}
                onCheckedChange={setMarketing}
              />
            </Box>
            <Box flexDirection="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Text variant="p" style={{ fontWeight: '500' }}>Dark Mode</Text>
                <Text variant="muted">Toggle dark theme</Text>
              </Box>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    );
  },
};
