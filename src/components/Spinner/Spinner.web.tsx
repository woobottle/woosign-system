import {useEffect, useState} from 'react';
import {useResolvedColors} from '../../core/hooks';
import type {SpinnerWebProps} from './types';
export function Spinner({
  size = 24,
  label = '불러오는 중',
  testID,
  style,
  className,
}: SpinnerWebProps) {
  const c = useResolvedColors();
  const [reducedMotion, setReducedMotion] = useState(true);
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!query) {
      setReducedMotion(false);
      return;
    }
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);
  return (
    <span
      role="status"
      aria-label={label}
      data-testid={testID}
      className={className}
      style={{display: 'inline-flex', width: size, height: size, ...style}}>
      <svg aria-hidden="true" viewBox="0 0 24 24" width="100%" height="100%">
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke={c.section}
          strokeWidth="3"
        />
        <path
          d="M12 3a9 9 0 0 1 9 9"
          fill="none"
          stroke={c.actionPrimary}
          strokeWidth="3"
          strokeLinecap="round">
          {!reducedMotion && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 12 12"
              to="360 12 12"
              dur="1s"
              repeatCount="indefinite"
            />
          )}
        </path>
      </svg>
    </span>
  );
}
