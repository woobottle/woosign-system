/**
 * DialogProvider — React Native implementation.
 *
 * Dialog.native가 RN <Modal>이라 Toast식 absolute overlay가 필요 없다 —
 * {children} 옆에 큐 head Dialog를 그대로 렌더한다. onClose(scrim/Android back)는
 * cancelCurrent에 연결한다. 상태머신은 web과 동일한 useDialogState를 공유한다.
 */
import {Dialog} from './Dialog.native';
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
        // key로 큐 head마다 새 Dialog 인스턴스를 만들어 상태를 깨끗이 리셋한다.
        <Dialog key={current.id} open onClose={cancelCurrent}>
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
