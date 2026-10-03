import {useEffect, useRef, useState} from 'react';

/** Client-only portal positioning and dismissal; restores focus for modal-like popups. */
export function useAnchoredOverlay(
  open: boolean,
  onClose: () => void,
  restoreFocus = true,
) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const skipRestoreRef = useRef(false);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    maxHeight: number;
  } | null>(null);
  useEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }
    skipRestoreRef.current = false;
    const update = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect) {
        const height = Math.min(360, Math.max(100, window.innerHeight - 32));
        const below = window.innerHeight - rect.bottom - 12;
        const top =
          below >= Math.min(180, height)
            ? rect.bottom + 6
            : Math.max(8, rect.top - height - 6);
        setPosition({
          top,
          left: Math.max(8, Math.min(rect.left, window.innerWidth - 328)),
          maxHeight: Math.max(80, window.innerHeight - top - 8),
        });
      }
    };
    const dismiss = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !surfaceRef.current?.contains(target)
      ) {
        closeRef.current();
      }
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRef.current();
      }
    };
    update();
    document.addEventListener('mousedown', dismiss);
    document.addEventListener('keydown', escape);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    const trigger = triggerRef.current;
    return () => {
      document.removeEventListener('mousedown', dismiss);
      document.removeEventListener('keydown', escape);
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
      if (restoreFocus && !skipRestoreRef.current && trigger?.isConnected) {
        trigger.focus();
      }
    };
  }, [open, restoreFocus]);
  return {
    triggerRef,
    surfaceRef,
    skipRestoreRef,
    position,
    visible: open && position !== null,
  };
}
