import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {
  AlertOptions,
  ConfirmOptions,
  PromptOptions,
  DialogApi,
  DialogEntry,
} from './types';

/**
 * 임퍼러티브 Dialog의 상태머신. 큐(한 번에 하나)와 각 호출의 Promise resolve를
 * 소유한다. 플랫폼 Provider는 렌더링만 담당한다.
 *
 * - confirm()/alert()/prompt()는 엔트리를 큐에 push하고 Promise를 반환한다.
 * - confirmCurrent(value?)/cancelCurrent()는 head를 resolve하고 큐에서 제거한다.
 * - prompt는 확인 시 입력 문자열(value), 취소/scrim/Esc 시 null로 resolve한다.
 */
export function useDialogState(): {
  api: DialogApi;
  current: DialogEntry | null;
  confirmCurrent: (value?: string) => void;
  cancelCurrent: () => void;
} {
  const [queue, setQueue] = useState<DialogEntry[]>([]);
  const idRef = useRef(0);

  // head를 ref로 들고 있어 안정적인 핸들러가 최신 엔트리를 resolve할 수 있게 한다.
  const currentRef = useRef<DialogEntry | null>(null);
  currentRef.current = queue[0] ?? null;

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>(resolve => {
      idRef.current += 1;
      const entry: DialogEntry = {
        id: `wb-dialog-imperative-${idRef.current}`,
        kind: 'confirm',
        options,
        resolve,
      };
      setQueue(prev => [...prev, entry]);
    });
  }, []);

  const alert = useCallback((options: AlertOptions) => {
    return new Promise<void>(resolve => {
      idRef.current += 1;
      const entry: DialogEntry = {
        id: `wb-dialog-imperative-${idRef.current}`,
        kind: 'alert',
        options,
        resolve,
      };
      setQueue(prev => [...prev, entry]);
    });
  }, []);

  const prompt = useCallback((options: PromptOptions) => {
    return new Promise<string | null>(resolve => {
      idRef.current += 1;
      const entry: DialogEntry = {
        id: `wb-dialog-imperative-${idRef.current}`,
        kind: 'prompt',
        options,
        resolve,
      };
      setQueue(prev => [...prev, entry]);
    });
  }, []);

  // confirmed=확인 여부. promptValue는 prompt 확인 시의 입력값.
  // resolve는 updater 밖에서 호출(부작용 분리).
  const settle = useCallback((confirmed: boolean, promptValue?: string) => {
    const head = currentRef.current;
    if (!head) {
      return;
    }
    if (head.kind === 'confirm') {
      head.resolve(confirmed);
    } else if (head.kind === 'alert') {
      head.resolve();
    } else {
      head.resolve(confirmed ? promptValue ?? '' : null);
    } // prompt
    setQueue(prev => prev.slice(1));
  }, []);

  const confirmCurrent = useCallback(
    (value?: string) => settle(true, value),
    [settle],
  );
  const cancelCurrent = useCallback(() => settle(false), [settle]);

  // 언마운트 시 남은 엔트리는 취소로 resolve(매달린 Promise 방지).
  const queueRef = useRef(queue);
  queueRef.current = queue;
  useEffect(() => {
    return () => {
      queueRef.current.forEach(e => {
        if (e.kind === 'confirm') {
          e.resolve(false);
        } else if (e.kind === 'alert') {
          e.resolve();
        } else {
          e.resolve(null);
        } // prompt
      });
    };
  }, []);

  const api = useMemo<DialogApi>(
    () => ({confirm, alert, prompt}),
    [confirm, alert, prompt],
  );
  return {api, current: queue[0] ?? null, confirmCurrent, cancelCurrent};
}
