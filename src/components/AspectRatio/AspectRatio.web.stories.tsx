import type {Meta, StoryObj} from '@storybook/react';
import {AspectRatio} from './AspectRatio.web';
import {Text} from '../Text/Text.web';
const meta: Meta<typeof AspectRatio> = {
  title: 'Components/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
  args: {
    ratio: 16 / 9,
    children: <Text>16:9 콘텐츠</Text>,
    style: {backgroundColor: '#EAE4D8'},
  },
};
export default meta;
type Story = StoryObj<typeof AspectRatio>;
export const Default: Story = {};
