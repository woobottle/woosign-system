import type {ReactNode} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useResolvedColors} from '../../core/hooks';
import {useControllableState} from '../_shared/state';
import {
  cellText,
  nextSort,
  sortLabel,
  sortRows,
  tableText,
} from './Table.shared';
import type {TableAlign, TableNativeProps, TableSort} from './types';

const DEFAULT_WIDTH = 120;

const textAlign: Record<TableAlign, 'left' | 'center' | 'right'> = {
  left: 'left',
  center: 'center',
  right: 'right',
};
const justify: Record<TableAlign, 'flex-start' | 'center' | 'flex-end'> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
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
}: TableNativeProps<T>) {
  const c = useResolvedColors();
  const [current, setCurrent] = useControllableState<TableSort | null>(
    sort,
    defaultSort,
    next => next && onSortChange?.(next),
  );
  const rows = sortRows(data, columns, current);
  const totalWidth = columns.reduce(
    (sum, col) => sum + (col.width ?? DEFAULT_WIDTH),
    0,
  );

  const renderCell = (content: ReactNode, align: TableAlign = 'left') =>
    typeof content === 'string' || typeof content === 'number' ? (
      <Text
        style={[
          styles.cellText,
          {color: c.textPrimary, textAlign: textAlign[align]},
        ]}>
        {content}
      </Text>
    ) : (
      content
    );

  return (
    <View
      testID={testID}
      style={[
        styles.root,
        {borderColor: c.borderDefault, backgroundColor: c.card},
        style,
      ]}>
      {hideCaption ? null : (
        <Text
          accessibilityRole="header"
          style={[styles.caption, {color: c.textPrimary}]}>
          {caption}
        </Text>
      )}
      <ScrollView
        horizontal
        accessibilityLabel={caption}
        showsHorizontalScrollIndicator={false}>
        <View style={{minWidth: totalWidth}}>
          <View style={[styles.row, {backgroundColor: c.section}]}>
            {columns.map(col => {
              const width = col.width ?? DEFAULT_WIDTH;
              const align = col.align ?? 'left';
              const active = current?.key === col.key;
              const header = (
                <Text
                  style={[
                    styles.headerText,
                    {
                      color: active ? c.textPrimary : c.textSecondary,
                      textAlign: textAlign[align],
                    },
                  ]}>
                  {col.header}
                  {col.sortable
                    ? active && current.direction === 'desc'
                      ? ' ↓'
                      : ' ↑'
                    : ''}
                </Text>
              );
              return col.sortable ? (
                <Pressable
                  key={col.key}
                  accessibilityRole="button"
                  accessibilityLabel={sortLabel(col.header, current, col.key)}
                  onPress={() => setCurrent(nextSort(current, col.key))}
                  style={[styles.cell, {width}]}>
                  {header}
                </Pressable>
              ) : (
                <View
                  key={col.key}
                  accessibilityRole="header"
                  style={[styles.cell, {width}]}>
                  {header}
                </View>
              );
            })}
          </View>
          {rows.length === 0 ? (
            <Text style={[styles.empty, {color: c.textSecondary}]}>
              {emptyText}
            </Text>
          ) : (
            rows.map((row, i) => (
              <View
                key={rowKey(row, i)}
                style={[
                  styles.row,
                  styles.bodyRow,
                  {borderTopColor: c.borderDefault},
                  striped && i % 2 === 1 && {backgroundColor: c.section},
                ]}>
                {columns.map(col => (
                  <View
                    key={col.key}
                    style={[
                      styles.cell,
                      {
                        width: col.width ?? DEFAULT_WIDTH,
                        alignItems: justify[col.align ?? 'left'],
                      },
                    ]}>
                    {renderCell(
                      col.render ? col.render(row, i) : cellText(row, col.key),
                      col.align,
                    )}
                  </View>
                ))}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {borderWidth: 1, borderRadius: 12, overflow: 'hidden'},
  caption: {fontWeight: '600', paddingHorizontal: 16, paddingVertical: 12},
  row: {flexDirection: 'row'},
  bodyRow: {borderTopWidth: 1},
  cell: {paddingHorizontal: 16, paddingVertical: 12, justifyContent: 'center'},
  headerText: {fontWeight: '600', fontSize: 14},
  cellText: {fontSize: 14, fontVariant: ['tabular-nums']},
  empty: {paddingVertical: 24, textAlign: 'center'},
});
