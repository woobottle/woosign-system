/**
 * Dialog — Web implementation.
 *
 * createPortal(document.body)로 scrim+표면을 렌더해 부모 overflow/stacking
 * context를 탈출한다. scrim 클릭/Esc로 onClose를 호출하며, 표면 클릭은
 * stopPropagation으로 scrim까지 전파되지 않는다.
 */
import React, {useContext, useEffect, useId, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import type {
  DialogWebProps,
  DialogHeaderProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogBodyProps,
  DialogFooterProps,
} from './types';
import {DialogContext} from './DialogContext';
import {getDialogStyles, SIZE_MAX_WIDTH, SCRIM_COLOR} from './Dialog.styles';
import {zIndex, shadowsCss} from '../../core/theme/tokens';
import {mergeStyles} from '../../core/variants';
import {cssifyWebStyles} from '../../core/utils/cssifyWebStyles';

function DialogBase({
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

  // onClose ref — always holds the latest callback so the Esc listener
  // doesn't need to re-register every time the consumer passes a new inline fn
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // SSR / hydration gate — createPortal requires document.body
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Esc 리스너는 열려 있고 closeOnEsc일 때만 등록
  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, closeOnEsc]);

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

export function DialogHeader({children, style, className}: DialogHeaderProps) {
  const s = getDialogStyles();
  const css = cssifyWebStyles(
    mergeStyles(s.header, style),
  ) as React.CSSProperties;
  return (
    <div className={className} style={css}>
      {children}
    </div>
  );
}
DialogHeader.displayName = 'DialogHeader';

export function DialogTitle({children, style, className}: DialogTitleProps) {
  const ctx = useContext(DialogContext);
  const s = getDialogStyles();
  const css = cssifyWebStyles(
    mergeStyles(s.title, {margin: 0}, style),
  ) as React.CSSProperties;
  return (
    <h2 id={ctx?.titleId} className={className} style={css}>
      {children}
    </h2>
  );
}
DialogTitle.displayName = 'DialogTitle';

export function DialogDescription({
  children,
  style,
  className,
}: DialogDescriptionProps) {
  const ctx = useContext(DialogContext);
  const s = getDialogStyles();
  const css = cssifyWebStyles(
    mergeStyles(s.description, {margin: 0}, style),
  ) as React.CSSProperties;
  return (
    <p id={ctx?.descriptionId} className={className} style={css}>
      {children}
    </p>
  );
}
DialogDescription.displayName = 'DialogDescription';

export function DialogBody({children, style, className}: DialogBodyProps) {
  const s = getDialogStyles();
  const css = cssifyWebStyles(mergeStyles(s.body, style)) as React.CSSProperties;
  return (
    <div className={className} style={css}>
      {children}
    </div>
  );
}
DialogBody.displayName = 'DialogBody';

export function DialogFooter({children, style, className}: DialogFooterProps) {
  const s = getDialogStyles();
  const css = cssifyWebStyles(
    mergeStyles(s.footer, style),
  ) as React.CSSProperties;
  return (
    <div className={className} style={css}>
      {children}
    </div>
  );
}
DialogFooter.displayName = 'DialogFooter';

interface DialogComponent {
  (props: DialogWebProps): React.ReactElement | null;
  displayName?: string;
  Header: typeof DialogHeader;
  Title: typeof DialogTitle;
  Description: typeof DialogDescription;
  Body: typeof DialogBody;
  Footer: typeof DialogFooter;
}

const Dialog = DialogBase as unknown as DialogComponent;
Dialog.displayName = 'Dialog';
Dialog.Header = DialogHeader;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Body = DialogBody;
Dialog.Footer = DialogFooter;

export {Dialog};
