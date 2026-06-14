import React, {forwardRef} from 'react';
import type {EyebrowWebProps} from './types';
import {getEyebrowStyle} from './Eyebrow.styles';
import {useResolvedColors} from '../../core/hooks';

export const Eyebrow = forwardRef<HTMLElement, EyebrowWebProps>(
  function Eyebrow(
    {
      tone = 'default',
      children,
      className,
      style,
      testID,
      as: Element = 'span',
    },
    ref,
  ) {
    const colors = useResolvedColors();
    const base = getEyebrowStyle(colors, tone);
    // Web uses `em`-based tracking for crisper kerning at any size
    const webStyle: React.CSSProperties = {
      ...base,
      letterSpacing: '0.1em',
    };
    return React.createElement(
      Element,
      {
        ref,
        className,
        'data-testid': testID,
        style: {...webStyle, ...style},
      },
      children,
    );
  },
);

Eyebrow.displayName = 'Eyebrow';
