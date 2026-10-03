import type {Meta, StoryObj} from '@storybook/react';
import {EmptyState} from './EmptyState.web';
import {Button} from '../Button/Button.web';
const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    title: '아직 항목이 없습니다',
    description: '첫 항목을 추가해보세요',
    action: <Button onPress={() => {}}>추가하기</Button>,
  },
};
export default meta;
type Story = StoryObj<typeof EmptyState>;
export const Default: Story = {};
