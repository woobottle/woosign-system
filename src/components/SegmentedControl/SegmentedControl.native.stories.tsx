import type {Meta, StoryObj} from '@storybook/react-native';
import {SegmentedControl} from './SegmentedControl.native';
const meta: Meta<typeof SegmentedControl> = {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  args: {
    label: '기간',
    items: [
      {value: 'day', label: '일'},
      {value: 'week', label: '주'},
      {value: 'month', label: '월'},
    ],
  },
};
export default meta;
type Story = StoryObj<typeof SegmentedControl>;
export const Default: Story = {};
export const Disabled: Story = {args: {disabled: true}};
