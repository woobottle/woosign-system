import type {Meta, StoryObj} from '@storybook/react';
import React from 'react';
import {Chip} from './Chip';

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  args: {children: 'Chip', tone: 'default'},
  argTypes: {
    tone: {control: 'select', options: ['default', 'solid', 'outline']},
  },
};
export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {};
export const Solid: Story = {args: {tone: 'solid'}};
export const Outline: Story = {args: {tone: 'outline'}};

export const AllTones: Story = {
  render: () => (
    <div style={{display: 'flex', gap: 8}}>
      <Chip>Default</Chip>
      <Chip tone="solid">Solid</Chip>
      <Chip tone="outline">Outline</Chip>
    </div>
  ),
};
