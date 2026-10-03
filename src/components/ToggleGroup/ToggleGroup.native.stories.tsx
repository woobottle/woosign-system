import type {Meta, StoryObj} from '@storybook/react-native';
import {ToggleGroup} from './ToggleGroup.native';
const meta: Meta<typeof ToggleGroup> = {
  title: 'Components/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  args: {
    label: '필터',
    multiple: true,
    items: [
      {value: 'coffee', label: '커피'},
      {value: 'tea', label: '차'},
      {value: 'juice', label: '주스'},
    ],
  },
};
export default meta;
type Story = StoryObj<typeof ToggleGroup>;
export const Default: Story = {};
export const Disabled: Story = {args: {disabled: true}};
