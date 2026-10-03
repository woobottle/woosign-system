import type {Meta, StoryObj} from '@storybook/react';
import {Spinner} from './Spinner.web';
const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  args: {label: '불러오는 중'},
};
export default meta;
type Story = StoryObj<typeof Spinner>;
export const Default: Story = {};
