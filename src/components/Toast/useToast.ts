import {useContext} from 'react';
import {ToastContext} from './ToastContext';
import type {ToastApi} from './types';

/**
 * Imperative toast API. Must be called from inside `<ToastProvider>`.
 *
 * ```tsx
 * const toast = useToast();
 * toast.success({title: '저장됐어요'});
 * toast.error({title: '실패', description: '잠시 후 다시 시도해 주세요'});
 * const id = toast.show({tone: 'brand', title: 'Hi', duration: 0});
 * toast.dismiss(id);
 * ```
 */
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error(
      'useToast() must be used inside <ToastProvider>. ' +
        'Wrap your app (or the subtree that needs toasts) with <ToastProvider>.',
    );
  }
  return ctx;
}
