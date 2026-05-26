/**
 * ToastProvider — Web implementation.
 *
 * Wraps the app (or any subtree) and exposes the `useToast()` API to
 * descendants. Renders the active toast stack via Portal to document.body
 * so it escapes parent overflow / stacking contexts.
 */

import {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import {Toast} from './Toast.web';
import {ToastContext} from './ToastContext';
import {useToastState} from './useToastState';
import {zIndex} from '../../core/theme/tokens';
import type {ToastProviderProps} from './types';

export function ToastProvider({
  children,
  duration,
  position = 'bottom',
  max,
  offset = 24,
}: ToastProviderProps) {
  const {api, toasts} = useToastState({defaultDuration: duration, max});

  // SSR / hydration gate — createPortal requires document.body
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const stack =
    mounted && typeof document !== 'undefined'
      ? createPortal(
          <div
            role="region"
            aria-label="Notifications"
            style={{
              position: 'fixed',
              left: '50%',
              transform: 'translateX(-50%)',
              top: position === 'top' ? offset : undefined,
              bottom: position === 'bottom' ? offset : undefined,
              display: 'flex',
              flexDirection: position === 'top' ? 'column' : 'column-reverse',
              gap: 12,
              zIndex: zIndex.toast,
              pointerEvents: 'none',
              maxWidth: 'min(420px, calc(100vw - 32px))',
              width: '100%',
              alignItems: 'center',
            }}>
            {toasts.map(t => (
              <div
                key={t.id}
                role="status"
                aria-live="polite"
                style={{
                  pointerEvents: 'auto',
                  width: '100%',
                  animation: 'wbToastIn 180ms ease-out',
                }}>
                <Toast
                  tone={t.tone ?? 'neutral'}
                  title={t.title}
                  description={t.description}
                  glyph={t.glyph}
                  hideIcon={t.hideIcon}
                />
              </div>
            ))}
            <style>
              {`@keyframes wbToastIn {
                from { opacity: 0; transform: translateY(8px); }
                to { opacity: 1; transform: translateY(0); }
              }`}
            </style>
          </div>,
          document.body,
        )
      : null;

  return (
    <ToastContext.Provider value={api}>
      {children}
      {stack}
    </ToastContext.Provider>
  );
}

ToastProvider.displayName = 'ToastProvider';
