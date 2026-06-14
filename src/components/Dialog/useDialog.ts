import {useContext} from 'react';
import {DialogImperativeContext} from './DialogImperativeContext';
import type {DialogApi} from './types';

/**
 * 임퍼러티브 Dialog API. `<DialogProvider>` 안에서만 호출할 수 있다.
 *
 * ```tsx
 * const dialog = useDialog();
 * const ok = await dialog.confirm({title: '삭제할까요?', tone: 'destructive'});
 * await dialog.alert({title: '저장됐어요'});
 * ```
 */
export function useDialog(): DialogApi {
  const ctx = useContext(DialogImperativeContext);
  if (!ctx) {
    throw new Error(
      'useDialog() must be used inside <DialogProvider>. ' +
        'Wrap your app (or the subtree that needs dialogs) with <DialogProvider>.',
    );
  }
  return ctx;
}
