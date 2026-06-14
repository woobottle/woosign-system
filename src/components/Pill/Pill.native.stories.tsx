import type {Meta, StoryObj} from '@storybook/react-native';
import React, {useState} from 'react';
import {Pill} from './Pill';
import {Box} from '../Box';

const meta: Meta<typeof Pill> = {
  title: 'Components/Pill',
  component: Pill,
  tags: ['autodocs'],
  argTypes: {
    active: {control: 'boolean'},
    disabled: {control: 'boolean'},
  },
  args: {active: false, children: 'All'},
};
export default meta;
type Story = StoryObj<typeof Pill>;

export const Default: Story = {
  args: {children: 'All'},
};

export const Active: Story = {
  args: {active: true, children: 'Coffee'},
};

const CATEGORIES = ['All', 'Coffee', 'Tea', 'Bakery'];

const CategoryFilterDemo = () => {
  const [selected, setSelected] = useState('All');
  return (
    <Box flexDirection="row" flexWrap="wrap" gap={8}>
      {CATEGORIES.map(category => (
        <Pill
          key={category}
          active={selected === category}
          onPress={() => setSelected(category)}>
          {category}
        </Pill>
      ))}
    </Box>
  );
};

export const CategoryFilter: Story = {
  render: () => <CategoryFilterDemo />,
};
