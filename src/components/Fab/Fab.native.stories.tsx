import type {Meta, StoryObj} from '@storybook/react-native';
import React from 'react';
import {Text} from 'react-native';
import {Fab} from './Fab';
import {Box} from '../Box';
import type {FabTone} from './types';

const meta: Meta<typeof Fab> = {
  title: 'Components/Fab',
  component: Fab,
  tags: ['autodocs'],
  argTypes: {
    tone: {control: 'select', options: ['ember', 'ink', 'gold']},
    size: {control: 'select', options: ['default', 'lg']},
  },
  args: {tone: 'ember', size: 'default', accessibilityLabel: 'Add'},
};
export default meta;
type Story = StoryObj<typeof Fab>;

export const Default: Story = {
  render: args => (
    <Fab {...args}>
      <Text style={{color: '#FFFFFF', fontSize: 24}}>＋</Text>
    </Fab>
  ),
};

export const AllTones: Story = {
  render: () => {
    const tones: FabTone[] = ['ember', 'ink', 'gold'];
    return (
      <Box flexDirection="row" gap={16}>
        {tones.map(tone => (
          <Fab key={tone} tone={tone} accessibilityLabel={`Add (${tone})`}>
            <Text style={{color: '#FFFFFF', fontSize: 24}}>＋</Text>
          </Fab>
        ))}
      </Box>
    );
  },
};
