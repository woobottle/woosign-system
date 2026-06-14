import type {Meta, StoryObj} from '@storybook/react-native';
import React, {useState} from 'react';
import {Tabs} from './Tabs';
import {Box} from '../Box';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Tabs>;

const ITEMS = [
  {key: 'menu', label: 'Menu'},
  {key: 'orders', label: 'Previous orders'},
  {key: 'favorites', label: 'Favorites'},
  {key: 'featured', label: 'Featured'},
];

const DefaultDemo = () => {
  const [active, setActive] = useState('menu');
  return <Tabs items={ITEMS} value={active} onChange={setActive} />;
};

export const Default: Story = {
  render: () => <DefaultDemo />,
};

const InverseDemo = () => {
  const [active, setActive] = useState('menu');
  return (
    <Box backgroundColor="#171513" padding={24} borderRadius="md">
      <Tabs items={ITEMS} value={active} onChange={setActive} inverse />
    </Box>
  );
};

export const Inverse: Story = {
  render: () => <InverseDemo />,
};
