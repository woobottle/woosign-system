import {spacing, borderRadius, typography} from '../../core/theme/tokens';
import type {Colors} from '../../core/theme/types';

/** 사이즈별 외곽/점 치수. */
export const radioDimensions = {
  sm: {outer: 16, dot: 6, fontSize: typography.fontSize.sm.size},
  default: {outer: 20, dot: 8, fontSize: typography.fontSize.sm.size},
  lg: {outer: 24, dot: 10, fontSize: typography.fontSize.base.size},
} as const;

export const containerGap = spacing[2];
export const disabledStyle = {opacity: 0.5};

export function getRadioStyles(c: Colors) {
  return {
    outerBase: {
      borderRadius: borderRadius.full,
      borderWidth: 2,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    outerUnchecked: {
      backgroundColor: c.card,
      borderColor: c.borderDefault,
    },
    outerChecked: {
      backgroundColor: c.card,
      borderColor: c.actionPrimary,
    },
    dot: {
      borderRadius: borderRadius.full,
      backgroundColor: c.actionPrimary,
    },
    label: {
      color: c.foreground,
      fontWeight: typography.fontWeight.medium as '500',
    },
  };
}
