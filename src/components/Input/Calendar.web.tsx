/**
 * Calendar — Web-only month grid used by Input(type='date').
 *
 * Self-contained: no deps beyond design tokens. YYYY-MM-DD strings in/out
 * so it can drop into the same value contract as <input type="date">.
 */

import React, {useMemo, useState, useEffect} from 'react';
import {
  colors,
  spacing,
  borderRadius,
  typography,
  shadowsCss,
} from '../../core/theme/tokens';

export interface CalendarProps {
  /** Selected date in YYYY-MM-DD */
  value?: string;
  /** Called with YYYY-MM-DD on selection */
  onChange?: (value: string) => void;
  /** Earliest selectable date (YYYY-MM-DD) */
  min?: string;
  /** Latest selectable date (YYYY-MM-DD) */
  max?: string;
  /** Locale weekday labels: 'ko' (default) → 일월화수목금토, 'en' → S M T W T F S */
  locale?: 'ko' | 'en';
  style?: React.CSSProperties;
}

const WEEKDAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];
const WEEKDAYS_EN = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function parseDate(value?: string): Date | null {
  if (!value) {
    return null;
  }
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) {
    return null;
  }
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function Calendar({
  value,
  onChange,
  min,
  max,
  locale = 'ko',
  style,
}: CalendarProps) {
  const selected = useMemo(() => parseDate(value), [value]);
  const minDate = useMemo(() => parseDate(min), [min]);
  const maxDate = useMemo(() => parseDate(max), [max]);

  const initialView = selected ?? new Date();
  const [viewYear, setViewYear] = useState(initialView.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialView.getMonth());

  useEffect(() => {
    if (selected) {
      setViewYear(selected.getFullYear());
      setViewMonth(selected.getMonth());
    }
  }, [selected]);

  const today = startOfDay(new Date());

  const days = useMemo(() => {
    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const startDayOfWeek = firstOfMonth.getDay();
    const gridStart = new Date(viewYear, viewMonth, 1 - startDayOfWeek);
    const result: Date[] = [];
    for (let i = 0; i < 42; i++) {
      result.push(
        new Date(
          gridStart.getFullYear(),
          gridStart.getMonth(),
          gridStart.getDate() + i,
        ),
      );
    }
    return result;
  }, [viewYear, viewMonth]);

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  const isDisabled = (d: Date) => {
    if (minDate && d < minDate) {
      return true;
    }
    if (maxDate && d > maxDate) {
      return true;
    }
    return false;
  };

  const weekdays = locale === 'en' ? WEEKDAYS_EN : WEEKDAYS_KO;
  const monthLabel =
    locale === 'en'
      ? `${
          [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ][viewMonth]
        } ${viewYear}`
      : `${viewYear}년 ${viewMonth + 1}월`;

  return (
    <div
      style={{
        backgroundColor: colors.popover,
        borderRadius: borderRadius.md,
        boxShadow: shadowsCss.floating,
        border: `1px solid ${colors.borderDefault}`,
        padding: spacing[3],
        width: 280,
        fontFamily: typography.fontFamily.sans,
        boxSizing: 'border-box',
        ...style,
      }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing[2],
        }}>
        <button
          type="button"
          onClick={goPrevMonth}
          style={navButtonStyle}
          aria-label="Previous month">
          ‹
        </button>
        <div
          style={{
            fontSize: typography.fontSize.bodyMd.size,
            fontWeight: typography.fontWeight.semibold,
            color: colors.textPrimary,
            letterSpacing: typography.letterSpacing.tight,
          }}>
          {monthLabel}
        </div>
        <button
          type="button"
          onClick={goNextMonth}
          style={navButtonStyle}
          aria-label="Next month">
          ›
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          marginBottom: spacing[1],
        }}>
        {weekdays.map((w, i) => (
          <div
            key={`${w}-${i}`}
            style={{
              textAlign: 'center',
              fontSize: typography.fontSize.caption.size,
              color:
                i === 0
                  ? colors.actionDanger
                  : i === 6
                  ? colors.actionForest
                  : colors.textSecondary,
              padding: spacing[1],
              fontWeight: typography.fontWeight.medium,
            }}>
            {w}
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 2,
        }}>
        {days.map((d, idx) => {
          const isCurrentMonth = d.getMonth() === viewMonth;
          const isToday = isSameDay(d, today);
          const isSelected = !!(selected && isSameDay(d, selected));
          const disabled = isDisabled(d);
          const dayOfWeek = d.getDay();

          const baseColor = !isCurrentMonth
            ? colors.textTertiary
            : disabled
            ? colors.textTertiary
            : dayOfWeek === 0
            ? colors.actionDanger
            : dayOfWeek === 6
            ? colors.actionForest
            : colors.textPrimary;

          return (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onChange?.(formatDate(d))}
              onMouseEnter={e => {
                if (!disabled && !isSelected) {
                  e.currentTarget.style.background = colors.section;
                }
              }}
              onMouseLeave={e => {
                if (!disabled && !isSelected) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
              style={{
                aspectRatio: '1 / 1',
                border: 'none',
                background: isSelected ? colors.actionPrimary : 'transparent',
                color: isSelected ? colors.primaryForeground : baseColor,
                borderRadius: borderRadius.sm,
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontSize: typography.fontSize.bodySm.size,
                fontWeight: isToday
                  ? typography.fontWeight.semibold
                  : typography.fontWeight.regular,
                boxShadow:
                  isToday && !isSelected
                    ? `inset 0 0 0 1px ${colors.borderFocus}`
                    : 'none',
                padding: 0,
                fontFamily: 'inherit',
                opacity: disabled ? 0.4 : 1,
                transition: 'background 120ms ease',
                outline: 'none',
              }}>
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const navButtonStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  background: 'transparent',
  borderRadius: borderRadius.sm,
  cursor: 'pointer',
  fontSize: 20,
  lineHeight: 1,
  color: colors.textPrimary,
  fontFamily: 'inherit',
};
