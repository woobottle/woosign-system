import {useState} from 'react';

/** Controlled values are authoritative; uncontrolled values retain local state. */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (next: T) => void] {
  const [local, setLocal] = useState(defaultValue);
  const current = value === undefined ? local : value;
  return [
    current,
    next => {
      if (value === undefined) {
        setLocal(next);
      }
      if (!Object.is(current, next)) {
        onChange?.(next);
      }
    },
  ];
}

export function normalizeRange(
  value: number,
  min: number,
  max: number,
  step: number,
): number {
  const lower = Number.isFinite(min) ? min : 0;
  const upper = Number.isFinite(max)
    ? Math.max(lower, max)
    : Math.max(lower, 100);
  const increment = Number.isFinite(step) && step > 0 ? step : 1;
  const safe = Number.isFinite(value) ? value : lower;
  const clamped = Math.min(upper, Math.max(lower, safe));
  return Math.min(
    upper,
    Math.max(
      lower,
      Number(
        (lower + Math.round((clamped - lower) / increment) * increment).toFixed(
          10,
        ),
      ),
    ),
  );
}
