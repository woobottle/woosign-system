import type {Meta, StoryObj} from '@storybook/react-native';
import React from 'react';
import {Toast} from './Toast';
import {Box} from '../Box';

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
  argTypes: {
    tone: {control: 'select', options: ['success', 'danger', 'brand', 'neutral']},
    hideIcon: {control: 'boolean'},
  },
  args: {tone: 'success', title: 'Order placed'},
};
export default meta;
type Story = StoryObj<typeof Toast>;

export const Success: Story = {
  args: {
    tone: 'success',
    title: 'Order placed',
    description: 'Ready in 5 min at Hongdae.',
  },
};

export const Danger: Story = {
  args: {
    tone: 'danger',
    title: 'Payment declined',
    description: 'Try a different card.',
  },
};

export const Stack: Story = {
  render: () => (
    <Box flexDirection="column" gap={12}>
      <Toast tone="success" title="Order placed" description="Ready in 5 min." />
      <Toast tone="danger" title="Payment declined" description="Try another card." />
      <Toast tone="brand" title="Stars earned" description="+12 stars added." />
    </Box>
  ),
};
