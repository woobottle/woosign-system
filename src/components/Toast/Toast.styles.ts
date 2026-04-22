import {colors, borderRadius, typography, shadows} from '../../core/theme/tokens';
import type {ToastTone} from './types';

const DEFAULT_GLYPH: Record<ToastTone, string> = {
  success: '✓',
  danger: '!',
  brand: '★',
  neutral: '·',
};

export function getToastStyles() {
  return {
    container: {
      backgroundColor: colors.card,
      borderRadius: borderRadius.md,
      paddingTop: 14,
      paddingBottom: 14,
      paddingLeft: 16,
      paddingRight: 16,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 12,
      ...shadows.floating,
    },
    title: {
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.bodySm.size,
      fontWeight: typography.fontWeight.semibold as '600',
      letterSpacing: typography.letterSpacing.tight,
      color: colors.textPrimary,
    },
    description: {
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.caption.size,
      color: colors.textSecondary,
      letterSpacing: typography.letterSpacing.tight,
      marginTop: 2,
    },
  };
}

export function getDefaultGlyph(tone: ToastTone): string {
  return DEFAULT_GLYPH[tone];
}
