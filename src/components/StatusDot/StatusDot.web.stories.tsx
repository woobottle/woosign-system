import type {Meta, StoryObj} from '@storybook/react';
import React from 'react';
import {StatusDot} from './StatusDot';

const meta: Meta<typeof StatusDot> = {
  title: 'Components/StatusDot',
  component: StatusDot,
  args: {tone: 'success', size: 'default', children: '✓'},
  argTypes: {
    tone: {control: 'select', options: ['success', 'danger', 'brand', 'neutral']},
    size: {control: 'select', options: ['sm', 'default', 'lg']},
  },
};
export default meta;
type Story = StoryObj<typeof StatusDot>;

export const Default: Story = {};

export const AllTones: Story = {
  render: () => (
    <div style={{display: 'flex', gap: 12}}>
      <StatusDot tone="success">✓</StatusDot>
      <StatusDot tone="danger">!</StatusDot>
      <StatusDot tone="brand">★</StatusDot>
      <StatusDot tone="neutral">·</StatusDot>
    </div>
  ),
};
