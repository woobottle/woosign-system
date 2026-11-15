import type {Meta, StoryObj} from '@storybook/react';
import {Stepper} from './Stepper.web';
const meta: Meta<typeof Stepper> = {
  title: 'Components/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  args: {
    label: '주문 단계',
    defaultValue: 'address',
    steps: [
      {value: 'cart', label: '장바구니'},
      {value: 'address', label: '배송지', description: '받는 분 정보'},
      {value: 'pay', label: '결제'},
    ],
  },
};
export default meta;
type Story = StoryObj<typeof Stepper>;
export const Default: Story = {};
export const Vertical: Story = {args: {orientation: 'vertical'}};
export const Navigable: Story = {args: {navigable: true, defaultValue: 'pay'}};
