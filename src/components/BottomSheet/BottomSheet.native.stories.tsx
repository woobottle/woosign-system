import type {Meta, StoryObj} from '@storybook/react-native';
import React, {useState} from 'react';
import {Text} from 'react-native';
import {BottomSheet} from './BottomSheet';
import {Button} from '../Button';

const meta: Meta<typeof BottomSheet> = {
  title: 'Components/BottomSheet',
  component: BottomSheet,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof BottomSheet>;

function SheetDemo({
  dragToClose,
  closeOnScrimClick,
}: {
  dragToClose?: boolean;
  closeOnScrimClick?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onPress={() => setOpen(true)}>BottomSheet 열기</Button>
      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        dragToClose={dragToClose}
        closeOnScrimClick={closeOnScrimClick}>
        <BottomSheet.Header>
          <BottomSheet.Title>옵션 선택</BottomSheet.Title>
          <BottomSheet.Description>하나를 골라주세요.</BottomSheet.Description>
        </BottomSheet.Header>
        <BottomSheet.Body>
          <Text>본문 콘텐츠</Text>
        </BottomSheet.Body>
        <BottomSheet.Footer>
          <Button variant="secondary" onPress={() => setOpen(false)}>
            닫기
          </Button>
          <Button onPress={() => setOpen(false)}>확인</Button>
        </BottomSheet.Footer>
      </BottomSheet>
    </>
  );
}

export const Default: Story = {render: () => <SheetDemo />};
export const NoDrag: Story = {render: () => <SheetDemo dragToClose={false} />};
export const NoScrimClose: Story = {
  render: () => <SheetDemo closeOnScrimClick={false} />,
};
