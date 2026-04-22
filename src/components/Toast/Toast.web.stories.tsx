import type {Meta, StoryObj} from '@storybook/react';
import React from 'react';
import {Toast} from './Toast';

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  args: {
    tone: 'success',
    title: 'Order placed',
    description: 'Ready in 5 min at Hongdae.',
  },
  argTypes: {
    tone: {control: 'select', options: ['success', 'danger', 'brand', 'neutral']},
  },
};
export default meta;
type Story = StoryObj<typeof Toast>;

export const Success: Story = {};

export const Danger: Story = {
  args: {
    tone: 'danger',
    title: 'Payment declined',
    description: 'Try a different card.',
  },
};

export const Stack: Story = {
  render: () => (
    <div style={{display: 'flex', flexDirection: 'column', gap: 10, width: 360}}>
      <Toast tone="success" title="Order placed" description="Ready in 5 min." />
      <Toast
        tone="danger"
        title="Payment declined"
        description="Try a different card."
      />
      <Toast tone="brand" title="Star earned" description="+15 toward your next drink." />
    </div>
  ),
};
