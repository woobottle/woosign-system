import type {Meta, StoryObj} from '@storybook/react-native';
import React from 'react';
import {Text} from 'react-native';
import {FeatureBand} from './FeatureBand';
import {Eyebrow} from '../Eyebrow';
import {Button} from '../Button';
import {Progress} from '../Progress';
import {Box} from '../Box';

const meta: Meta<typeof FeatureBand> = {
  title: 'Components/FeatureBand',
  component: FeatureBand,
  tags: ['autodocs'],
  argTypes: {
    tone: {control: 'select', options: ['inverse', 'ember', 'reward', 'forest']},
    rounded: {control: 'boolean'},
  },
  args: {tone: 'inverse', rounded: true},
};
export default meta;
type Story = StoryObj<typeof FeatureBand>;

export const Members: Story = {
  render: args => (
    <FeatureBand {...args}>
      <Eyebrow tone="gold">Members</Eyebrow>
      <Text style={{fontSize: 28, fontWeight: '600', color: '#FFFFFF', marginTop: 8}}>
        Warmer mornings, on us.
      </Text>
      <Text style={{fontSize: 14, color: 'rgba(255,255,255,0.70)', marginTop: 8}}>
        Earn stars on every order. Unlock your next drink before the week is out.
      </Text>
      <Box marginTop={16}>
        <Progress value={0.5} tone="gold" surface="inverse" />
      </Box>
      <Box flexDirection="row" gap={10} marginTop={16}>
        <Button>Join rewards</Button>
        <Button variant="inverse">See benefits</Button>
      </Box>
    </FeatureBand>
  ),
};

export const Ember: Story = {
  args: {tone: 'ember'},
  render: args => (
    <FeatureBand {...args}>
      <Eyebrow tone="gold">Today only</Eyebrow>
      <Text style={{fontSize: 28, fontWeight: '600', color: '#FFFFFF', marginTop: 8}}>
        Double stars on breakfast.
      </Text>
    </FeatureBand>
  ),
};
