import {useResolvedColors} from '../../core/hooks';
import {useEffect, useRef} from 'react';
import {createPortal} from 'react-dom';
import {useControllableState} from '../_shared/state';
import {useAnchoredOverlay} from '../_shared/useAnchoredOverlay';
import type {DropdownMenuWebProps} from './types';
export function DropdownMenu({
  trigger,
  label,
  items,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled,
  testID,
  style,
  className,
}: DropdownMenuWebProps) {
  const c = useResolvedColors();
  const [expanded, setExpanded] = useControllableState(
    open,
    defaultOpen,
    onOpenChange,
  );
  const {triggerRef, surfaceRef, position, visible, skipRestoreRef} =
    useAnchoredOverlay(expanded && !disabled, () => setExpanded(false));
  const initialLast = useRef(false);
  useEffect(() => {
    if (visible) {
      const buttons = Array.from(
        surfaceRef.current?.querySelectorAll<HTMLButtonElement>(
          'button:not(:disabled)',
        ) ?? [],
      );
      const target = initialLast.current
        ? buttons[buttons.length - 1]
        : buttons[0];
      (target ?? surfaceRef.current)?.focus();
    }
  }, [visible, surfaceRef]);
  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={expanded && !disabled}
        aria-label={label}
        data-testid={testID}
        className={className}
        onClick={event => {
          event.currentTarget.focus();
          initialLast.current = false;
          setExpanded(!expanded);
        }}
        onKeyDown={event => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            initialLast.current = event.key === 'ArrowUp';
            setExpanded(true);
          }
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
            role="menu"
            aria-label={label}
            tabIndex={-1}
            onKeyDown={event => {
              const buttons = Array.from(
                surfaceRef.current?.querySelectorAll<HTMLButtonElement>(
                  'button:not(:disabled)',
                ) ?? [],
              );
              const index = buttons.indexOf(
                document.activeElement as HTMLButtonElement,
              );
              let next;
              if (event.key === 'ArrowDown') {
                next = (index + 1) % buttons.length;
              } else if (event.key === 'ArrowUp') {
                next = (index - 1 + buttons.length) % buttons.length;
              } else if (event.key === 'Home') {
                next = 0;
              } else if (event.key === 'End') {
                next = buttons.length - 1;
              } else if (event.key === 'Tab') {
                event.preventDefault();
                const focusable = Array.from(
                  document.querySelectorAll<HTMLElement>(
                    'button:not(:disabled), a[href], input:not(:disabled):not([type="hidden"]), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
                  ),
                ).filter(
                  element =>
                    !surfaceRef.current?.contains(element) &&
                    !element.closest('[hidden]'),
                );
                const triggerIndex = focusable.indexOf(triggerRef.current!);
                const destination =
                  focusable[triggerIndex + (event.shiftKey ? -1 : 1)];
                skipRestoreRef.current = true;
                setExpanded(false);
                (destination ?? triggerRef.current)?.focus();
                return;
              } else if (
                event.key.length === 1 &&
                !event.ctrlKey &&
                !event.metaKey
              ) {
                const rotated = [
                  ...buttons.slice(index + 1),
                  ...buttons.slice(0, index + 1),
                ];
                rotated
                  .find(button =>
                    button.textContent
                      ?.toLocaleLowerCase()
                      .startsWith(event.key.toLocaleLowerCase()),
                  )
                  ?.focus();
                return;
              } else {
                return;
              }
              event.preventDefault();
              buttons[next]?.focus();
            }}
            style={{
              position: 'fixed',
              top: position!.top,
              left: position!.left,
              zIndex: 1100,
              width: 240,
              maxWidth: 'calc(100vw - 16px)',
              maxHeight: position!.maxHeight,
              overflow: 'auto',
              padding: 8,
              borderRadius: 12,
              backgroundColor: c.popover,
              border: `1px solid ${c.borderDefault}`,
              ...style,
            }}>
            {items.map(item => (
              <button
                key={item.value}
                role="menuitem"
                tabIndex={-1}
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  setExpanded(false);
                  item.onSelect?.();
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 14px',
                  border: 0,
                  borderRadius: 999,
                  background: 'transparent',
                  color: item.destructive ? c.actionDanger : c.textPrimary,
                  opacity: item.disabled ? 0.5 : 1,
                }}>
                {item.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
