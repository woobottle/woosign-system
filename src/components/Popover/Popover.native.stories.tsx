import type {Meta, StoryObj} from '@storybook/react-native';
import {Popover} from './Popover.native';
import {Text} from '../Text/Text.native';
const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  args: {
    label: '주문 상세',
    trigger: '상세 보기',
    children: <Text>아메리카노 2잔 · 총 8,000원</Text>,
  },
};
export default meta;
type Story = StoryObj<typeof Popover>;
export const Default: Story = {};
export const Disabled: Story = {args: {disabled: true}};
