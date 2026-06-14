/**
 * Native harness tests for the imperative DialogProvider. react-native preset.
 * Modal은 프리셋이 목킹하므로 동작(콜백/조건부 렌더/resolve)만 검증한다.
 * 트리거는 RN core Pressable+Text(@woosign Button 비의존)로 만든다.
 */
import {Modal, Pressable, Text} from 'react-native';
import {render, screen, fireEvent} from '@testing-library/react-native';
import {DialogProvider} from './DialogProvider.native';
import {useDialog} from './useDialog';
import type {ConfirmOptions, AlertOptions} from './types';

function ConfirmHarness({
  options,
  onPromise,
}: {
  options: ConfirmOptions;
  onPromise: (p: Promise<boolean>) => void;
}) {
  const dialog = useDialog();
  return (
    <Pressable onPress={() => onPromise(dialog.confirm(options))}>
      <Text>open</Text>
    </Pressable>
  );
}

function AlertHarness({
  options,
  onPromise,
}: {
  options: AlertOptions;
  onPromise: (p: Promise<void>) => void;
}) {
  const dialog = useDialog();
  return (
    <Pressable onPress={() => onPromise(dialog.alert(options))}>
      <Text>open</Text>
    </Pressable>
  );
}

describe('DialogProvider (native)', () => {
  it('resolves true when the confirm button is pressed', async () => {
    let promise!: Promise<boolean>;
    render(
      <DialogProvider>
        <ConfirmHarness
          options={{title: '삭제할까요?'}}
          onPromise={p => {
            promise = p;
          }}
        />
      </DialogProvider>,
    );
    fireEvent.press(screen.getByText('open'));
    expect(screen.getByText('삭제할까요?')).toBeTruthy();
    fireEvent.press(screen.getByText('확인'));
    await expect(promise).resolves.toBe(true);
  });

  it('resolves false when the cancel button is pressed', async () => {
    let promise!: Promise<boolean>;
    render(
      <DialogProvider>
        <ConfirmHarness
          options={{title: '삭제할까요?'}}
          onPromise={p => {
            promise = p;
          }}
        />
      </DialogProvider>,
    );
    fireEvent.press(screen.getByText('open'));
    fireEvent.press(screen.getByText('취소'));
    await expect(promise).resolves.toBe(false);
  });

  it('resolves false on Android back (Modal onRequestClose)', async () => {
    let promise!: Promise<boolean>;
    render(
      <DialogProvider>
        <ConfirmHarness
          options={{title: '삭제할까요?'}}
          onPromise={p => {
            promise = p;
          }}
        />
      </DialogProvider>,
    );
    fireEvent.press(screen.getByText('open'));
    screen.UNSAFE_getByType(Modal).props.onRequestClose();
    await expect(promise).resolves.toBe(false);
  });

  it('alert() resolves when the confirm button is pressed', async () => {
    let promise!: Promise<void>;
    render(
      <DialogProvider>
        <AlertHarness
          options={{title: '저장됐어요'}}
          onPromise={p => {
            promise = p;
          }}
        />
      </DialogProvider>,
    );
    fireEvent.press(screen.getByText('open'));
    expect(screen.queryByText('취소')).toBeNull();
    fireEvent.press(screen.getByText('확인'));
    await expect(promise).resolves.toBeUndefined();
  });
});
