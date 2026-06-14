import type {Meta, StoryObj} from '@storybook/react-native';
import React from 'react';
import {StatusDot} from './StatusDot';
import {Box} from '../Box';

const meta: Meta<typeof StatusDot> = {
  title: 'Components/StatusDot',
  component: StatusDot,
  tags: ['autodocs'],
  argTypes: {
    tone: {control: 'select', options: ['success', 'danger', 'brand', 'neutral']},
    size: {control: 'select', options: ['sm', 'default', 'lg']},
  },
  args: {tone: 'success', children: '✓'},
};
export default meta;
type Story = StoryObj<typeof StatusDot>;

export const Default: Story = {
  args: {tone: 'success', children: '✓'},
};

export const AllTones: Story = {
  render: () => (
    <Box flexDirection="row" gap={12}>
      <StatusDot tone="success">✓</StatusDot>
      <StatusDot tone="danger">!</StatusDot>
      <StatusDot tone="brand">★</StatusDot>
      <StatusDot tone="neutral">·</StatusDot>
    </Box>
  ),
};
