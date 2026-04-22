import {colors} from '../../core/theme/tokens';
import type {StatusDotTone, StatusDotSize} from './types';

const SIZE_MAP = {
  sm: 20,
  default: 28,
  lg: 36,
} as const;

export function getStatusDotStyle(tone: StatusDotTone, size: StatusDotSize) {
  const dim = SIZE_MAP[size];

  const [bg, fg] =
    tone === 'success'
      ? [colors.successTint, colors.actionPrimary]
      : tone === 'danger'
      ? [colors.errorTint, colors.actionDanger]
      : tone === 'brand'
      ? [colors.section, colors.brand]
      : [colors.section, colors.textSecondary];

  return {
    container: {
      width: dim,
      height: dim,
      borderRadius: dim / 2,
      backgroundColor: bg,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    text: {
      color: fg,
      fontWeight: '700' as const,
      fontSize: size === 'sm' ? 12 : size === 'lg' ? 16 : 14,
    },
  };
}
