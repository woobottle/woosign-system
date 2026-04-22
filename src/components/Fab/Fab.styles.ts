import {colors, shadows} from '../../core/theme/tokens';
import type {FabTone, FabSize} from './types';

export function getFabStyle(tone: FabTone, size: FabSize) {
  const dim = size === 'lg' ? 64 : 56;
  const bg =
    tone === 'ink'
      ? colors.inverse
      : tone === 'gold'
      ? colors.gold
      : colors.actionPrimary;

  return {
    width: dim,
    height: dim,
    borderRadius: dim / 2,
    backgroundColor: bg,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    ...shadows.floating,
  };
}
