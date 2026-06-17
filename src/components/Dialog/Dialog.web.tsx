/**
 * Dialog — Web implementation.
 *
 * createPortal(document.body)로 scrim+표면을 렌더해 부모 overflow/stacking
 * context를 탈출한다. scrim 클릭/Esc로 onClose를 호출하며, 표면 클릭은
 * stopPropagation으로 scrim까지 전파되지 않는다.
 */
import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
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
import {useResolvedColors} from '../../core/hooks';
import {useFocusTrap} from '../../core/hooks/useFocusTrap';

// Per-instance id source. `useId` would be cleaner but is React 18+, while the
// library's peer range is `react >=17`. The dialog surface only renders behind
// the client-only `mounted` gate, so there is no SSR output to mismatch on.
let dialogIdCounter = 0;

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
  const colors = useResolvedColors();
  const dialogStyles = useMemo(() => getDialogStyles(colors), [colors]);

  const [{titleId, descriptionId}] = useState(() => {
    dialogIdCounter += 1;
    return {
      titleId: `wb-dialog-title-${dialogIdCounter}`,
      descriptionId: `wb-dialog-desc-${dialogIdCounter}`,
    };
  });

  const [hasTitle, setHasTitle] = useState(false);
  const [hasDescription, setHasDescription] = useState(false);

  const contextValue = useMemo(
    () => ({
      titleId,
      descriptionId,
      registerTitle: setHasTitle,
      registerDescription: setHasDescription,
    }),
    [titleId, descriptionId],
  );

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
    if (!open || !closeOnEsc) {
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, closeOnEsc]);

  // 열려 있는 동안 surface로 포커스를 가둔다(닫히면 직전 요소로 복원).
  // mounted 게이트 후 surface가 그려지므로 open && mounted를 트랩 활성 신호로 쓴다
  // — 그래야 직접 open 마운트에서도 container가 준비된 뒤 이펙트가 돈다.
  const surfaceRef = useRef<HTMLDivElement>(null);
  useFocusTrap(surfaceRef, open && mounted);

  if (!open || !mounted || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <DialogContext.Provider value={contextValue}>
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
          ref={surfaceRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={hasTitle ? titleId : undefined}
          aria-describedby={hasDescription ? descriptionId : undefined}
          className={className}
          data-testid={testID}
          onClick={e => e.stopPropagation()}
          style={{
            ...dialogStyles.surface,
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
  const colors = useResolvedColors();
  const dialogStyles = useMemo(() => getDialogStyles(colors), [colors]);
  const css = cssifyWebStyles(
    mergeStyles(dialogStyles.header, style),
  ) as React.CSSProperties;
  return (
    <div className={className} style={css}>
      {children}
    </div>
  );
}
DialogHeader.displayName = 'DialogHeader';

export function DialogTitle({children, style, className}: DialogTitleProps) {
  const colors = useResolvedColors();
  const dialogStyles = useMemo(() => getDialogStyles(colors), [colors]);
  const ctx = useContext(DialogContext);
  const register = ctx?.registerTitle;
  useEffect(() => {
    register?.(true);
    return () => register?.(false);
  }, [register]);
  const css = cssifyWebStyles(
    mergeStyles(dialogStyles.title, {margin: 0}, style),
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
  const colors = useResolvedColors();
  const dialogStyles = useMemo(() => getDialogStyles(colors), [colors]);
  const ctx = useContext(DialogContext);
  const register = ctx?.registerDescription;
  useEffect(() => {
    register?.(true);
    return () => register?.(false);
  }, [register]);
  const css = cssifyWebStyles(
    mergeStyles(dialogStyles.description, {margin: 0}, style),
  ) as React.CSSProperties;
  return (
    <p id={ctx?.descriptionId} className={className} style={css}>
      {children}
    </p>
  );
}
DialogDescription.displayName = 'DialogDescription';

export function DialogBody({children, style, className}: DialogBodyProps) {
  const colors = useResolvedColors();
  const dialogStyles = useMemo(() => getDialogStyles(colors), [colors]);
  const css = cssifyWebStyles(
    mergeStyles(dialogStyles.body, style),
  ) as React.CSSProperties;
  return (
    <div className={className} style={css}>
      {children}
    </div>
  );
}
DialogBody.displayName = 'DialogBody';

export function DialogFooter({children, style, className}: DialogFooterProps) {
  const colors = useResolvedColors();
  const dialogStyles = useMemo(() => getDialogStyles(colors), [colors]);
  const css = cssifyWebStyles(
    mergeStyles(dialogStyles.footer, style),
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
