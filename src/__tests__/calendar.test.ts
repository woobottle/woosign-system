import {parseDate, formatDate, monthDays} from '../components/_shared/calendar';
import {normalizeRange} from '../components/_shared/state';
it('rejects impossible dates and preserves leap days and local dates', () => {
  expect(parseDate('2026-02-29')).toBeNull();
  expect(parseDate('2026-13-01')).toBeNull();
  expect(parseDate('2026-1-01')).toBeNull();
  expect(formatDate(parseDate('2024-02-29')!)).toBe('2024-02-29');
  expect(monthDays(parseDate('2026-10-01')!)).toHaveLength(42);
});
it('clamps range values and rounds from the minimum without floating point artifacts', () => {
  expect(normalizeRange(200, 0, 100, 1)).toBe(100);
  expect(normalizeRange(-1, 0, 100, 1)).toBe(0);
  expect(normalizeRange(0.29, 0.1, 1, 0.1)).toBe(0.3);
  expect(normalizeRange(NaN, 5, 10, 0)).toBe(5);
});
