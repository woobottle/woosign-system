import type {Meta, StoryObj} from '@storybook/react-native';
import {Toggle} from './Toggle.native';
const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  args: {label: '즐겨찾기'},
};
export default meta;
type Story = StoryObj<typeof Toggle>;
export const Default: Story = {};
export const Disabled: Story = {args: {disabled: true}};
