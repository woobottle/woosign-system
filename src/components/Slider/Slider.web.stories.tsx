import type {Meta, StoryObj} from '@storybook/react';
import {Slider} from './Slider.web';
const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
  args: {label: '볼륨', defaultValue: 40, style: {width: 280}},
};
export default meta;
type Story = StoryObj<typeof Slider>;
export const Default: Story = {};
export const Disabled: Story = {args: {disabled: true}};
