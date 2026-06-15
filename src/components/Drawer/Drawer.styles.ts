import {typography, spacing} from '../../core/theme/tokens';
import {SCRIM_COLOR} from '../BottomSheet/BottomSheet.styles';
import type {Colors} from '../../core/theme/types';

// scrim 색은 BottomSheet와 동일 값 — 단일 출처에서 재사용한다.
export {SCRIM_COLOR};
/** 패널 기본 폭(px). */
export const DEFAULT_WIDTH = 320;
/** native 진입 슬라이드 길이(ms). */
export const DRAWER_ANIM_MS = 200;

/**
 * web/native가 공유하는 표면·섹션 스타일. 숫자/문자 값만 담아 web(cssify)·
 * native(StyleSheet) 양쪽에서 그대로 쓴다. 폭/높이는 컴포넌트가 인라인으로 준다.
 */
export function getDrawerStyles(c: Colors) {
  return {
    surface: {
      backgroundColor: c.card,
      overflow: 'hidden' as const,
    },
    header: {
      paddingTop: spacing[5],
      paddingLeft: spacing[6],
      paddingRight: spacing[6],
      paddingBottom: spacing[3],
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
      paddingBottom: spacing[4],
    },
    footer: {
      paddingTop: spacing[4],
      paddingLeft: spacing[6],
      paddingRight: spacing[6],
      paddingBottom: spacing[6],
      gap: spacing[3],
    },
  };
}
