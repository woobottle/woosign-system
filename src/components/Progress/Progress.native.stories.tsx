import type {Meta, StoryObj} from '@storybook/react-native';
import React from 'react';
import {Progress} from './Progress';
import {Box} from '../Box';

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
  argTypes: {
    value: {control: {type: 'range', min: 0, max: 1, step: 0.05}},
    tone: {control: 'select', options: ['gold', 'ember', 'ink']},
    surface: {control: 'select', options: ['light', 'inverse']},
    size: {control: 'select', options: ['sm', 'default', 'lg']},
  },
  args: {value: 0.5, tone: 'gold', surface: 'light', size: 'default'},
};
export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  render: args => (
    <Box width={320}>
      <Progress {...args} />
    </Box>
  ),
};

export const OnInverse: Story = {
  args: {value: 0.75, surface: 'inverse'},
  render: args => (
    <Box backgroundColor="#171513" padding={24} borderRadius="md" width={320}>
      <Progress {...args} />
    </Box>
  ),
};
