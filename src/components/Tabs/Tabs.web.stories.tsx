import type {Meta, StoryObj} from '@storybook/react';
import React, {useState} from 'react';
import {Tabs} from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
};
export default meta;
type Story = StoryObj<typeof Tabs>;

const ITEMS = [
  {key: 'menu', label: 'Menu'},
  {key: 'orders', label: 'Previous orders'},
  {key: 'favorites', label: 'Favorites'},
  {key: 'featured', label: 'Featured'},
];

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState('menu');
    return (
      <div style={{width: 480}}>
        <Tabs items={ITEMS} value={active} onChange={setActive} />
      </div>
    );
  },
};

export const Inverse: Story = {
  render: () => {
    const [active, setActive] = useState('menu');
    return (
      <div
        style={{
          background: '#171513',
          color: '#FFFFFF',
          padding: 24,
          borderRadius: 16,
          width: 480,
        }}>
        <Tabs items={ITEMS} value={active} onChange={setActive} inverse />
      </div>
    );
  },
};
