/**
 * DialogProvider — Web implementation.
 *
 * 임퍼러티브 DialogApi를 useDialog() 소비자에게 노출하고, 큐 head를 controlled
 * Dialog로 렌더한다. prompt 엔트리는 입력 상태가 필요해 PromptDialog로 분기한다.
 * scrim/Esc(onClose)는 cancelCurrent에 연결 — 닫힘을 취소로 간주한다.
 */
import {Dialog} from './Dialog.web';
import {PromptDialog} from './PromptDialog';
import {DialogImperativeContext} from './DialogImperativeContext';
import {useDialogState} from './useDialogState';
import {Button} from '../Button';
import type {DialogProviderProps} from './types';

export function DialogProvider({children}: DialogProviderProps) {
  const {api, current, confirmCurrent, cancelCurrent} = useDialogState();

  return (
    <DialogImperativeContext.Provider value={api}>
      {children}
      {current &&
        (current.kind === 'prompt' ? (
          <PromptDialog
            key={current.id}
            entry={current}
            onConfirm={confirmCurrent}
            onCancel={cancelCurrent}
          />
        ) : (
          // key로 큐 head마다 새 Dialog 인스턴스를 만들어 aria id·진입 애니메이션을
          // 다이얼로그 간에 깨끗이 리셋한다(큐잉 시 이전 항목 상태 잔존 방지).
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
                onPress={() => confirmCurrent()}>
                {current.options.confirmText ?? '확인'}
              </Button>
            </Dialog.Footer>
          </Dialog>
        ))}
    </DialogImperativeContext.Provider>
  );
}

DialogProvider.displayName = 'DialogProvider';
