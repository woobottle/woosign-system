import {useResolvedColors} from '../../core/hooks';
import {useState} from 'react';
import {createPortal} from 'react-dom';
import {useAnchoredOverlay} from '../_shared/useAnchoredOverlay';
import type {TooltipWebProps} from './types';
export function Tooltip({
  id,
  trigger,
  content,
  disabled,
  testID,
  style,
  className,
}: TooltipWebProps) {
  const c = useResolvedColors();
  const [open, setOpen] = useState(false);
  const {triggerRef, surfaceRef, position, visible} = useAnchoredOverlay(
    open && !disabled,
    () => setOpen(false),
    false,
  );
  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        disabled={disabled}
        aria-describedby={visible ? id : undefined}
        data-testid={testID}
        className={className}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={event => {
          if (
            !(
              event.relatedTarget instanceof Node &&
              surfaceRef.current?.contains(event.relatedTarget)
            )
          ) {
            setOpen(false);
          }
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen(true)}
        style={{
          borderRadius: 999,
          border: `1px solid ${c.borderDefault}`,
          padding: '8px 12px',
          backgroundColor: c.card,
          color: c.textPrimary,
        }}>
        {trigger}
      </button>
      {visible &&
        createPortal(
          <div
            ref={surfaceRef}
            role="tooltip"
            id={id}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            style={{
              position: 'fixed',
              zIndex: 1200,
              top: position!.top,
              left: position!.left,
              maxWidth: 'min(308px, calc(100vw - 16px))',
              padding: '8px 12px',
              borderRadius: 8,
              backgroundColor: c.inverse,
              color: c.textInverse,
              ...style,
            }}>
            {content}
          </div>,
          document.body,
        )}
    </>
  );
}
