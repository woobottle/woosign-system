import type {Meta, StoryObj} from '@storybook/react';
import {Breadcrumb} from './Breadcrumb.web';
const meta: Meta<typeof Breadcrumb> = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  args: {
    items: [
      {label: '홈', onPress: () => {}},
      {label: '주문', onPress: () => {}},
      {label: '주문 상세'},
    ],
  },
};
export default meta;
type Story = StoryObj<typeof Breadcrumb>;
export const Default: Story = {};
