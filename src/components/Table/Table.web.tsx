import type {CSSProperties} from 'react';
import {useResolvedColors} from '../../core/hooks';
import {useControllableState} from '../_shared/state';
import {cellText, nextSort, sortRows, tableText} from './Table.shared';
import type {TableSort, TableWebProps} from './types';

const visuallyHidden: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
};

export function Table<T>({
  columns,
  data,
  rowKey,
  caption,
  hideCaption = false,
  emptyText = tableText.empty,
  striped = false,
  sort,
  defaultSort = null,
  onSortChange,
  testID,
  style,
  className,
}: TableWebProps<T>) {
  const c = useResolvedColors();
  const [current, setCurrent] = useControllableState<TableSort | null>(
    sort,
    defaultSort,
    next => next && onSortChange?.(next),
  );
  const rows = sortRows(data, columns, current);
  const cellPadding = '12px 16px';

  return (
    <div
      data-testid={testID}
      className={className}
      style={{
        overflowX: 'auto',
        border: `1px solid ${c.borderDefault}`,
        borderRadius: 12,
        backgroundColor: c.card,
        ...style,
      }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          color: c.textPrimary,
          fontSize: 14,
        }}>
        <caption
          style={
            hideCaption
              ? visuallyHidden
              : {
                  captionSide: 'top',
                  textAlign: 'left',
                  padding: cellPadding,
                  fontWeight: 600,
                }
          }>
          {caption}
        </caption>
        <thead>
          <tr style={{backgroundColor: c.section}}>
            {columns.map(col => {
              const active = current?.key === col.key;
              const ariaSort = active
                ? current.direction === 'asc'
                  ? 'ascending'
                  : 'descending'
                : col.sortable
                ? 'none'
                : undefined;
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={ariaSort}
                  style={{
                    padding: col.sortable ? 0 : cellPadding,
                    textAlign: col.align ?? 'left',
                    width: col.width,
                    fontWeight: 600,
                    color: c.textSecondary,
                    whiteSpace: 'nowrap',
                  }}>
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => setCurrent(nextSort(current, col.key))}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        width: '100%',
                        justifyContent:
                          col.align === 'right'
                            ? 'flex-end'
                            : col.align === 'center'
                            ? 'center'
                            : 'flex-start',
                        padding: cellPadding,
                        border: 0,
                        background: 'transparent',
                        color: active ? c.textPrimary : 'inherit',
                        font: 'inherit',
                        cursor: 'pointer',
                      }}>
                      {col.header}
                      <span aria-hidden style={{opacity: active ? 1 : 0.35}}>
                        {active && current.direction === 'desc' ? '↓' : '↑'}
                      </span>
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: '24px 16px',
                  textAlign: 'center',
                  color: c.textSecondary,
                }}>
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr
                key={rowKey(row, i)}
                style={{
                  borderTop: `1px solid ${c.borderDefault}`,
                  backgroundColor:
                    striped && i % 2 === 1 ? c.section : 'transparent',
                }}>
                {columns.map(col => (
                  <td
                    key={col.key}
                    style={{
                      padding: cellPadding,
                      textAlign: col.align ?? 'left',
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                    {col.render ? col.render(row, i) : cellText(row, col.key)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
