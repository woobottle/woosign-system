import type {Meta, StoryObj} from '@storybook/react-native';
import React, {useState} from 'react';
import {Text} from 'react-native';
import {Dialog} from './Dialog';
import {Button} from '../Button';
import type {DialogSize} from './types';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Dialog>;

function DialogDemo({size}: {size?: DialogSize}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onPress={() => setOpen(true)}>Dialog 열기</Button>
      <Dialog open={open} onClose={() => setOpen(false)} size={size}>
        <Dialog.Header>
          <Dialog.Title>주문을 취소할까요?</Dialog.Title>
          <Dialog.Description>이 작업은 되돌릴 수 없습니다.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <Text>취소하면 적립된 스타가 사라집니다.</Text>
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="secondary" onPress={() => setOpen(false)}>
            유지
          </Button>
          <Button onPress={() => setOpen(false)}>취소하기</Button>
        </Dialog.Footer>
      </Dialog>
    </>
  );
}

export const Default: Story = {render: () => <DialogDemo />};
export const Small: Story = {render: () => <DialogDemo size="sm" />};
export const Large: Story = {render: () => <DialogDemo size="lg" />};
