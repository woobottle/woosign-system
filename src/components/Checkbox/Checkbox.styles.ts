import {spacing, borderRadius, typography} from '../../core/theme/tokens';
import type {Colors} from '../../core/theme/types';

/** 사이즈별 박스/글리프 치수. */
export const checkboxDimensions = {
  sm: {box: 16, glyph: 11, fontSize: typography.fontSize.sm.size},
  default: {box: 20, glyph: 13, fontSize: typography.fontSize.sm.size},
  lg: {box: 24, glyph: 16, fontSize: typography.fontSize.base.size},
} as const;

export const containerGap = spacing[2];
export const disabledStyle = {opacity: 0.5};

/** web/native 공유 색 스타일(테마 의존). 치수는 컴포넌트가 인라인으로 합친다. */
export function getCheckboxStyles(c: Colors) {
  return {
    boxBase: {
      borderRadius: borderRadius.sm,
      borderWidth: 2,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    boxUnchecked: {
      backgroundColor: c.card,
      borderColor: c.borderDefault,
    },
    boxChecked: {
      backgroundColor: c.actionPrimary,
      borderColor: c.actionPrimary,
    },
    glyph: {
      color: c.textInverse,
      fontWeight: typography.fontWeight.semibold as '600',
    },
    label: {
      color: c.foreground,
      fontWeight: typography.fontWeight.medium as '500',
    },
  };
}
