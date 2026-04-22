import {forwardRef} from 'react';
import type {StatusDotWebProps} from './types';
import {getStatusDotStyle} from './StatusDot.styles';

export const StatusDot = forwardRef<HTMLSpanElement, StatusDotWebProps>(
  function StatusDot(
    {tone = 'neutral', size = 'default', children, className, style, testID},
    ref,
  ) {
    const {container, text} = getStatusDotStyle(tone, size);
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
