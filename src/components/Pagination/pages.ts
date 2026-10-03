export function pageItems(current: number, total: number): (number | 'gap')[] {
  const pages = [
    ...new Set(
      [1, total, current - 1, current, current + 1].filter(
        n => n >= 1 && n <= total,
      ),
    ),
  ].sort((a, b) => a - b);
  const result: (number | 'gap')[] = [];
  pages.forEach((n, i) => {
    if (i && n - pages[i - 1] > 1) {
      result.push('gap');
    }
    result.push(n);
  });
  return result;
}
