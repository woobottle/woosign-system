import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {ToastApi, ToastEntry, ToastOptions} from './types';

const DEFAULT_DURATION = 4000;
const DEFAULT_MAX = 5;

/**
 * Internal state machine shared by web/native ToastProvider implementations.
 *
 * Owns the toast queue, auto-dismiss timers, and the imperative API surface.
 * The platform Provider components are responsible only for rendering.
 */
export function useToastState({
  defaultDuration = DEFAULT_DURATION,
  max = DEFAULT_MAX,
}: {
  defaultDuration?: number;
  max?: number;
} = {}): {api: ToastApi; toasts: ToastEntry[]} {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );
  const idCounterRef = useRef(0);

  const clearTimer = useCallback((id: string) => {
    const handle = timersRef.current.get(id);
    if (handle !== undefined) {
      clearTimeout(handle);
      timersRef.current.delete(id);
    }
  }, []);

  const dismiss = useCallback(
    (id?: string) => {
      if (id === undefined) {
        timersRef.current.forEach(h => clearTimeout(h));
        timersRef.current.clear();
        setToasts([]);
        return;
      }
      clearTimer(id);
      setToasts(prev => prev.filter(t => t.id !== id));
    },
    [clearTimer],
  );

  const show = useCallback(
    (options: ToastOptions) => {
      idCounterRef.current += 1;
      const id = `toast-${idCounterRef.current}`;
      const duration = options.duration ?? defaultDuration;
      const entry: ToastEntry = {...options, id};

      setToasts(prev => {
        const next = [...prev, entry];
        if (next.length > max) {
          const overflow = next.slice(0, next.length - max);
          overflow.forEach(t => clearTimer(t.id));
          return next.slice(next.length - max);
        }
        return next;
      });

      if (duration > 0) {
        const handle = setTimeout(() => {
          timersRef.current.delete(id);
          setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
        timersRef.current.set(id, handle);
      }
      return id;
    },
    [clearTimer, defaultDuration, max],
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach(h => clearTimeout(h));
      timers.clear();
    };
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      show,
      success: o => show({...o, tone: 'success'}),
      error: o => show({...o, tone: 'danger'}),
      brand: o => show({...o, tone: 'brand'}),
      neutral: o => show({...o, tone: 'neutral'}),
      dismiss,
    }),
    [show, dismiss],
  );

  return {api, toasts};
}
