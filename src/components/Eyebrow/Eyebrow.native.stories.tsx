import type {Meta, StoryObj} from '@storybook/react-native';
import React from 'react';
import {Eyebrow} from './Eyebrow';
import {Box} from '../Box';
import type {EyebrowTone} from './types';

const meta: Meta<typeof Eyebrow> = {
  title: 'Components/Eyebrow',
  component: Eyebrow,
  tags: ['autodocs'],
  argTypes: {
    tone: {control: 'select', options: ['default', 'brand', 'gold', 'inverse']},
  },
  args: {tone: 'default', children: 'This week'},
};
export default meta;
type Story = StoryObj<typeof Eyebrow>;

export const Default: Story = {
  args: {children: 'This week'},
};

export const AllTones: Story = {
  render: () => {
    const tones: EyebrowTone[] = ['default', 'brand', 'gold', 'inverse'];
    return (
      <Box backgroundColor="#171513" padding={24} borderRadius="md" gap={12}>
        {tones.map(tone => (
          <Eyebrow key={tone} tone={tone}>
            {tone.toUpperCase()}
          </Eyebrow>
        ))}
      </Box>
    );
  },
};
