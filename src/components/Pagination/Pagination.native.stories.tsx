import type {Meta, StoryObj} from '@storybook/react-native';
import {Pagination} from './Pagination.native';
const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: {totalPages: 20, defaultPage: 5},
};
export default meta;
type Story = StoryObj<typeof Pagination>;
export const Default: Story = {};
