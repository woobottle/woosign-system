import {borderRadius, typography} from '../../core/theme/tokens';
import type {Colors} from '../../core/theme/types';

export function getPillStyles(c: Colors, active: boolean) {
  return {
    container: {
      paddingLeft: 14,
      paddingRight: 14,
      paddingTop: 8,
      paddingBottom: 8,
      borderRadius: borderRadius.pill,
      borderWidth: 1,
      backgroundColor: active ? c.actionPrimary : c.card,
      borderColor: active ? c.actionPrimary : c.borderDefault,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      gap: 6,
    },
    text: {
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.caption.size,
      fontWeight: (active
        ? typography.fontWeight.semibold
        : typography.fontWeight.medium) as '500' | '600',
      color: active ? c.textInverse : c.textPrimary,
      letterSpacing: typography.letterSpacing.tight,
    },
  };
}
