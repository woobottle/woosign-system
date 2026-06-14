import type {Meta, StoryObj} from '@storybook/react-native';
import React from 'react';
import {Divider} from './Divider';
import {Box} from '../Box';
import {Text} from '../Text';

const meta: Meta<typeof Divider> = {
  title: 'Components/Divider',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    tone: {control: 'select', options: ['default', 'inverse']},
    orientation: {control: 'select', options: ['horizontal', 'vertical']},
  },
};
export default meta;
type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {
  render: () => (
    <Box width={320} gap={12}>
      <Text>위 콘텐츠</Text>
      <Divider />
      <Text>아래 콘텐츠</Text>
    </Box>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Box flexDirection="row" alignItems="center" gap={12} height={24}>
      <Text>메뉴</Text>
      <Divider orientation="vertical" />
      <Text>주문</Text>
      <Divider orientation="vertical" />
      <Text>즐겨찾기</Text>
    </Box>
  ),
};

export const Inverse: Story = {
  render: () => (
    <Box backgroundColor="#171513" padding={24} borderRadius="md" gap={12}>
      <Text color="#FFFFFF">위 콘텐츠</Text>
      <Divider tone="inverse" />
      <Text color="#FFFFFF">아래 콘텐츠</Text>
    </Box>
  ),
};
