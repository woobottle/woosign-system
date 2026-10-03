import {useEffect, useMemo, useState} from 'react';
import {useControllableState} from './state';

/** Strict local-date parsing: reject normalized impossible dates and timezone shifts. */
export function parseDate(value?: string): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(0);
  date.setHours(0, 0, 0, 0);
  date.setFullYear(year, month - 1, day);
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : null;
}
export function formatDate(date: Date): string {
  return `${String(date.getFullYear()).padStart(4, '0')}-${String(
    date.getMonth() + 1,
  ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function monthDays(month: Date): string[] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  return Array.from({length: 42}, (_, i) =>
    formatDate(
      new Date(month.getFullYear(), month.getMonth(), i + 1 - first.getDay()),
    ),
  );
}
export interface CalendarStateProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  defaultMonth?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  isDateDisabled?: (date: string) => boolean;
}
export function useCalendar(props: CalendarStateProps) {
  const {
    value,
    defaultValue = '',
    onValueChange,
    defaultMonth,
    min,
    max,
    disabled,
    isDateDisabled,
  } = props;
  const [selected, setSelected] = useControllableState(
    value,
    defaultValue,
    onValueChange,
  );
  const [month, setMonth] = useState(
    () => parseDate(selected) ?? parseDate(defaultMonth) ?? new Date(),
  );
  useEffect(() => {
    const date = parseDate(value);
    if (date) {
      setMonth(date);
    }
  }, [value]);
  const days = useMemo(() => monthDays(month), [month]);
  const blocked = (date: string) =>
    !!disabled ||
    !parseDate(date) ||
    (!!parseDate(min) && date < min!) ||
    (!!parseDate(max) && date > max!) ||
    !!isDateDisabled?.(date);
  const select = (date: string) => {
    if (!blocked(date)) {
      setSelected(date);
      if (date === selected) {
        onValueChange?.(date);
      }
    }
  };
  const shiftMonth = (delta: number) =>
    setMonth(
      current => new Date(current.getFullYear(), current.getMonth() + delta, 1),
    );
  return {selected, select, month, setMonth, shiftMonth, days, blocked};
}
