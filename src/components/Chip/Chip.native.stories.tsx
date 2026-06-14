import type {Meta, StoryObj} from '@storybook/react-native';
import React from 'react';
import {Chip} from './Chip';
import {Box} from '../Box';
import type {ChipTone} from './types';

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    tone: {control: 'select', options: ['default', 'solid', 'outline']},
    disabled: {control: 'boolean'},
  },
  args: {tone: 'default', children: 'Chip'},
};
export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  args: {children: 'Default'},
};

export const AllTones: Story = {
  render: () => {
    const tones: ChipTone[] = ['default', 'solid', 'outline'];
    return (
      <Box flexDirection="row" flexWrap="wrap" gap={8}>
        {tones.map(tone => (
          <Chip key={tone} tone={tone}>
            {tone.charAt(0).toUpperCase() + tone.slice(1)}
          </Chip>
        ))}
      </Box>
    );
  },
};

export const Disabled: Story = {
  args: {disabled: true, children: 'Disabled'},
};
