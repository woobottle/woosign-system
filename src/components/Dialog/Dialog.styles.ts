import {borderRadius, typography, spacing} from '../../core/theme/tokens';
import type {Colors} from '../../core/theme/types';
import type {DialogSize} from './types';

/** size → 표면 maxWidth(px). */
export const SIZE_MAX_WIDTH: Record<DialogSize, number> = {
  sm: 360,
  md: 440,
  lg: 560,
};

/** scrim(배경 dimmer) 색. */
export const SCRIM_COLOR = 'rgba(0, 0, 0, 0.5)';

/**
 * web/native가 공유하는 표면·섹션 스타일. 숫자/문자 값만 담아
 * web(cssify)·native(StyleSheet) 양쪽에서 그대로 쓴다.
 */
export function getDialogStyles(c: Colors) {
  return {
    surface: {
      backgroundColor: c.card,
      borderRadius: borderRadius.lg,
      overflow: 'hidden' as const,
      width: '100%' as const,
    },
    header: {
      paddingTop: spacing[6],
      paddingLeft: spacing[6],
      paddingRight: spacing[6],
      paddingBottom: spacing[2],
    },
    title: {
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.xl.size,
      lineHeight: typography.fontSize.xl.lineHeight,
      fontWeight: typography.fontWeight.semibold as '600',
      letterSpacing: typography.letterSpacing.tight,
      color: c.textPrimary,
    },
    description: {
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.bodySm.size,
      lineHeight: typography.fontSize.bodySm.lineHeight,
      color: c.textSecondary,
      letterSpacing: typography.letterSpacing.tight,
      marginTop: spacing[2],
    },
    body: {
      paddingTop: spacing[2],
      paddingLeft: spacing[6],
      paddingRight: spacing[6],
      paddingBottom: spacing[2],
    },
    footer: {
      paddingTop: spacing[4],
      paddingLeft: spacing[6],
      paddingRight: spacing[6],
      paddingBottom: spacing[6],
      flexDirection: 'row' as const,
      justifyContent: 'flex-end' as const,
      gap: spacing[3],
    },
  };
}
