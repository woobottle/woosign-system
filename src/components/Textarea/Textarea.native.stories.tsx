import type {Meta, StoryObj} from '@storybook/react-native';
import {Textarea} from './Textarea';
const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: {placeholder: '메모를 입력하세요', fullWidth: true},
};
export default meta;
type Story = StoryObj<typeof Textarea>;
export const Default: Story = {};
export const Disabled: Story = {args: {disabled: true}};
export const Error: Story = {args: {variant: 'error'}};
export const Small: Story = {args: {size: 'sm'}};
export const Large: Story = {args: {size: 'lg'}};
