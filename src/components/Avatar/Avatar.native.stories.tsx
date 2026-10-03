import type {Meta, StoryObj} from '@storybook/react-native';
import {Avatar} from './Avatar.native';
const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: {name: 'Logan Woo', size: 48},
};
export default meta;
type Story = StoryObj<typeof Avatar>;
export const Default: Story = {};
export const Image: Story = {
  args: {
    src: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 48 48%22%3E%3Crect width=%2248%22 height=%2248%22 fill=%22%23D35B1F%22/%3E%3C/svg%3E',
  },
};
