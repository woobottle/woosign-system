import React from 'react';
import type {FeatureBandWebProps} from './types';
import {getFeatureBandStyle} from './FeatureBand.styles';
import {useResolvedColors} from '../../core/hooks';

export const FeatureBand = React.forwardRef<
  HTMLDivElement,
  FeatureBandWebProps
>(function FeatureBand(
  {tone = 'inverse', rounded = true, children, className, style, testID},
  ref,
) {
  const colors = useResolvedColors();
  const base = getFeatureBandStyle(colors, tone, rounded);
  // Ember tone uses the CSS gradient for a richer surface on web
  const gradient =
    tone === 'ember'
      ? {
          background: `linear-gradient(135deg, ${colors.actionPrimaryHover} 0%, ${colors.actionPrimary} 70%, ${colors.gold} 160%)`,
        }
      : {};
  const textColor = tone === 'reward' ? colors.textPrimary : colors.textInverse;
  return (
    <div
      ref={ref}
      className={className}
      data-testid={testID}
      style={{
        color: textColor,
        ...base,
        ...gradient,
        ...style,
      }}>
      {children}
    </div>
  );
});

FeatureBand.displayName = 'FeatureBand';
