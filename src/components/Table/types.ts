import type {CSSProperties, ReactNode} from 'react';
import type {ViewStyle} from 'react-native';

export type TableAlign = 'left' | 'center' | 'right';
export type TableSortDirection = 'asc' | 'desc';

export interface TableSort {
  key: string;
  direction: TableSortDirection;
}

export interface TableColumn<T> {
  key: string;
  header: string;
  /** Cell content. Defaults to `String(row[key])`. */
  render?: (row: T, index: number) => ReactNode;
  align?: TableAlign;
  /** Fixed column width in px. Native uses 120 when omitted. */
  width?: number;
  sortable?: boolean;
  /** Value used for sorting. Defaults to `row[key]`. */
  sortValue?: (row: T) => string | number | null | undefined;
}

export interface TableBaseProps<T> {
  columns: readonly TableColumn<T>[];
  data: readonly T[];
  rowKey: (row: T, index: number) => string;
  /** Accessible name; shown as a caption on web. */
  caption: string;
  /** Hide the caption visually while keeping it for screen readers. */
  hideCaption?: boolean;
  emptyText?: string;
  striped?: boolean;
  sort?: TableSort | null;
  defaultSort?: TableSort | null;
  onSortChange?: (sort: TableSort) => void;
  testID?: string;
}
export interface TableWebProps<T> extends TableBaseProps<T> {
  style?: CSSProperties;
  className?: string;
}
export interface TableNativeProps<T> extends TableBaseProps<T> {
  style?: ViewStyle;
}
export type TableProps<T> = TableBaseProps<T> & {
  style?: CSSProperties | ViewStyle;
  className?: string;
};
