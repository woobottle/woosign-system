import type {Meta, StoryObj} from '@storybook/react';
import {Calendar} from './Calendar.web';
const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  args: {defaultMonth: '2026-10-01', defaultValue: '2026-10-10'},
};
export default meta;
type Story = StoryObj<typeof Calendar>;
export const Default: Story = {};
export const Disabled: Story = {args: {disabled: true}};
export const Bounded: Story = {
  args: {
    min: '2026-10-05',
    max: '2026-10-20',
    isDateDisabled: date => date.endsWith('-10'),
  },
};
