import React from 'react';
import type {StatusDotWebProps} from './types';
import {getStatusDotStyle} from './StatusDot.styles';
import {useResolvedColors} from '../../core/hooks';

export const StatusDot = React.forwardRef<HTMLSpanElement, StatusDotWebProps>(
  function StatusDot(
    {tone = 'neutral', size = 'default', children, className, style, testID},
    ref,
  ) {
    const colors = useResolvedColors();
    const {container, text} = getStatusDotStyle(colors, tone, size);
    return (
      <span
        ref={ref}
        className={className}
        data-testid={testID}
        style={{
          display: 'inline-flex',
          alignSelf: 'center',
          ...container,
          color: text.color,
          fontWeight: text.fontWeight,
          fontSize: text.fontSize,
          ...style,
        }}>
        {children}
      </span>
    );
  },
);

StatusDot.displayName = 'StatusDot';
