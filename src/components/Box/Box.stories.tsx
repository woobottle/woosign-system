/**
 * Box component stories
 * Layout container showcase
 */

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Box } from './Box.web';
import { Text } from '../Text/Text.web';
import { colors } from '../../core/theme/tokens';

const meta: Meta<typeof Box> = {
  title: 'Components/Box',
  component: Box,
  tags: ['autodocs'],
  argTypes: {
    padding: { control: 'number' },
    margin: { control: 'number' },
    gap: { control: 'number' },
    flexDirection: {
      control: 'select',
      options: ['row', 'column', 'row-reverse', 'column-reverse'],
    },
    alignItems: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'],
    },
    justifyContent: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'],
    },
    backgroundColor: { control: 'color' },
    borderRadius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Box>;

// Helper component for demo boxes
const DemoBox = ({
  children,
  color = colors.primary,
}: {
  children?: React.ReactNode;
  color?: string;
}) => (
  <Box
    padding={16}
    backgroundColor={color}
    borderRadius="md"
    alignItems="center"
    justifyContent="center"
  >
    <Text color={colors.primaryForeground} weight="medium">
      {children || 'Box'}
    </Text>
  </Box>
);

// Default
export const Default: Story = {
  args: {
    padding: 24,
    backgroundColor: colors.secondary,
    borderRadius: 'md',
    children: <Text>This is a Box component</Text>,
  },
};

// Flex Row
export const FlexRow: Story = {
  render: () => (
    <Box flexDirection="row" gap={16}>
      <DemoBox>1</DemoBox>
      <DemoBox>2</DemoBox>
      <DemoBox>3</DemoBox>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Horizontal layout with gap between items',
      },
    },
  },
};

// Flex Column
export const FlexColumn: Story = {
  render: () => (
    <Box flexDirection="column" gap={16}>
      <DemoBox>1</DemoBox>
      <DemoBox>2</DemoBox>
      <DemoBox>3</DemoBox>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Vertical layout with gap between items',
      },
    },
  },
};

// Alignment
export const Alignment: Story = {
  render: () => (
    <Box flexDirection="column" gap={24}>
      <Box>
        <Text variant="small" muted style={{ marginBottom: 8 }}>
          alignItems: flex-start
        </Text>
        <Box
          flexDirection="row"
          alignItems="flex-start"
          gap={8}
          padding={16}
          backgroundColor={colors.secondary}
          height={100}
        >
          <DemoBox>A</DemoBox>
          <DemoBox>B</DemoBox>
        </Box>
      </Box>

      <Box>
        <Text variant="small" muted style={{ marginBottom: 8 }}>
          alignItems: center
        </Text>
        <Box
          flexDirection="row"
          alignItems="center"
          gap={8}
          padding={16}
          backgroundColor={colors.secondary}
          height={100}
        >
          <DemoBox>A</DemoBox>
          <DemoBox>B</DemoBox>
        </Box>
      </Box>

      <Box>
        <Text variant="small" muted style={{ marginBottom: 8 }}>
          alignItems: flex-end
        </Text>
        <Box
          flexDirection="row"
          alignItems="flex-end"
          gap={8}
          padding={16}
          backgroundColor={colors.secondary}
          height={100}
        >
          <DemoBox>A</DemoBox>
          <DemoBox>B</DemoBox>
        </Box>
      </Box>
    </Box>
  ),
};

// Justify Content
export const JustifyContent: Story = {
  render: () => (
    <Box flexDirection="column" gap={24}>
      {(['flex-start', 'center', 'flex-end', 'space-between', 'space-around'] as const).map(
        (justify) => (
          <Box key={justify}>
            <Text variant="small" muted style={{ marginBottom: 8 }}>
              justifyContent: {justify}
            </Text>
            <Box
              flexDirection="row"
              justifyContent={justify}
              padding={16}
              backgroundColor={colors.secondary}
            >
              <DemoBox>A</DemoBox>
              <DemoBox>B</DemoBox>
              <DemoBox>C</DemoBox>
            </Box>
          </Box>
        )
      )}
    </Box>
  ),
};

// Padding & Margin
export const PaddingAndMargin: Story = {
  render: () => (
    <Box flexDirection="column" gap={24}>
      <Box>
        <Text variant="small" muted style={{ marginBottom: 8 }}>
          padding: 32
        </Text>
        <Box padding={32} backgroundColor={colors.secondary} borderRadius="md">
          <Box backgroundColor={colors.primary} padding={16} borderRadius="sm">
            <Text color={colors.primaryForeground}>Content</Text>
          </Box>
        </Box>
      </Box>

      <Box>
        <Text variant="small" muted style={{ marginBottom: 8 }}>
          paddingX: 48, paddingY: 16
        </Text>
        <Box paddingX={48} paddingY={16} backgroundColor={colors.secondary} borderRadius="md">
          <Box backgroundColor={colors.primary} padding={16} borderRadius="sm">
            <Text color={colors.primaryForeground}>Content</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  ),
};

// Border Radius
export const BorderRadius: Story = {
  render: () => (
    <Box flexDirection="row" flexWrap="wrap" gap={16}>
      {(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full'] as const).map((radius) => (
        <Box key={radius} alignItems="center" gap={8}>
          <Box
            width={80}
            height={80}
            backgroundColor={colors.primary}
            borderRadius={radius}
            alignItems="center"
            justifyContent="center"
          >
            <Text color={colors.primaryForeground} variant="small">
              {radius}
            </Text>
          </Box>
        </Box>
      ))}
    </Box>
  ),
};

// Borders
export const Borders: Story = {
  render: () => (
    <Box flexDirection="row" gap={16}>
      <Box
        padding={24}
        borderWidth={1}
        borderColor={colors.border}
        borderRadius="md"
      >
        <Text>1px border</Text>
      </Box>
      <Box
        padding={24}
        borderWidth={2}
        borderColor={colors.primary}
        borderRadius="md"
      >
        <Text>2px primary border</Text>
      </Box>
      <Box
        padding={24}
        borderWidth={2}
        borderColor={colors.destructive}
        borderRadius="lg"
      >
        <Text>2px destructive border</Text>
      </Box>
    </Box>
  ),
};

// Nested Boxes
export const NestedBoxes: Story = {
  render: () => (
    <Box
      padding={24}
      backgroundColor={colors.secondary}
      borderRadius="lg"
      gap={16}
    >
      <Text variant="h4">Card Title</Text>
      <Text muted>This is a card description with nested content.</Text>

      <Box flexDirection="row" gap={12} marginTop={8}>
        <Box
          flex={1}
          padding={16}
          backgroundColor={colors.background}
          borderRadius="md"
          borderWidth={1}
          borderColor={colors.border}
        >
          <Text variant="small" weight="medium">
            Item 1
          </Text>
          <Text variant="muted">Description</Text>
        </Box>
        <Box
          flex={1}
          padding={16}
          backgroundColor={colors.background}
          borderRadius="md"
          borderWidth={1}
          borderColor={colors.border}
        >
          <Text variant="small" weight="medium">
            Item 2
          </Text>
          <Text variant="muted">Description</Text>
        </Box>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complex nested layout example',
      },
    },
  },
};

// Full Width & Height
export const Sizing: Story = {
  render: () => (
    <Box flexDirection="column" gap={24}>
      <Box>
        <Text variant="small" muted style={{ marginBottom: 8 }}>
          Fixed size: 200x100
        </Text>
        <Box
          width={200}
          height={100}
          backgroundColor={colors.primary}
          borderRadius="md"
          alignItems="center"
          justifyContent="center"
        >
          <Text color={colors.primaryForeground}>200 x 100</Text>
        </Box>
      </Box>

      <Box>
        <Text variant="small" muted style={{ marginBottom: 8 }}>
          width: 100%
        </Text>
        <Box
          width="100%"
          height={60}
          backgroundColor={colors.secondary}
          borderRadius="md"
          alignItems="center"
          justifyContent="center"
        >
          <Text>Full width</Text>
        </Box>
      </Box>

      <Box>
        <Text variant="small" muted style={{ marginBottom: 8 }}>
          minHeight: 120, maxWidth: 300
        </Text>
        <Box
          minHeight={120}
          maxWidth={300}
          padding={24}
          backgroundColor={colors.secondary}
          borderRadius="md"
        >
          <Text>Content with min height and max width constraints</Text>
        </Box>
      </Box>
    </Box>
  ),
};

// Semantic Elements
export const SemanticElements: Story = {
  render: () => (
    <Box as="article" padding={24} backgroundColor={colors.secondary} borderRadius="lg">
      <Box as="header" marginBottom={16}>
        <Text variant="h3">Article Header</Text>
      </Box>
      <Box as="main">
        <Text>Main content of the article goes here.</Text>
      </Box>
      <Box as="footer" marginTop={16}>
        <Text variant="muted">Footer information</Text>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Use the `as` prop to render semantic HTML elements',
      },
    },
  },
};
