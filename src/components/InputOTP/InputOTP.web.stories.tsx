import type {Meta, StoryObj} from '@storybook/react';
import {InputOTP} from './InputOTP.web';
const meta: Meta<typeof InputOTP> = {
  title: 'Components/InputOTP',
  component: InputOTP,
  tags: ['autodocs'],
  args: {length: 6, label: '인증 코드'},
};
export default meta;
type Story = StoryObj<typeof InputOTP>;
export const Default: Story = {};
export const Disabled: Story = {args: {disabled: true}};
export const Error: Story = {args: {error: true}};
