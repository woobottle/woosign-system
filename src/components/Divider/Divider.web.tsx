import React from 'react';
import type {DividerWebProps} from './types';
import {getDividerStyle} from './Divider.styles';
import {useResolvedColors} from '../../core/hooks';

export const Divider = React.forwardRef<HTMLDivElement, DividerWebProps>(
  function Divider(
    {tone = 'default', orientation = 'horizontal', className, style, testID},
    ref,
  ) {
    const colors = useResolvedColors();
    const base = getDividerStyle(colors, tone, orientation === 'vertical');
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
