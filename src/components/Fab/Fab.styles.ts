import {shadows} from '../../core/theme/tokens';
import type {Colors} from '../../core/theme/types';
import type {FabTone, FabSize} from './types';

export function getFabStyle(c: Colors, tone: FabTone, size: FabSize) {
  const dim = size === 'lg' ? 64 : 56;
  const bg =
    tone === 'ink' ? c.inverse : tone === 'gold' ? c.gold : c.actionPrimary;

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
