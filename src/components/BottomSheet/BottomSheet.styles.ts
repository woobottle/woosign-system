import {
  borderRadius,
  typography,
  spacing,
  blackAlpha,
} from '../../core/theme/tokens';
import type {Colors} from '../../core/theme/types';

/** scrim(배경 dimmer) 색 — Dialog와 동일 값. */
export const SCRIM_COLOR = 'rgba(0, 0, 0, 0.5)';
/** grabber 핸들 크기(px). */
export const HANDLE_WIDTH = 36;
export const HANDLE_HEIGHT = 4;
/** 화면 높이 대비 시트 최대 높이 기본 비율. */
export const DEFAULT_MAX_HEIGHT_RATIO = 0.9;

/**
 * web/native가 공유하는 표면·핸들·섹션 스타일. 숫자/문자 값만 담아
 * web(cssify)·native(StyleSheet) 양쪽에서 그대로 쓴다.
 */
export function getBottomSheetStyles(c: Colors) {
  return {
    surface: {
      backgroundColor: c.card,
      borderTopLeftRadius: borderRadius.lg,
      borderTopRightRadius: borderRadius.lg,
      overflow: 'hidden' as const,
      width: '100%' as const,
    },
    handleArea: {
      alignItems: 'center' as const,
      paddingTop: spacing[3],
      paddingBottom: 0,
    },
    handle: {
      width: HANDLE_WIDTH,
      height: HANDLE_HEIGHT,
      borderRadius: borderRadius.pill,
      backgroundColor: blackAlpha['24'],
    },
    header: {
      paddingTop: spacing[4],
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
