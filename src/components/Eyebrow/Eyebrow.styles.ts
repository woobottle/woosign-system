import {colors, typography} from '../../core/theme/tokens';
import type {EyebrowTone} from './types';

export function getEyebrowStyle(tone: EyebrowTone) {
  const toneColor =
    tone === 'brand'
      ? colors.actionPrimary
      : tone === 'gold'
      ? colors.gold
      : tone === 'inverse'
      ? colors.textInverseSecondary
      : colors.textSecondary;

  return {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.caption.size,
    fontWeight: typography.fontWeight.semibold as '600',
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase' as const,
    color: toneColor,
  };
}
