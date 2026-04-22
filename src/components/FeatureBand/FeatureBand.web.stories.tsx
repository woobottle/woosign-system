import type {Meta, StoryObj} from '@storybook/react';
import React from 'react';
import {FeatureBand} from './FeatureBand';
import {Eyebrow} from '../Eyebrow';
import {Button} from '../Button';
import {Progress} from '../Progress';

const meta: Meta<typeof FeatureBand> = {
  title: 'Components/FeatureBand',
  component: FeatureBand,
  args: {tone: 'inverse', rounded: true},
  argTypes: {
    tone: {control: 'select', options: ['inverse', 'ember', 'reward']},
  },
};
export default meta;
type Story = StoryObj<typeof FeatureBand>;

export const Members: Story = {
  render: args => (
    <FeatureBand {...args} style={{maxWidth: 520}}>
      <Eyebrow tone="gold">Members</Eyebrow>
      <div
        style={{
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: '-0.16px',
          marginTop: 8,
        }}>
        Warmer mornings, on us.
      </div>
      <div
        style={{
          fontSize: 14,
          color: 'rgba(255,255,255,0.70)',
          marginTop: 8,
          maxWidth: 440,
        }}>
        Earn stars on every order. Unlock your next drink before the week is
        out.
      </div>
      <div style={{marginTop: 16, maxWidth: 320}}>
        <Progress value={0.5} tone="gold" surface="inverse" />
      </div>
      <div style={{display: 'flex', gap: 10, marginTop: 16}}>
        <Button>Join rewards</Button>
        <Button variant="inverse">See benefits</Button>
      </div>
    </FeatureBand>
  ),
};

export const Ember: Story = {
  args: {tone: 'ember'},
  render: args => (
    <FeatureBand {...args} style={{maxWidth: 520}}>
      <Eyebrow tone="gold">Today only</Eyebrow>
      <div style={{fontSize: 28, fontWeight: 600, marginTop: 8}}>
        Double stars on breakfast.
      </div>
    </FeatureBand>
  ),
};
