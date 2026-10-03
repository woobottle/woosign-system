import type {Meta, StoryObj} from '@storybook/react-native';
import {Combobox} from './Combobox.native';
const meta: Meta<typeof Combobox> = {
  title: 'Components/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  args: {
    id: 'drink-search-demo',
    label: '음료',
    options: [
      {value: 'coffee', label: '커피'},
      {value: 'tea', label: '차'},
      {value: 'juice', label: '주스', disabled: true},
    ],
    style: {width: 280},
  },
};
export default meta;
type Story = StoryObj<typeof Combobox>;
export const Default: Story = {};
export const Disabled: Story = {args: {disabled: true}};
export const Error: Story = {args: {error: true}};
