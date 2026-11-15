export const carouselText = {
  previous: '이전 슬라이드',
  next: '다음 슬라이드',
  goTo: (n: number) => `${n}번 슬라이드로 이동`,
  slide: (n: number, total: number) => `${n} / ${total}`,
};

export function clampIndex(index: number, count: number): number {
  if (count <= 0) {
    return 0;
  }
  return Math.min(count - 1, Math.max(0, Math.round(index)));
}

/** Slide index for a scroll offset, or null before the width is known. */
export function indexFromOffset(
  offset: number,
  width: number,
  count: number,
): number | null {
  if (width <= 0) {
    return null;
  }
  return clampIndex(offset / width, count);
}
