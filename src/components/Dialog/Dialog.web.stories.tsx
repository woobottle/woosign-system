import React, {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {Dialog} from './Dialog';
import {Button} from '../Button';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {layout: 'centered'},
};
export default meta;

type Story = StoryObj<typeof Dialog>;

function DialogDemo({size}: {size?: 'sm' | 'md' | 'lg'}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onPress={() => setOpen(true)}>Dialog 열기</Button>
      <Dialog open={open} onClose={() => setOpen(false)} size={size}>
        <Dialog.Header>
          <Dialog.Title>주문을 취소할까요?</Dialog.Title>
          <Dialog.Description>이 작업은 되돌릴 수 없어요.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          취소하면 결제도 함께 환불 처리됩니다. 계속하시겠어요?
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="secondary" onPress={() => setOpen(false)}>
            닫기
          </Button>
          <Button variant="destructive" onPress={() => setOpen(false)}>
            취소하기
          </Button>
        </Dialog.Footer>
      </Dialog>
    </>
  );
}

export const Default: Story = {render: () => <DialogDemo />};
export const Small: Story = {render: () => <DialogDemo size="sm" />};
export const Large: Story = {render: () => <DialogDemo size="lg" />};
