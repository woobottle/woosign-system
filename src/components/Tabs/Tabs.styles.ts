import {colors, typography} from '../../core/theme/tokens';

export function getTabsStyles(inverse: boolean) {
  const underline = inverse ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.08)';
  const inactiveColor = inverse
    ? colors.textInverseSecondary
    : colors.textSecondary;
  const activeColor = inverse ? colors.textInverse : colors.textBrand;

  return {
    rail: {
      flexDirection: 'row' as const,
      gap: 28,
      borderBottomWidth: 1,
      borderBottomColor: underline,
    },
    tab: {
      paddingTop: 8,
      paddingBottom: 8,
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
      marginBottom: -1,
    },
    tabActive: {
      borderBottomColor: activeColor,
    },
    label: {
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.bodySm.size,
      color: inactiveColor,
      fontWeight: typography.fontWeight.regular as '400',
      letterSpacing: typography.letterSpacing.tight,
    },
    labelActive: {
      color: activeColor,
      fontWeight: typography.fontWeight.semibold as '600',
    },
  };
}
