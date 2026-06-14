import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {
  AlertOptions,
  ConfirmOptions,
  DialogApi,
  DialogEntry,
} from './types';

/**
 * 임퍼러티브 Dialog의 상태머신. 큐(한 번에 하나)와 각 호출의 Promise resolve를
 * 소유한다. 플랫폼 Provider는 렌더링만 담당한다.
 *
 * - confirm()/alert()는 엔트리를 큐에 push하고 Promise를 반환한다.
 * - confirmCurrent()/cancelCurrent()는 head를 resolve하고 큐에서 제거한다.
 * - dismiss(scrim/Esc/취소)는 cancelCurrent와 동일 경로다.
 */
export function useDialogState(): {
  api: DialogApi;
  current: DialogEntry | null;
  confirmCurrent: () => void;
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

  // value는 confirm일 때만 의미. resolve는 updater 밖에서 호출(부작용 분리).
  const settle = useCallback((value: boolean) => {
    const head = currentRef.current;
    if (!head) return;
    if (head.kind === 'confirm') head.resolve(value);
    else head.resolve();
    setQueue(prev => prev.slice(1));
  }, []);

  const confirmCurrent = useCallback(() => settle(true), [settle]);
  const cancelCurrent = useCallback(() => settle(false), [settle]);

  // 언마운트 시 남은 엔트리는 cancel로 resolve(매달린 Promise 방지).
  const queueRef = useRef(queue);
  queueRef.current = queue;
  useEffect(() => {
    return () => {
      queueRef.current.forEach(e => {
        if (e.kind === 'confirm') e.resolve(false);
        else e.resolve();
      });
    };
  }, []);

  const api = useMemo<DialogApi>(() => ({confirm, alert}), [confirm, alert]);
  return {api, current: queue[0] ?? null, confirmCurrent, cancelCurrent};
}
