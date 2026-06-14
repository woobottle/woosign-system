import {borderRadius, typography} from '../../core/theme/tokens';
import type {Colors} from '../../core/theme/types';
import type {ChipTone} from './types';

export function getChipStyles(c: Colors, tone: ChipTone) {
  const [bg, fg, border] =
    tone === 'solid'
      ? [c.inverse, c.textInverse, c.inverse]
      : tone === 'outline'
      ? ['transparent', c.actionPrimary, c.actionPrimary]
      : [c.card, c.textPrimary, c.borderDefault];

  return {
    container: {
      paddingLeft: 12,
      paddingRight: 12,
      paddingTop: 6,
      paddingBottom: 6,
      borderRadius: borderRadius.sm,
      borderWidth: 1,
      backgroundColor: bg,
      borderColor: border,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      gap: 6,
    },
    text: {
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.bodySm.size,
      fontWeight: typography.fontWeight.medium as '500',
      letterSpacing: typography.letterSpacing.tight,
      color: fg,
    },
  };
}
