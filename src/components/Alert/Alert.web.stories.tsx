import type {Meta, StoryObj} from '@storybook/react';
import {Alert} from './Alert.web';
const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: {
    title: '저장되었습니다',
    children: '변경 내용이 반영되었습니다.',
    onClose: () => {},
  },
};
export default meta;
type Story = StoryObj<typeof Alert>;
export const Default: Story = {};
export const Danger: Story = {
  args: {tone: 'danger', title: '문제가 발생했습니다'},
};
export const Success: Story = {args: {tone: 'success'}};
