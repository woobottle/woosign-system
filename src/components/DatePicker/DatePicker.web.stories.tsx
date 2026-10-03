import type {Meta, StoryObj} from '@storybook/react';
import {DatePicker} from './DatePicker.web';
const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  args: {label: '방문 날짜', defaultValue: '2026-10-10'},
};
export default meta;
type Story = StoryObj<typeof DatePicker>;
export const Default: Story = {};
export const Disabled: Story = {args: {disabled: true}};
