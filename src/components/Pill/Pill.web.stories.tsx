import type {Meta, StoryObj} from '@storybook/react';
import React, {useState} from 'react';
import {Pill} from './Pill';

const meta: Meta<typeof Pill> = {
  title: 'Components/Pill',
  component: Pill,
  args: {children: 'All', active: false, disabled: false},
};
export default meta;
type Story = StoryObj<typeof Pill>;

export const Default: Story = {};
export const Active: Story = {args: {active: true}};

export const CategoryFilter: Story = {
  render: () => {
    const categories = ['All', 'Hot drinks', 'Cold drinks', 'Food'];
    const [selected, setSelected] = useState('All');
    return (
      <div style={{display: 'flex', gap: 8}}>
        {categories.map(c => (
          <Pill key={c} active={selected === c} onPress={() => setSelected(c)}>
            {c}
          </Pill>
        ))}
      </div>
    );
  },
};
