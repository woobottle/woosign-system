import type {Meta, StoryObj} from '@storybook/react';
import React from 'react';
import {Fab} from './Fab';

const PlusIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const meta: Meta<typeof Fab> = {
  title: 'Components/Fab',
  component: Fab,
  args: {tone: 'ember', size: 'default', disabled: false, accessibilityLabel: 'Add'},
  argTypes: {
    tone: {control: 'select', options: ['ember', 'ink', 'gold']},
    size: {control: 'select', options: ['default', 'lg']},
  },
};
export default meta;
type Story = StoryObj<typeof Fab>;

export const Default: Story = {
  render: args => (
    <Fab {...args}>
      <PlusIcon />
    </Fab>
  ),
};

export const AllTones: Story = {
  render: () => (
    <div style={{display: 'flex', gap: 16}}>
      <Fab tone="ember" accessibilityLabel="Ember">
        <PlusIcon />
      </Fab>
      <Fab tone="ink" accessibilityLabel="Ink">
        <PlusIcon />
      </Fab>
      <Fab tone="gold" accessibilityLabel="Gold">
        <PlusIcon />
      </Fab>
    </div>
  ),
};
