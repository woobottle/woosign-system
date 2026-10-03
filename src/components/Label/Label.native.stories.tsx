import type {Meta, StoryObj} from '@storybook/react-native';
import {Label} from './Label.native';
const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  tags: ['autodocs'],
  args: {children: '이메일', required: true},
};
export default meta;
type Story = StoryObj<typeof Label>;
export const Default: Story = {};
export const Disabled: Story = {args: {disabled: true}};
