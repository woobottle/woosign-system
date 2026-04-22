import type {Meta, StoryObj} from '@storybook/react';
import {Eyebrow} from './Eyebrow';

const meta: Meta<typeof Eyebrow> = {
  title: 'Components/Eyebrow',
  component: Eyebrow,
  args: {tone: 'default', children: 'This week'},
  argTypes: {
    tone: {
      control: 'select',
      options: ['default', 'brand', 'gold', 'inverse'],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Eyebrow>;

export const Default: Story = {};
export const Brand: Story = {args: {tone: 'brand'}};
export const Gold: Story = {args: {tone: 'gold'}};
