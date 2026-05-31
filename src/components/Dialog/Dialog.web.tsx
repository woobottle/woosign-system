/**
 * Dialog — Web implementation.
 *
 * createPortal(document.body)로 scrim+표면을 렌더해 부모 overflow/stacking
 * context를 탈출한다. scrim 클릭/Esc로 onClose를 호출하며, 표면 클릭은
 * stopPropagation으로 scrim까지 전파되지 않는다.
 */
import {useEffect, useId, useState} from 'react';
import {createPortal} from 'react-dom';
import type {DialogWebProps} from './types';
import {DialogContext} from './DialogContext';
import {getDialogStyles, SIZE_MAX_WIDTH, SCRIM_COLOR} from './Dialog.styles';
import {zIndex, shadowsCss} from '../../core/theme/tokens';

export function Dialog({
  open,
  onClose,
  size = 'md',
  closeOnScrimClick = true,
  closeOnEsc = true,
  children,
  className,
  style,
  testID,
}: DialogWebProps) {
  const titleId = useId();
  const descriptionId = useId();

  // SSR / hydration gate — createPortal requires document.body
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Esc 리스너는 열려 있고 closeOnEsc일 때만 등록
  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, closeOnEsc, onClose]);

  if (!open || !mounted || typeof document === 'undefined') return null;

  const s = getDialogStyles();

  return createPortal(
    <DialogContext.Provider value={{titleId, descriptionId}}>
      <div
        data-testid={testID ? `${testID}-scrim` : 'dialog-scrim'}
        onClick={closeOnScrimClick ? onClose : undefined}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: SCRIM_COLOR,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          zIndex: zIndex.modal,
          animation: 'wbDialogScrimIn 180ms ease-out',
        }}>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className={className}
          data-testid={testID}
          onClick={e => e.stopPropagation()}
          style={{
            ...s.surface,
            maxWidth: SIZE_MAX_WIDTH[size],
            boxShadow: shadowsCss.modal,
            animation: 'wbDialogSurfaceIn 180ms ease-out',
            ...style,
          }}>
          {children}
        </div>
        <style>
          {`@keyframes wbDialogScrimIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes wbDialogSurfaceIn {
              from { opacity: 0; transform: scale(0.96); }
              to { opacity: 1; transform: scale(1); }
            }`}
        </style>
      </div>
    </DialogContext.Provider>,
    document.body,
  );
}

Dialog.displayName = 'Dialog';
