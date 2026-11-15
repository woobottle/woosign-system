import {Children, useEffect, useRef} from 'react';
import type {CSSProperties} from 'react';
import {useResolvedColors} from '../../core/hooks';
import {useControllableState} from '../_shared/state';
import {carouselText, clampIndex, indexFromOffset} from './Carousel.shared';
import type {CarouselWebProps} from './types';

export function Carousel({
  children,
  index,
  defaultIndex = 0,
  onIndexChange,
  showControls = true,
  showIndicators = true,
  label,
  testID,
  style,
  className,
}: CarouselWebProps) {
  const c = useResolvedColors();
  const slides = Children.toArray(children);
  const count = slides.length;
  const [rawCurrent, setCurrent] = useControllableState(
    index,
    defaultIndex,
    onIndexChange,
  );
  const current = clampIndex(rawCurrent, count);
  const track = useRef<HTMLDivElement>(null);
  // Target of a programmatic scroll. Scroll events fired on the way there
  // pass through other slides and must not overwrite the index.
  const pending = useRef<number | null>(null);
  const pendingTimer = useRef<ReturnType<typeof setTimeout>>();

  // Keep the scroll position in sync when the index changes from outside
  // (buttons, dots, keyboard or a controlled prop).
  useEffect(() => {
    const el = track.current;
    if (!el) {
      return;
    }
    const visible = indexFromOffset(el.scrollLeft, el.clientWidth, count);
    if (visible !== null && visible !== current) {
      const reduce =
        typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      pending.current = current;
      clearTimeout(pendingTimer.current);
      // Fallback if the animation is interrupted before reaching the target.
      pendingTimer.current = setTimeout(() => {
        pending.current = null;
      }, 1000);
      el.scrollTo?.({
        left: current * el.clientWidth,
        behavior: reduce ? 'auto' : 'smooth',
      });
    }
  }, [current, count]);

  useEffect(() => () => clearTimeout(pendingTimer.current), []);

  const go = (next: number) => {
    const target = clampIndex(next, count);
    if (target !== current) {
      setCurrent(target);
    }
  };

  const control = (disabled: boolean): CSSProperties => ({
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 40,
    height: 40,
    borderRadius: 999,
    border: `1px solid ${c.borderDefault}`,
    backgroundColor: c.card,
    color: c.textPrimary,
    fontSize: 20,
    lineHeight: 1,
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.4 : 1,
  });

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      data-testid={testID}
      className={className}
      onKeyDown={event => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          go(current - 1);
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          go(current + 1);
        }
      }}
      style={{position: 'relative', ...style}}>
      <div
        ref={track}
        tabIndex={0}
        aria-live="polite"
        onScroll={event => {
          const el = event.currentTarget;
          if (pending.current !== null) {
            const target = pending.current * el.clientWidth;
            if (Math.abs(el.scrollLeft - target) < 2) {
              pending.current = null;
            }
            return;
          }
          const visible = indexFromOffset(el.scrollLeft, el.clientWidth, count);
          if (visible !== null && visible !== current) {
            setCurrent(visible);
          }
        }}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          borderRadius: 16,
          outlineOffset: 2,
        }}>
        {slides.map((slide, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={carouselText.slide(i + 1, count)}
            aria-hidden={i !== current}
            style={{
              flex: '0 0 100%',
              minWidth: 0,
              scrollSnapAlign: 'start',
            }}>
            {slide}
          </div>
        ))}
      </div>
      {showControls && count > 1 ? (
        <>
          <button
            type="button"
            aria-label={carouselText.previous}
            disabled={current === 0}
            onClick={() => go(current - 1)}
            style={{...control(current === 0), left: 12}}>
            ‹
          </button>
          <button
            type="button"
            aria-label={carouselText.next}
            disabled={current === count - 1}
            onClick={() => go(current + 1)}
            style={{...control(current === count - 1), right: 12}}>
            ›
          </button>
        </>
      ) : null}
      {showIndicators && count > 1 ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            marginTop: 12,
          }}>
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={carouselText.goTo(i + 1)}
              aria-current={i === current ? 'true' : undefined}
              onClick={() => go(i)}
              style={{
                width: i === current ? 20 : 8,
                height: 8,
                padding: 0,
                border: 0,
                borderRadius: 999,
                cursor: 'pointer',
                backgroundColor:
                  i === current ? c.actionPrimary : c.borderDefault,
                transition: 'width 160ms ease',
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
