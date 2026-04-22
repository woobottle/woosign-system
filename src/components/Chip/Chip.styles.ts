import {colors, borderRadius, typography} from '../../core/theme/tokens';
import type {ChipTone} from './types';

export function getChipStyles(tone: ChipTone) {
  const [bg, fg, border] =
    tone === 'solid'
      ? [colors.inverse, colors.textInverse, colors.inverse]
      : tone === 'outline'
      ? ['transparent', colors.actionPrimary, colors.actionPrimary]
      : [colors.card, colors.textPrimary, colors.borderDefault];

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
