import {typography} from '../../core/theme/tokens';
import type {Colors} from '../../core/theme/types';
import type {EyebrowTone} from './types';

export function getEyebrowStyle(c: Colors, tone: EyebrowTone) {
  const toneColor =
    tone === 'brand'
      ? c.actionPrimary
      : tone === 'gold'
      ? c.gold
      : tone === 'inverse'
      ? c.textInverseSecondary
      : c.textSecondary;

  return {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.caption.size,
    fontWeight: typography.fontWeight.semibold as '600',
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase' as const,
    color: toneColor,
  };
}
