import type {Meta, StoryObj} from '@storybook/react';
import React from 'react';
import {Divider} from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Components/Divider',
  component: Divider,
  args: {tone: 'default', orientation: 'horizontal'},
  argTypes: {
    tone: {control: 'select', options: ['default', 'inverse']},
    orientation: {control: 'select', options: ['horizontal', 'vertical']},
  },
};
export default meta;
type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {
  render: args => (
    <div style={{width: 320}}>
      <Divider {...args} />
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{display: 'flex', gap: 12, height: 24}}>
      <span>Menu</span>
      <Divider orientation="vertical" />
      <span>Rewards</span>
      <Divider orientation="vertical" />
      <span>Account</span>
    </div>
  ),
};

export const Inverse: Story = {
  render: () => (
    <div
      style={{
        background: '#171513',
        color: '#FFFFFF',
        padding: 24,
        width: 320,
      }}>
      <Divider tone="inverse" />
    </div>
  ),
};
