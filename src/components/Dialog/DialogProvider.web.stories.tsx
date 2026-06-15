import type {Meta, StoryObj} from '@storybook/react';
import React, {useState} from 'react';
import {DialogProvider} from './DialogProvider';
import {useDialog} from './useDialog';
import {Button} from '../Button';
import {Box} from '../Box';
import {Text} from '../Text';

const meta: Meta<typeof DialogProvider> = {
  title: 'Components/DialogProvider',
  component: DialogProvider,
  parameters: {layout: 'centered'},
};
export default meta;

type Story = StoryObj<typeof DialogProvider>;

function Demo() {
  const dialog = useDialog();
  const [result, setResult] = useState('—');
  return (
    <Box
      style={{display: 'flex', flexDirection: 'column', gap: 12, width: 280}}>
      <Button
        onPress={async () => {
          const ok = await dialog.confirm({
            title: '주문을 취소할까요?',
            description: '이 작업은 되돌릴 수 없어요.',
          });
          setResult(`confirm → ${ok}`);
        }}>
        confirm 열기
      </Button>
      <Button
        variant="destructive"
        onPress={async () => {
          const ok = await dialog.confirm({
            title: '계정을 삭제할까요?',
            description: '모든 데이터가 사라집니다.',
            tone: 'destructive',
            confirmText: '삭제',
          });
          setResult(`destructive confirm → ${ok}`);
        }}>
        destructive confirm
      </Button>
      <Button
        variant="secondary"
        onPress={async () => {
          await dialog.alert({title: '저장됐어요'});
          setResult('alert 닫힘');
        }}>
        alert 열기
      </Button>
      <Button
        variant="secondary"
        onPress={async () => {
          const name = await dialog.prompt({
            title: '닉네임을 입력하세요',
            description: '주문 화면에 표시됩니다.',
            placeholder: '닉네임',
          });
          setResult(name === null ? 'prompt 취소됨' : `prompt → ${name}`);
        }}>
        prompt 열기
      </Button>
      <Text>결과: {result}</Text>
    </Box>
  );
}

export const Default: Story = {
  render: () => (
    <DialogProvider>
      <Demo />
    </DialogProvider>
  ),
};
