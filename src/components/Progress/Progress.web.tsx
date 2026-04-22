import {forwardRef} from 'react';
import type {ProgressWebProps} from './types';
import {getProgressStyles, normalizeProgress} from './Progress.styles';

export const Progress = forwardRef<HTMLDivElement, ProgressWebProps>(
  function Progress(
    {
      value,
      max,
      tone = 'gold',
      surface = 'light',
      size = 'default',
      className,
      style,
      testID,
    },
    ref,
  ) {
    const pct = normalizeProgress(value, max);
    const {rail, fill} = getProgressStyles(tone, surface, size);
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max ?? 1}
        aria-valuenow={value}
        className={className}
        data-testid={testID}
        style={{...rail, ...style}}>
        <div style={{...fill, width: `${pct * 100}%`}} />
      </div>
    );
  },
);

Progress.displayName = 'Progress';
