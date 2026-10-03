import type {Meta, StoryObj} from '@storybook/react-native';
import {Spinner} from './Spinner.native';
const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  args: {label: '불러오는 중'},
};
export default meta;
type Story = StoryObj<typeof Spinner>;
export const Default: Story = {};
