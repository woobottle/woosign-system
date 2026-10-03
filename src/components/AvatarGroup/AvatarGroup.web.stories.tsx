import type {Meta, StoryObj} from '@storybook/react';
import {AvatarGroup} from './AvatarGroup.web';
const meta: Meta<typeof AvatarGroup> = {
  title: 'Components/AvatarGroup',
  component: AvatarGroup,
  tags: ['autodocs'],
  args: {
    items: [
      {name: 'Logan Woo'},
      {name: 'Paper Ink'},
      {name: 'Morning Coffee'},
      {name: 'Green Tea'},
    ],
    max: 3,
  },
};
export default meta;
type Story = StoryObj<typeof AvatarGroup>;
export const Default: Story = {};
