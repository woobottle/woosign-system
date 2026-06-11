/**
 * BottomSheet — Web implementation.
 *
 * createPortal(document.body)로 scrim+표면을 하단 정렬(flex-end) 렌더해 부모
 * overflow/stacking context를 탈출한다. scrim 클릭/Esc로 onClose를 호출하고,
 * 핸들 영역 Pointer Events 드래그로 디스미스한다(판정: shouldDismiss 공유 함수).
 * 표면 클릭은 stopPropagation으로 scrim까지 전파되지 않는다.
 */
import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import type {
  BottomSheetWebProps,
  BottomSheetHeaderProps,
  BottomSheetTitleProps,
  BottomSheetDescriptionProps,
  BottomSheetBodyProps,
  BottomSheetFooterProps,
} from './types';
import {BottomSheetContext} from './BottomSheetContext';
import {
  getBottomSheetStyles,
  SCRIM_COLOR,
  DEFAULT_MAX_HEIGHT_RATIO,
} from './BottomSheet.styles';
import {shouldDismiss} from './dismiss';
import {zIndex, shadowsCss, duration, easing} from '../../core/theme/tokens';
import {mergeStyles} from '../../core/variants';
import {cssifyWebStyles} from '../../core/utils/cssifyWebStyles';

const sheetStyles = getBottomSheetStyles();

// Per-instance id source. `useId`는 React 18+라 peer range(react >=17)에서 금지.
// 표면은 client-only `mounted` 게이트 뒤에서만 렌더되므로 SSR 불일치 없음.
let sheetIdCounter = 0;

function BottomSheetBase({
  open,
  onClose,
  closeOnScrimClick = true,
  closeOnEsc = true,
  dragToClose = true,
  maxHeightRatio = DEFAULT_MAX_HEIGHT_RATIO,
  children,
  className,
  style,
  testID,
}: BottomSheetWebProps) {
  const [{titleId, descriptionId}] = useState(() => {
    sheetIdCounter += 1;
    return {
      titleId: `wb-bottomsheet-title-${sheetIdCounter}`,
      descriptionId: `wb-bottomsheet-desc-${sheetIdCounter}`,
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

  // onClose ref — Esc 리스너/드래그 핸들러가 항상 최신 콜백을 보도록
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // SSR / hydration 게이트 — createPortal은 document.body 필요
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

  // 핸들 드래그 상태. dragY는 렌더에 반영되므로 state, 나머지는 ref.
  const surfaceRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({active: false, startY: 0, startTime: 0});
  const [dragY, setDragY] = useState(0);
  const [snapping, setSnapping] = useState(false);

  if (!open || !mounted || typeof document === 'undefined') return null;

  const onHandlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = {active: true, startY: e.clientY, startTime: Date.now()};
    setSnapping(false);
    // jsdom에는 setPointerCapture가 없으므로 optional 호출
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onHandlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    setDragY(Math.max(0, e.clientY - dragRef.current.startY));
  };

  const onHandlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    const dy = Math.max(0, e.clientY - dragRef.current.startY);
    const elapsed = Math.max(1, Date.now() - dragRef.current.startTime);
    const sheetHeight = surfaceRef.current?.offsetHeight ?? 0;
    if (shouldDismiss(dy, dy / elapsed, sheetHeight)) {
      setDragY(0);
      onCloseRef.current();
    } else {
      setSnapping(true);
      setDragY(0);
    }
  };

  // 제스처가 OS에 뺏기는 등 pointerup 없이 끝나면 디스미스 판정 없이 복귀만 한다
  const onHandlePointerCancel = () => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    setSnapping(true);
    setDragY(0);
  };

  const handleAreaCss = {
    ...(cssifyWebStyles(
      mergeStyles(sheetStyles.handleArea),
    ) as React.CSSProperties),
    display: 'flex',
    flexDirection: 'column' as const,
    touchAction: 'none' as const,
    cursor: 'grab',
  };

  return createPortal(
    <BottomSheetContext.Provider value={contextValue}>
      <div
        data-testid={testID ? `${testID}-scrim` : 'bottomsheet-scrim'}
        onClick={closeOnScrimClick ? onClose : undefined}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: SCRIM_COLOR,
          display: 'flex',
          alignItems: 'flex-end',
          zIndex: zIndex.modal,
          animation: `wbSheetScrimIn ${duration.normal}ms ease-out`,
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
            ...sheetStyles.surface,
            display: 'flex',
            flexDirection: 'column',
            maxHeight: `${maxHeightRatio * 100}vh`,
            boxShadow: shadowsCss.modal,
            transform: `translateY(${dragY}px)`,
            transition: snapping
              ? `transform ${duration.normal}ms ${easing.out}`
              : undefined,
            animation: `wbSheetSurfaceIn 220ms ${easing.out}`,
            ...style,
          }}>
          {dragToClose && (
            <div
              data-testid={testID ? `${testID}-handle` : 'bottomsheet-handle'}
              onPointerDown={onHandlePointerDown}
              onPointerMove={onHandlePointerMove}
              onPointerUp={onHandlePointerUp}
              onPointerCancel={onHandlePointerCancel}
              style={handleAreaCss}>
              <div
                style={
                  cssifyWebStyles(
                    mergeStyles(sheetStyles.handle),
                  ) as React.CSSProperties
                }
              />
            </div>
          )}
          {children}
        </div>
        <style>
          {`@keyframes wbSheetScrimIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes wbSheetSurfaceIn {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }`}
        </style>
      </div>
    </BottomSheetContext.Provider>,
    document.body,
  );
}

export function BottomSheetHeader({
  children,
  style,
  className,
}: BottomSheetHeaderProps) {
  const css = cssifyWebStyles(
    mergeStyles(sheetStyles.header, style),
  ) as React.CSSProperties;
  return (
    <div className={className} style={css}>
      {children}
    </div>
  );
}
BottomSheetHeader.displayName = 'BottomSheetHeader';

export function BottomSheetTitle({
  children,
  style,
  className,
}: BottomSheetTitleProps) {
  const ctx = useContext(BottomSheetContext);
  const register = ctx?.registerTitle;
  useEffect(() => {
    register?.(true);
    return () => register?.(false);
  }, [register]);
  const css = cssifyWebStyles(
    mergeStyles(sheetStyles.title, {margin: 0}, style),
  ) as React.CSSProperties;
  return (
    <h2 id={ctx?.titleId} className={className} style={css}>
      {children}
    </h2>
  );
}
BottomSheetTitle.displayName = 'BottomSheetTitle';

export function BottomSheetDescription({
  children,
  style,
  className,
}: BottomSheetDescriptionProps) {
  const ctx = useContext(BottomSheetContext);
  const register = ctx?.registerDescription;
  useEffect(() => {
    register?.(true);
    return () => register?.(false);
  }, [register]);
  const css = cssifyWebStyles(
    mergeStyles(sheetStyles.description, {margin: 0}, style),
  ) as React.CSSProperties;
  return (
    <p id={ctx?.descriptionId} className={className} style={css}>
      {children}
    </p>
  );
}
BottomSheetDescription.displayName = 'BottomSheetDescription';

export function BottomSheetBody({
  children,
  style,
  className,
}: BottomSheetBodyProps) {
  const css = cssifyWebStyles(
    mergeStyles(sheetStyles.body, style),
  ) as React.CSSProperties;
  return (
    <div className={className} style={{...css, overflowY: 'auto'}}>
      {children}
    </div>
  );
}
BottomSheetBody.displayName = 'BottomSheetBody';

export function BottomSheetFooter({
  children,
  style,
  className,
}: BottomSheetFooterProps) {
  const css = cssifyWebStyles(
    mergeStyles(sheetStyles.footer, style),
  ) as React.CSSProperties;
  return (
    <div className={className} style={css}>
      {children}
    </div>
  );
}
BottomSheetFooter.displayName = 'BottomSheetFooter';

interface BottomSheetComponent {
  (props: BottomSheetWebProps): React.ReactElement | null;
  displayName?: string;
  Header: typeof BottomSheetHeader;
  Title: typeof BottomSheetTitle;
  Description: typeof BottomSheetDescription;
  Body: typeof BottomSheetBody;
  Footer: typeof BottomSheetFooter;
}

const BottomSheet = BottomSheetBase as unknown as BottomSheetComponent;
BottomSheet.displayName = 'BottomSheet';
BottomSheet.Header = BottomSheetHeader;
BottomSheet.Title = BottomSheetTitle;
BottomSheet.Description = BottomSheetDescription;
BottomSheet.Body = BottomSheetBody;
BottomSheet.Footer = BottomSheetFooter;

export {BottomSheet};
