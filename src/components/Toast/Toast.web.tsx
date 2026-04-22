import {forwardRef} from 'react';
import type {ToastWebProps} from './types';
import {getToastStyles, getDefaultGlyph} from './Toast.styles';
import {StatusDot} from '../StatusDot';
import {shadowsCss} from '../../core/theme/tokens';

export const Toast = forwardRef<HTMLDivElement, ToastWebProps>(function Toast(
  {
    tone = 'neutral',
    title,
    description,
    glyph,
    hideIcon = false,
    className,
    style,
    testID,
  },
  ref,
) {
  const s = getToastStyles();
  return (
    <div
      ref={ref}
      role="status"
      className={className}
      data-testid={testID}
      style={{
        display: 'flex',
        boxShadow: shadowsCss.floating,
        ...s.container,
        ...style,
      }}>
      {!hideIcon ? (
        <StatusDot tone={tone} size="default">
          {glyph ?? getDefaultGlyph(tone)}
        </StatusDot>
      ) : null}
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <span style={s.title}>{title}</span>
        {description ? (
          <span style={s.description}>{description}</span>
        ) : null}
      </div>
    </div>
  );
});

Toast.displayName = 'Toast';
