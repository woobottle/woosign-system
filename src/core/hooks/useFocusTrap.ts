import {useEffect, useRef} from 'react';
import type {RefObject} from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1);
}

/**
 * web 전용 포커스 트랩. active가 true가 되면 컨테이너 내부 첫 포커서블(없으면
 * 컨테이너 자신)로 포커스를 옮기고, Tab/Shift+Tab을 컨테이너 안에서 순환시키며,
 * 비활성화/언마운트 시 직전 포커스를 복원한다. native는 RN Modal/OS 접근성이
 * 처리하므로 이 훅은 web 오버레이에서만 쓴다(core/hooks 배럴에 미포함).
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
): void {
  const previousRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    previousRef.current = document.activeElement as HTMLElement | null;

    const focusables = getFocusable(container);
    if (focusables.length > 0) {
      focusables[0].focus();
    } else {
      container.tabIndex = -1;
      container.focus();
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const els = getFocusable(container);
      if (els.length === 0) {
        e.preventDefault();
        container.focus();
        return;
      }
      const first = els[0];
      const last = els[els.length - 1];
      const activeEl = document.activeElement;
      const inside = container.contains(activeEl);
      if (e.shiftKey) {
        if (activeEl === first || !inside) {
          e.preventDefault();
          last.focus();
        }
      } else if (activeEl === last || !inside) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previousRef.current?.focus();
    };
  }, [active, containerRef]);
}
