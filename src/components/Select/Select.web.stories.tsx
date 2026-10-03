import type {Meta, StoryObj} from '@storybook/react';
import {Select} from './Select';
const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    label: '음료',
    options: [
      {value: 'coffee', label: '커피'},
      {value: 'tea', label: '차'},
      {value: 'soldout', label: '품절', disabled: true},
    ],
  },
};
export default meta;
type Story = StoryObj<typeof Select>;
export const Default: Story = {};
export const Disabled: Story = {args: {disabled: true}};
export const Error: Story = {args: {variant: 'error'}};
export const Small: Story = {args: {size: 'sm'}};
export const Large: Story = {args: {size: 'lg'}};
