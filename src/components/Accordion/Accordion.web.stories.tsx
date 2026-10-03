import type {Meta, StoryObj} from '@storybook/react';
import {Accordion} from './Accordion.web';
const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  args: {
    id: 'faq-demo',
    items: [
      {
        value: 'shipping',
        title: '배송은 얼마나 걸리나요?',
        content: '보통 2~3일 소요됩니다.',
      },
      {
        value: 'return',
        title: '반품이 가능한가요?',
        content: '수령 후 7일 이내 가능합니다.',
      },
    ],
  },
};
export default meta;
type Story = StoryObj<typeof Accordion>;
export const Default: Story = {};
export const Disabled: Story = {args: {disabled: true}};
export const Multiple: Story = {
  args: {multiple: true, defaultValue: ['shipping', 'return']},
};
