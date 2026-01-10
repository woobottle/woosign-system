/**
 * Text component stories
 * shadcn/ui Typography showcase
 */

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Text } from './Text.web';
import type { TextVariant, TextWeight } from './types';

const meta: Meta<typeof Text> = {
  title: 'Components/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'p', 'lead', 'large', 'small', 'muted'],
      description: 'Typography variant',
      table: {
        defaultValue: { summary: 'p' },
      },
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold'],
      description: 'Font weight override',
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Text alignment',
    },
    muted: {
      control: 'boolean',
      description: 'Apply muted color',
    },
    color: {
      control: 'color',
      description: 'Custom text color',
    },
  },
  args: {
    children: 'The quick brown fox jumps over the lazy dog.',
    variant: 'p',
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

// Default
export const Default: Story = {
  args: {
    children: 'The quick brown fox jumps over the lazy dog.',
  },
};

// All Variants
export const AllVariants: Story = {
  render: () => {
    const variants: TextVariant[] = [
      'h1',
      'h2',
      'h3',
      'h4',
      'p',
      'lead',
      'large',
      'small',
      'muted',
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {variants.map((variant) => (
          <div key={variant}>
            <Text variant="small" muted style={{ marginBottom: 4, display: 'block' }}>
              {variant}
            </Text>
            <Text variant={variant}>
              {variant === 'h1' && 'Heading 1'}
              {variant === 'h2' && 'Heading 2'}
              {variant === 'h3' && 'Heading 3'}
              {variant === 'h4' && 'Heading 4'}
              {variant === 'p' && 'This is a paragraph. The quick brown fox jumps over the lazy dog.'}
              {variant === 'lead' && 'A lead paragraph stands out from the rest.'}
              {variant === 'large' && 'Large text for emphasis.'}
              {variant === 'small' && 'Small text for fine print.'}
              {variant === 'muted' && 'Muted text for secondary information.'}
            </Text>
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'All typography variants inspired by shadcn/ui',
      },
    },
  },
};

// Headings
export const Headings: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Text variant="h1">Heading 1</Text>
      <Text variant="h2">Heading 2</Text>
      <Text variant="h3">Heading 3</Text>
      <Text variant="h4">Heading 4</Text>
    </div>
  ),
};

// Font Weights
export const FontWeights: Story = {
  render: () => {
    const weights: TextWeight[] = ['normal', 'medium', 'semibold', 'bold'];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {weights.map((weight) => (
          <Text key={weight} weight={weight}>
            {weight.charAt(0).toUpperCase() + weight.slice(1)} weight text
          </Text>
        ))}
      </div>
    );
  },
};

// Text Alignment
export const TextAlignment: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 400 }}>
      <Text align="left" style={{ backgroundColor: '#f1f5f9', padding: 8 }}>
        Left aligned text
      </Text>
      <Text align="center" style={{ backgroundColor: '#f1f5f9', padding: 8 }}>
        Center aligned text
      </Text>
      <Text align="right" style={{ backgroundColor: '#f1f5f9', padding: 8 }}>
        Right aligned text
      </Text>
    </div>
  ),
};

// Muted Text
export const MutedText: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Text>Normal text color</Text>
      <Text muted>Muted text for secondary information</Text>
      <Text variant="muted">Using muted variant</Text>
    </div>
  ),
};

// Custom Colors
export const CustomColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Text color="#EF4444">Red text (destructive)</Text>
      <Text color="#22C55E">Green text (success)</Text>
      <Text color="#3B82F6">Blue text (info)</Text>
      <Text color="#F59E0B">Orange text (warning)</Text>
    </div>
  ),
};

// Semantic Elements
export const SemanticElements: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Text as="h1" variant="h1">
        This is an h1 element
      </Text>
      <Text as="p" variant="p">
        This is a p element with paragraph styling.
      </Text>
      <Text as="span" variant="small">
        This is a span element with small styling.
      </Text>
      <Text as="label" variant="small" weight="medium">
        This is a label element
      </Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Use the `as` prop to render semantic HTML elements',
      },
    },
  },
};

// Typography Example
export const TypographyExample: Story = {
  render: () => (
    <div style={{ maxWidth: 600 }}>
      <Text variant="h1" style={{ marginBottom: 16 }}>
        The Joke Tax Chronicles
      </Text>
      <Text variant="lead" style={{ marginBottom: 24 }}>
        Once upon a time, in a far-off land, there was a very lazy king who spent
        all day lounging on his throne.
      </Text>
      <Text variant="h2" style={{ marginBottom: 12, marginTop: 24 }}>
        The King&apos;s Plan
      </Text>
      <Text style={{ marginBottom: 16 }}>
        The king thought long and hard about how to increase his revenue without
        having to do any actual work. Finally, he came up with a brilliant plan.
      </Text>
      <Text variant="h3" style={{ marginBottom: 12, marginTop: 20 }}>
        The Joke Tax
      </Text>
      <Text style={{ marginBottom: 16 }}>
        &quot;I will tax the jokes,&quot; the king declared. &quot;After all, everyone loves a
        good joke, so they will happily pay for the privilege of telling one.&quot;
      </Text>
      <Text variant="muted" style={{ marginTop: 24 }}>
        Note: This is a fictional story for demonstration purposes.
      </Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A complete typography example showing various text styles in context',
      },
    },
  },
};
