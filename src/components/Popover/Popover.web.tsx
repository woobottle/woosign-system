import {useResolvedColors} from '../../core/hooks';
import {createPortal} from 'react-dom';
import {useControllableState} from '../_shared/state';
import {useAnchoredOverlay} from '../_shared/useAnchoredOverlay';
import {useFocusTrap} from '../../core/hooks/useFocusTrap';
import type {PopoverWebProps} from './types';
export function Popover({
  trigger,
  label,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled,
  testID,
  style,
  className,
}: PopoverWebProps) {
  const c = useResolvedColors();
  const [expanded, setExpanded] = useControllableState(
    open,
    defaultOpen,
    onOpenChange,
  );
  const {triggerRef, surfaceRef, position, visible} = useAnchoredOverlay(
    expanded && !disabled,
    () => setExpanded(false),
  );
  useFocusTrap(surfaceRef, visible);
  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={expanded && !disabled}
        aria-label={label}
        data-testid={testID}
        className={className}
        onClick={event => {
          event.currentTarget.focus();
          setExpanded(!expanded);
        }}
        style={{
          padding: '10px 16px',
          borderRadius: 999,
          border: `1px solid ${c.borderDefault}`,
          backgroundColor: c.card,
          color: c.textPrimary,
        }}>
        {trigger}
      </button>
      {visible &&
        createPortal(
          <div
            ref={surfaceRef}
            role="dialog"
            aria-label={label}
            tabIndex={-1}
            style={{
              position: 'fixed',
              zIndex: 1100,
              top: position!.top,
              left: position!.left,
              maxHeight: position!.maxHeight,
              width: 308,
              maxWidth: 'calc(100vw - 16px)',
              overflow: 'auto',
              padding: 12,
              boxSizing: 'border-box',
              borderRadius: 12,
              border: `1px solid ${c.borderDefault}`,
              backgroundColor: c.popover,
              color: c.popoverForeground,
              boxShadow: '0 8px 24px rgba(0,0,0,.12)',
              ...style,
            }}>
            {children}
            <button
              type="button"
              aria-label="닫기"
              onClick={() => setExpanded(false)}
              style={{
                display: 'block',
                marginTop: 8,
                borderRadius: 999,
                border: 0,
                backgroundColor: c.section,
                color: c.textPrimary,
                padding: '8px 14px',
              }}>
              닫기
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}
