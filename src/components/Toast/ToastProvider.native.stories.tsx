import type {Meta, StoryObj} from '@storybook/react-native';
import React from 'react';
import {ToastProvider} from './ToastProvider';
import {useToast} from './useToast';
import {Button} from '../Button';
import {Box} from '../Box';

const meta: Meta<typeof ToastProvider> = {
  title: 'Components/ToastProvider',
  component: ToastProvider,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ToastProvider>;

function Demo() {
  const toast = useToast();
  return (
    <Box flexDirection="column" gap={12} width={280}>
      <Button onPress={() => toast.success({title: '저장됐어요'})}>
        success
      </Button>
      <Button
        variant="destructive"
        onPress={() =>
          toast.error({
            title: '결제 실패',
            description: '잠시 후 다시 시도해 주세요.',
          })
        }>
        error
      </Button>
      <Button
        onPress={() =>
          toast.brand({title: '스타 적립!', description: '+12 stars'})
        }>
        brand
      </Button>
      <Button
        onPress={() =>
          toast.show({tone: 'neutral', title: '계속 표시', duration: 0})
        }>
        show (duration 0)
      </Button>
      <Button variant="secondary" onPress={() => toast.dismiss()}>
        dismiss all
      </Button>
    </Box>
  );
}

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <Demo />
    </ToastProvider>
  ),
};

export const TopPosition: Story = {
  render: () => (
    <ToastProvider position="top">
      <Demo />
    </ToastProvider>
  ),
};
