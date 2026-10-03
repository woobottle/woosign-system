import type {Meta, StoryObj} from '@storybook/react-native';
import {DropdownMenu} from './DropdownMenu.native';
const meta: Meta<typeof DropdownMenu> = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  args: {
    label: '작업 메뉴',
    trigger: '작업',
    items: [
      {value: 'edit', label: '편집', onSelect: () => {}},
      {value: 'copy', label: '복사', onSelect: () => {}},
      {value: 'delete', label: '삭제', destructive: true, disabled: true},
    ],
  },
};
export default meta;
type Story = StoryObj<typeof DropdownMenu>;
export const Default: Story = {};
export const Disabled: Story = {args: {disabled: true}};
