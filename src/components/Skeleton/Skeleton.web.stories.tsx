import type {Meta, StoryObj} from '@storybook/react';
import {Skeleton} from './Skeleton.web';
const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  args: {width: 240, height: 24},
};
export default meta;
type Story = StoryObj<typeof Skeleton>;
export const Default: Story = {};
