/**
 * 드래그 릴리스 시 시트를 닫을지 판정하는 공유 순수 함수.
 * web(Pointer Events)과 native(PanResponder)가 동일 기준을 쓴다.
 */

/** 시트 높이 대비 닫힘 거리 비율. */
export const DISMISS_DISTANCE_RATIO = 0.25;
/** 시트 높이를 측정할 수 없을 때(jsdom 등) 쓰는 절대 거리 임계값(px). */
export const DISMISS_FALLBACK_DISTANCE = 120;
/** 플릭 판정 속도 임계값(px/ms). */
export const DISMISS_VELOCITY = 0.5;
/** 플릭으로 닫히기 위한 최소 하강 거리(px) — 미세한 빠른 떨림 오판 방지. */
export const FLICK_MIN_DISTANCE = 24;

/**
 * @param dy 누적 하강 거리(px, 0 이상)
 * @param vy 릴리스 시점 하강 속도(px/ms, 0 이상)
 * @param sheetHeight 시트 표면 높이(px). 0 이하면 fallback 절대 거리 사용.
 */
export function shouldDismiss(
  dy: number,
  vy: number,
  sheetHeight: number,
): boolean {
  const distanceThreshold =
    sheetHeight > 0
      ? sheetHeight * DISMISS_DISTANCE_RATIO
      : DISMISS_FALLBACK_DISTANCE;
  if (dy > distanceThreshold) return true;
  return vy > DISMISS_VELOCITY && dy >= FLICK_MIN_DISTANCE;
}
