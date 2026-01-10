/**
 * Button component stories
 * shadcn/ui inspired design showcase
 */

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Button } from './Button.web';
import type { ButtonVariant, ButtonSize } from './types';

// Icons for demo
const ChevronRightIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const MailIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

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
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {variants.map((variant) => (
          <Button key={variant} variant={variant}>
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </Button>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'All available button variants inspired by shadcn/ui',
      },
    },
  },
};

// All Sizes
export const AllSizes: Story = {
  render: () => {
    const sizes: ButtonSize[] = ['sm', 'default', 'lg', 'icon'];

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {sizes.map((size) => (
          <Button key={size} size={size}>
            {size === 'icon' ? <MailIcon /> : size.toUpperCase()}
          </Button>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Button sizes: sm, default, lg, and icon',
      },
    },
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

// With Left Icon
export const WithLeftIcon: Story = {
  args: {
    leftIcon: <MailIcon />,
    children: 'Login with Email',
  },
};

// With Right Icon
export const WithRightIcon: Story = {
  args: {
    rightIcon: <ChevronRightIcon />,
    children: 'Next',
  },
};

// With Both Icons
export const WithBothIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Button leftIcon={<MailIcon />} rightIcon={<ChevronRightIcon />}>
        Send Email
      </Button>
      <Button variant="outline" leftIcon={<MailIcon />}>
        Contact Us
      </Button>
    </div>
  ),
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
    <div style={{ display: 'flex', gap: 16 }}>
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
    </div>
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
    <div style={{ display: 'flex', gap: 16 }}>
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
    </div>
  ),
};

// Full Width
export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Full Width Button',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
};

// Icon Button
export const IconButton: Story = {
  args: {
    size: 'icon',
    children: <MailIcon />,
  },
};

// Icon Button Variants
export const IconButtonVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button size="icon">
        <MailIcon />
      </Button>
      <Button size="icon" variant="outline">
        <MailIcon />
      </Button>
      <Button size="icon" variant="secondary">
        <MailIcon />
      </Button>
      <Button size="icon" variant="ghost">
        <MailIcon />
      </Button>
    </div>
  ),
};

// Interactive Demo
export const Interactive: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h3 style={{ marginBottom: 12, color: '#0F172A' }}>
            Interactive States
          </h3>
          <p style={{ marginBottom: 16, color: '#64748B' }}>
            Try hovering, focusing (Tab), and clicking the buttons.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button>Hover me</Button>
            <Button variant="outline">Focus me (Tab)</Button>
            <Button variant="secondary">Press me</Button>
          </div>
        </div>
        <div>
          <h3 style={{ marginBottom: 12, color: '#0F172A' }}>
            Common Patterns
          </h3>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="outline">Cancel</Button>
            <Button>Continue</Button>
          </div>
        </div>
      </div>
    );
  },
};
