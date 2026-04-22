import {forwardRef} from 'react';
import type {DividerWebProps} from './types';
import {getDividerStyle} from './Divider.styles';

export const Divider = forwardRef<HTMLDivElement, DividerWebProps>(
  function Divider(
    {tone = 'default', orientation = 'horizontal', className, style, testID},
    ref,
  ) {
    const base = getDividerStyle(tone, orientation === 'vertical');
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={className}
        data-testid={testID}
        style={{...base, ...style}}
      />
    );
  },
);

Divider.displayName = 'Divider';
