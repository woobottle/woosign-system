import type {Meta, StoryObj} from '@storybook/react';
import {Collapsible} from './Collapsible.web';
const meta: Meta<typeof Collapsible> = {
  title: 'Components/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  args: {
    id: 'details-demo',
    title: '상세 정보',
    children: 'Paper & Ink 디자인 시스템의 상세 정보입니다.',
  },
};
export default meta;
type Story = StoryObj<typeof Collapsible>;
export const Default: Story = {};
export const Disabled: Story = {args: {disabled: true}};
