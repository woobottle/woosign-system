/**
 * Badge component stories
 * shadcn/ui inspired design showcase
 */

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Badge } from './Badge';
import { Box } from '../Box';
import { Text } from '../Text';
import type { BadgeVariant } from './types';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: 'The visual style variant of the badge',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
  },
  args: {
    children: 'Badge',
    variant: 'default',
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

// Default story
export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

// All Variants
export const AllVariants: Story = {
  render: () => {
    const variants: BadgeVariant[] = [
      'default',
      'secondary',
      'destructive',
      'outline',
    ];

    return (
      <Box flexDirection="row" flexWrap="wrap" gap={8}>
        {variants.map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </Badge>
        ))}
      </Box>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'All available badge variants inspired by shadcn/ui',
      },
    },
  },
};

// Secondary
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

// Destructive
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};

// Outline
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

// Status Examples
export const StatusExamples: Story = {
  render: () => (
    <Box flexDirection="column" gap={16}>
      <Box>
        <Text variant="h4" style={{ marginBottom: 8 }}>Status Indicators</Text>
        <Box flexDirection="row" gap={8}>
          <Badge>Active</Badge>
          <Badge variant="secondary">Pending</Badge>
          <Badge variant="destructive">Error</Badge>
          <Badge variant="outline">Draft</Badge>
        </Box>
      </Box>
      <Box>
        <Text variant="h4" style={{ marginBottom: 8 }}>Notification Counts</Text>
        <Box flexDirection="row" gap={8}>
          <Badge>3</Badge>
          <Badge variant="destructive">99+</Badge>
        </Box>
      </Box>
      <Box>
        <Text variant="h4" style={{ marginBottom: 8 }}>Labels</Text>
        <Box flexDirection="row" gap={8}>
          <Badge variant="outline">v1.0.0</Badge>
          <Badge variant="secondary">Beta</Badge>
          <Badge>New</Badge>
        </Box>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common use cases for badges: status indicators, notification counts, and labels',
      },
    },
  },
};
