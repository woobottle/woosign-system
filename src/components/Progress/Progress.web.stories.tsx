import type {Meta, StoryObj} from '@storybook/react';
import React from 'react';
import {Progress} from './Progress';

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  args: {value: 0.5, tone: 'gold', surface: 'light', size: 'default'},
  argTypes: {
    tone: {control: 'select', options: ['gold', 'ember', 'ink']},
    surface: {control: 'select', options: ['light', 'inverse']},
    size: {control: 'select', options: ['sm', 'default', 'lg']},
    value: {control: {type: 'range', min: 0, max: 1, step: 0.01}},
  },
};
export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  render: args => (
    <div style={{width: 360}}>
      <Progress {...args} />
    </div>
  ),
};

export const OnInverse: Story = {
  render: () => (
    <div
      style={{
        background: '#171513',
        padding: 24,
        borderRadius: 16,
        width: 360,
      }}>
      <Progress value={0.75} tone="gold" surface="inverse" />
    </div>
  ),
};
