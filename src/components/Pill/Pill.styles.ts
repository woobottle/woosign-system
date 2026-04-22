import {colors, borderRadius, typography} from '../../core/theme/tokens';

export function getPillStyles(active: boolean) {
  return {
    container: {
      paddingLeft: 14,
      paddingRight: 14,
      paddingTop: 8,
      paddingBottom: 8,
      borderRadius: borderRadius.pill,
      borderWidth: 1,
      backgroundColor: active ? colors.actionPrimary : colors.card,
      borderColor: active ? colors.actionPrimary : colors.borderDefault,
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
      color: active ? colors.textInverse : colors.textPrimary,
      letterSpacing: typography.letterSpacing.tight,
    },
  };
}
