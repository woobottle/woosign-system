/**
 * Button component stories
 * shadcn/ui inspired design showcase
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';  
import { Button } from './Button';
import { Box } from '../Box';
import { Text } from '../Text';
import type { ButtonVariant, ButtonSize } from './types';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'The visual style variant of the button',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'The size of the button',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    loading: {
      control: 'boolean',
      description: 'Whether to show loading spinner',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the button takes full width',
    },
    onPress: {
      action: 'pressed',
      description: 'Called when the button is pressed',
    },
  },
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default',
    disabled: false,
    loading: false,
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Default story
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

// All Variants
export const AllVariants: Story = {
  render: () => {
    const variants: ButtonVariant[] = [
      'default',
      'destructive',
      'outline',
      'secondary',
      'ghost',
      'link',
    ];

    return (
      <Box flexDirection="row" flexWrap="wrap" gap={16}>
        {variants.map((variant) => (
          <Button key={variant} variant={variant}>
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </Button>
        ))}
      </Box>
    );
  },
};

// All Sizes
export const AllSizes: Story = {
  render: () => {
    const sizes: ButtonSize[] = ['sm', 'default', 'lg'];

    return (
      <Box flexDirection="row" alignItems="center" gap={16}>
        {sizes.map((size) => (
          <Button key={size} size={size}>
            {size.toUpperCase()}
          </Button>
        ))}
      </Box>
    );
  },
};

// Destructive
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
};

// Outline
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

// Secondary
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

// Ghost
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

// Link
export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
};

// Loading State
export const Loading: Story = {
  args: {
    loading: true,
    children: 'Please wait',
  },
};

// Loading Variants
export const LoadingVariants: Story = {
  render: () => (
    <Box flexDirection="row" gap={16}>
      <Button loading>Default</Button>
      <Button loading variant="destructive">
        Destructive
      </Button>
      <Button loading variant="outline">
        Outline
      </Button>
      <Button loading variant="secondary">
        Secondary
      </Button>
    </Box>
  ),
};

// Disabled
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};

// Disabled Variants
export const DisabledVariants: Story = {
  render: () => (
    <Box flexDirection="row" gap={16}>
      <Button disabled>Default</Button>
      <Button disabled variant="destructive">
        Destructive
      </Button>
      <Button disabled variant="outline">
        Outline
      </Button>
      <Button disabled variant="secondary">
        Secondary
      </Button>
    </Box>
  ),
};

// Full Width
export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Full Width Button',
  },
};

// Common Patterns
export const CommonPatterns: Story = {
  render: () => (
    <Box flexDirection="column" gap={24}>
      <Box>
        <Text variant="h4" style={{ marginBottom: 12 }}>Action Buttons</Text>
        <Box flexDirection="row" gap={12}>
          <Button variant="outline">Cancel</Button>
          <Button>Continue</Button>
        </Box>
      </Box>
      <Box>
        <Text variant="h4" style={{ marginBottom: 12 }}>Destructive Action</Text>
        <Box flexDirection="row" gap={12}>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Delete</Button>
        </Box>
      </Box>
    </Box>
  ),
};
