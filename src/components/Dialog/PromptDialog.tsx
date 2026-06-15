/**
 * PromptDialog — 임퍼러티브 prompt()의 렌더. 입력 상태(useState)를 소유하며
 * web/native 공통이다(Dialog/Input 파사드가 각 플랫폼 구현으로 resolve된다).
 * Provider가 key={entry.id}로 엔트리마다 새 인스턴스를 만들어 입력값을 리셋한다.
 */
import {useState} from 'react';
import {Dialog} from './Dialog';
import {Input} from '../Input';
import {Button} from '../Button';
import type {DialogEntry} from './types';

type PromptEntry = Extract<DialogEntry, {kind: 'prompt'}>;

interface PromptDialogProps {
  entry: PromptEntry;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export function PromptDialog({entry, onConfirm, onCancel}: PromptDialogProps) {
  const {options} = entry;
  const [value, setValue] = useState(options.defaultValue ?? '');
  return (
    <Dialog open onClose={onCancel}>
      <Dialog.Header>
        <Dialog.Title>{options.title}</Dialog.Title>
        {options.description != null && (
          <Dialog.Description>{options.description}</Dialog.Description>
        )}
      </Dialog.Header>
      <Dialog.Body>
        <Input
          value={value}
          onChangeText={setValue}
          placeholder={options.placeholder}
          fullWidth
          autoFocus
        />
      </Dialog.Body>
      <Dialog.Footer>
        <Button variant="secondary" onPress={onCancel}>
          {options.cancelText ?? '취소'}
        </Button>
        <Button onPress={() => onConfirm(value)}>
          {options.confirmText ?? '확인'}
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}

PromptDialog.displayName = 'PromptDialog';
