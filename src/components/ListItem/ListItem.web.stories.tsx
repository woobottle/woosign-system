import type {Meta, StoryObj} from '@storybook/react';
import {ListItem} from './ListItem.web';
const meta: Meta<typeof ListItem> = {
  title: 'Components/ListItem',
  component: ListItem,
  tags: ['autodocs'],
  args: {
    title: '오늘의 주문',
    description: '커피 2잔 · 준비 중',
    onPress: () => {},
  },
};
export default meta;
type Story = StoryObj<typeof ListItem>;
export const Default: Story = {};
export const Disabled: Story = {args: {disabled: true}};
