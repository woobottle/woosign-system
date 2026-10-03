import type {Meta, StoryObj} from '@storybook/react-native';
import {Tooltip} from './Tooltip.native';
const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: {
    id: 'help-demo',
    trigger: '도움말',
    content: '이 버튼에서 도움말을 확인할 수 있습니다.',
  },
};
export default meta;
type Story = StoryObj<typeof Tooltip>;
export const Default: Story = {};
export const Disabled: Story = {args: {disabled: true}};
