/**
 * DialogProvider — Web implementation.
 *
 * 임퍼러티브 DialogApi를 useDialog() 소비자에게 노출하고, 큐 head를 controlled
 * <Dialog>로 렌더한다. Dialog.web이 portal을 쓰므로 추가 portal은 불필요하다.
 * scrim/Esc(onClose)는 cancelCurrent에 연결 — 닫힘을 취소로 간주한다.
 */
import {Dialog} from './Dialog.web';
import {DialogImperativeContext} from './DialogImperativeContext';
import {useDialogState} from './useDialogState';
import {Button} from '../Button';
import type {DialogProviderProps} from './types';

export function DialogProvider({children}: DialogProviderProps) {
  const {api, current, confirmCurrent, cancelCurrent} = useDialogState();

  return (
    <DialogImperativeContext.Provider value={api}>
      {children}
      {current && (
        <Dialog open onClose={cancelCurrent}>
          <Dialog.Header>
            <Dialog.Title>{current.options.title}</Dialog.Title>
            {current.options.description != null && (
              <Dialog.Description>
                {current.options.description}
              </Dialog.Description>
            )}
          </Dialog.Header>
          <Dialog.Footer>
            {current.kind === 'confirm' && (
              <Button variant="secondary" onPress={cancelCurrent}>
                {current.options.cancelText ?? '취소'}
              </Button>
            )}
            <Button
              variant={
                current.kind === 'confirm' &&
                current.options.tone === 'destructive'
                  ? 'destructive'
                  : 'default'
              }
              onPress={confirmCurrent}>
              {current.options.confirmText ?? '확인'}
            </Button>
          </Dialog.Footer>
        </Dialog>
      )}
    </DialogImperativeContext.Provider>
  );
}

DialogProvider.displayName = 'DialogProvider';
