import {useResolvedColors} from '../../core/hooks';
import {useRef, useState, useEffect} from 'react';
import {useCalendar, parseDate, formatDate} from '../_shared/calendar';
import type {CalendarWebProps} from './types';
export function Calendar({
  locale = 'ko',
  testID,
  style,
  className,
  ...props
}: CalendarWebProps) {
  const c = useResolvedColors();
  const calendar = useCalendar(props);
  const {month, days, selected, select, blocked, shiftMonth, setMonth} =
    calendar;
  const [cursor, setCursor] = useState(selected);
  const [focusRequest, setFocusRequest] = useState(0);
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({});
  const tabDate =
    days.includes(cursor) && !blocked(cursor)
      ? cursor
      : days.find(
          date =>
            date.slice(0, 7) === formatDate(month).slice(0, 7) &&
            !blocked(date),
        );
  useEffect(() => {
    if (focusRequest && cursor) {
      buttons.current[cursor]?.focus();
    }
  }, [focusRequest, cursor]);
  const heading = month.toLocaleDateString(
    locale === 'ko' ? 'ko-KR' : 'en-US',
    {year: 'numeric', month: 'long'},
  );
  const navStyle = {
    border: 0,
    borderRadius: 999,
    backgroundColor: c.section,
    color: c.textPrimary,
    width: 36,
    height: 36,
  };
  return (
    <div
      data-testid={testID}
      className={className}
      style={{
        width: 308,
        padding: 12,
        borderRadius: 12,
        border: `1px solid ${c.borderDefault}`,
        backgroundColor: c.card,
        color: c.textPrimary,
        boxSizing: 'border-box',
        ...style,
      }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <button
          type="button"
          disabled={props.disabled}
          aria-label="Previous month"
          onClick={() => shiftMonth(-1)}
          style={navStyle}>
          ‹
        </button>
        <span aria-live="polite">{heading}</span>
        <button
          type="button"
          disabled={props.disabled}
          aria-label="Next month"
          onClick={() => shiftMonth(1)}
          style={navStyle}>
          ›
        </button>
      </div>
      <div role="grid" aria-label={heading} style={{marginTop: 8}}>
        <div
          role="row"
          style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)'}}>
          {(locale === 'ko'
            ? ['일', '월', '화', '수', '목', '금', '토']
            : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
          ).map(day => (
            <span
              key={day}
              role="columnheader"
              style={{textAlign: 'center', color: c.textSecondary, padding: 4}}>
              {day}
            </span>
          ))}
        </div>
        {Array.from({length: 6}, (_, row) => (
          <div
            key={row}
            role="row"
            style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)'}}>
            {days.slice(row * 7, row * 7 + 7).map(date => (
              <div key={date} role="gridcell" aria-selected={date === selected}>
                <button
                  ref={el => {
                    buttons.current[date] = el;
                  }}
                  type="button"
                  disabled={blocked(date)}
                  aria-label={date}
                  aria-pressed={date === selected}
                  tabIndex={date === tabDate ? 0 : -1}
                  onFocus={() => setCursor(date)}
                  onClick={() => select(date)}
                  onKeyDown={event => {
                    const parsed = parseDate(date)!;
                    let delta = 0;
                    if (event.key === 'ArrowRight') {
                      delta = 1;
                    } else if (event.key === 'ArrowLeft') {
                      delta = -1;
                    } else if (event.key === 'ArrowDown') {
                      delta = 7;
                    } else if (event.key === 'ArrowUp') {
                      delta = -7;
                    } else if (event.key === 'Home') {
                      delta = -parsed.getDay();
                    } else if (event.key === 'End') {
                      delta = 6 - parsed.getDay();
                    } else if (
                      event.key === 'PageUp' ||
                      event.key === 'PageDown'
                    ) {
                      const day = parsed.getDate();
                      parsed.setDate(1);
                      parsed.setMonth(
                        parsed.getMonth() + (event.key === 'PageUp' ? -1 : 1),
                      );
                      parsed.setDate(
                        Math.min(
                          day,
                          new Date(
                            parsed.getFullYear(),
                            parsed.getMonth() + 1,
                            0,
                          ).getDate(),
                        ),
                      );
                    } else {
                      return;
                    }
                    event.preventDefault();
                    parsed.setDate(parsed.getDate() + delta);
                    let next = formatDate(parsed);
                    for (
                      let attempts = 0;
                      blocked(next) && attempts < 366;
                      attempts++
                    ) {
                      parsed.setDate(
                        parsed.getDate() +
                          (delta < 0 || event.key === 'PageUp' ? -1 : 1),
                      );
                      next = formatDate(parsed);
                    }
                    if (!blocked(next)) {
                      setMonth(
                        new Date(parsed.getFullYear(), parsed.getMonth(), 1),
                      );
                      setCursor(next);
                      setFocusRequest(n => n + 1);
                    }
                  }}
                  style={{
                    width: '100%',
                    height: 36,
                    borderRadius: 999,
                    border: 0,
                    backgroundColor:
                      date === selected ? c.actionPrimary : 'transparent',
                    color:
                      date === selected ? c.primaryForeground : c.textPrimary,
                    opacity: blocked(date)
                      ? 0.3
                      : date.slice(0, 7) === formatDate(month).slice(0, 7)
                      ? 1
                      : 0.5,
                  }}>
                  {parseDate(date)!.getDate()}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
