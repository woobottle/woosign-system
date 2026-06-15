/**
 * Drawer — Web implementation.
 *
 * createPortal(document.body)로 scrim+패널을 좌측 정렬(justify-start)·풀하이트
 * (align stretch) 렌더해 부모 overflow/stacking을 탈출한다. scrim 클릭/Esc로
 * onClose를 호출하고, 패널은 좌측에서 translateX 슬라이드로 진입한다. 패널 클릭은
 * stopPropagation으로 scrim까지 전파되지 않는다.
 */
import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import type {
  DrawerWebProps,
  DrawerHeaderProps,
  DrawerTitleProps,
  DrawerDescriptionProps,
  DrawerBodyProps,
  DrawerFooterProps,
} from './types';
import {DrawerContext} from './DrawerContext';
import {getDrawerStyles, SCRIM_COLOR, DEFAULT_WIDTH} from './Drawer.styles';
import {zIndex, shadowsCss, duration, easing} from '../../core/theme/tokens';
import {mergeStyles} from '../../core/variants';
import {cssifyWebStyles} from '../../core/utils/cssifyWebStyles';
import {useResolvedColors} from '../../core/hooks';

// Per-instance id source. useId는 react>=17 peer range에서 금지.
let drawerIdCounter = 0;

function DrawerBase({
  open,
  onClose,
  width = DEFAULT_WIDTH,
  closeOnScrimClick = true,
  closeOnEsc = true,
  children,
  className,
  style,
  testID,
}: DrawerWebProps) {
  const colors = useResolvedColors();
  const drawerStyles = useMemo(() => getDrawerStyles(colors), [colors]);

  const [{titleId, descriptionId}] = useState(() => {
    drawerIdCounter += 1;
    return {
      titleId: `wb-drawer-title-${drawerIdCounter}`,
      descriptionId: `wb-drawer-desc-${drawerIdCounter}`,
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

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, closeOnEsc]);

  if (!open || !mounted || typeof document === 'undefined') return null;

  return createPortal(
    <DrawerContext.Provider value={contextValue}>
      <div
        data-testid={testID ? `${testID}-scrim` : 'drawer-scrim'}
        onClick={closeOnScrimClick ? onClose : undefined}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: SCRIM_COLOR,
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
          zIndex: zIndex.modal,
          animation: `wbDrawerScrimIn ${duration.normal}ms ease-out`,
        }}>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={hasTitle ? titleId : undefined}
          aria-describedby={hasDescription ? descriptionId : undefined}
          className={className}
          data-testid={testID}
          onClick={e => e.stopPropagation()}
          style={{
            ...drawerStyles.surface,
            display: 'flex',
            flexDirection: 'column',
            width,
            maxWidth: '100vw',
            boxShadow: shadowsCss.modal,
            animation: `wbDrawerIn ${duration.normal}ms ${easing.out}`,
            ...style,
          }}>
          {children}
        </div>
        <style>
          {`@keyframes wbDrawerScrimIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes wbDrawerIn {
              from { transform: translateX(-100%); }
              to { transform: translateX(0); }
            }`}
        </style>
      </div>
    </DrawerContext.Provider>,
    document.body,
  );
}

export function DrawerHeader({children, style, className}: DrawerHeaderProps) {
  const colors = useResolvedColors();
  const drawerStyles = useMemo(() => getDrawerStyles(colors), [colors]);
  const css = cssifyWebStyles(
    mergeStyles(drawerStyles.header, style),
  ) as React.CSSProperties;
  return (
    <div className={className} style={css}>
      {children}
    </div>
  );
}
DrawerHeader.displayName = 'DrawerHeader';

export function DrawerTitle({children, style, className}: DrawerTitleProps) {
  const colors = useResolvedColors();
  const drawerStyles = useMemo(() => getDrawerStyles(colors), [colors]);
  const ctx = useContext(DrawerContext);
  const register = ctx?.registerTitle;
  useEffect(() => {
    register?.(true);
    return () => register?.(false);
  }, [register]);
  const css = cssifyWebStyles(
    mergeStyles(drawerStyles.title, {margin: 0}, style),
  ) as React.CSSProperties;
  return (
    <h2 id={ctx?.titleId} className={className} style={css}>
      {children}
    </h2>
  );
}
DrawerTitle.displayName = 'DrawerTitle';

export function DrawerDescription({
  children,
  style,
  className,
}: DrawerDescriptionProps) {
  const colors = useResolvedColors();
  const drawerStyles = useMemo(() => getDrawerStyles(colors), [colors]);
  const ctx = useContext(DrawerContext);
  const register = ctx?.registerDescription;
  useEffect(() => {
    register?.(true);
    return () => register?.(false);
  }, [register]);
  const css = cssifyWebStyles(
    mergeStyles(drawerStyles.description, {margin: 0}, style),
  ) as React.CSSProperties;
  return (
    <p id={ctx?.descriptionId} className={className} style={css}>
      {children}
    </p>
  );
}
DrawerDescription.displayName = 'DrawerDescription';

export function DrawerBody({children, style, className}: DrawerBodyProps) {
  const colors = useResolvedColors();
  const drawerStyles = useMemo(() => getDrawerStyles(colors), [colors]);
  // flex:1로 헤더/푸터 사이를 채우고, overflowY는 기본값(소비자 style로 덮어쓰기 가능)
  const css = cssifyWebStyles(
    mergeStyles({flex: 1, overflowY: 'auto'}, drawerStyles.body, style),
  ) as React.CSSProperties;
  return (
    <div className={className} style={css}>
      {children}
    </div>
  );
}
DrawerBody.displayName = 'DrawerBody';

export function DrawerFooter({children, style, className}: DrawerFooterProps) {
  const colors = useResolvedColors();
  const drawerStyles = useMemo(() => getDrawerStyles(colors), [colors]);
  const css = cssifyWebStyles(
    mergeStyles(drawerStyles.footer, style),
  ) as React.CSSProperties;
  return (
    <div className={className} style={css}>
      {children}
    </div>
  );
}
DrawerFooter.displayName = 'DrawerFooter';

interface DrawerComponent {
  (props: DrawerWebProps): React.ReactElement | null;
  displayName?: string;
  Header: typeof DrawerHeader;
  Title: typeof DrawerTitle;
  Description: typeof DrawerDescription;
  Body: typeof DrawerBody;
  Footer: typeof DrawerFooter;
}

const Drawer = DrawerBase as unknown as DrawerComponent;
Drawer.displayName = 'Drawer';
Drawer.Header = DrawerHeader;
Drawer.Title = DrawerTitle;
Drawer.Description = DrawerDescription;
Drawer.Body = DrawerBody;
Drawer.Footer = DrawerFooter;

export {Drawer};
