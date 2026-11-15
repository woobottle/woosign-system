import type {TableColumn, TableSort} from './types';

export const tableText = {
  empty: '표시할 데이터가 없습니다',
  ascending: '오름차순 정렬됨',
  descending: '내림차순 정렬됨',
  sortable: '정렬 가능',
};

export function cellValue<T>(row: T, key: string): unknown {
  return (row as Record<string, unknown>)[key];
}

export function cellText<T>(row: T, key: string): string {
  const value = cellValue(row, key);
  return value === null || value === undefined ? '' : String(value);
}

/** Next sort after pressing a column header: asc first, then toggle. */
export function nextSort(current: TableSort | null, key: string): TableSort {
  if (current?.key === key) {
    return {key, direction: current.direction === 'asc' ? 'desc' : 'asc'};
  }
  return {key, direction: 'asc'};
}

/** Stable sort; empty values always go last. Numbers compare numerically. */
export function sortRows<T>(
  data: readonly T[],
  columns: readonly TableColumn<T>[],
  sort: TableSort | null,
): readonly T[] {
  const column = sort && columns.find(col => col.key === sort.key);
  if (!sort || !column?.sortable) {
    return data;
  }
  const valueOf = (row: T) =>
    column.sortValue ? column.sortValue(row) : cellValue(row, column.key);
  const factor = sort.direction === 'asc' ? 1 : -1;
  return [...data].sort((a, b) => {
    const x = valueOf(a);
    const y = valueOf(b);
    const xEmpty = x === null || x === undefined || x === '';
    const yEmpty = y === null || y === undefined || y === '';
    if (xEmpty || yEmpty) {
      return xEmpty === yEmpty ? 0 : xEmpty ? 1 : -1;
    }
    if (typeof x === 'number' && typeof y === 'number') {
      return (x - y) * factor;
    }
    return String(x).localeCompare(String(y), 'ko', {numeric: true}) * factor;
  });
}

export function sortLabel(header: string, sort: TableSort | null, key: string) {
  if (sort?.key !== key) {
    return `${header}, ${tableText.sortable}`;
  }
  return `${header}, ${
    sort.direction === 'asc' ? tableText.ascending : tableText.descending
  }`;
}
