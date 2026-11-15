import {nextSort, sortRows} from './Table.shared';
import type {TableColumn} from './types';

type Row = {name: string; qty: number | null; code: string};
const rows: Row[] = [
  {name: '나', qty: 10, code: 'A10'},
  {name: '가', qty: 2, code: 'A2'},
  {name: '다', qty: null, code: 'A1'},
];
const columns: TableColumn<Row>[] = [
  {key: 'name', header: '이름', sortable: true},
  {key: 'qty', header: '수량', sortable: true},
  {key: 'code', header: '코드', sortable: true},
  {key: 'locked', header: '고정'},
];
const names = (list: readonly Row[]) => list.map(r => r.name).join('');

it('sorts numbers numerically and strings with Korean/numeric collation', () => {
  expect(names(sortRows(rows, columns, {key: 'qty', direction: 'asc'}))).toBe(
    '가나다',
  );
  expect(names(sortRows(rows, columns, {key: 'name', direction: 'desc'}))).toBe(
    '다나가',
  );
  expect(names(sortRows(rows, columns, {key: 'code', direction: 'asc'}))).toBe(
    '다가나',
  );
});

it('keeps empty values last in both directions and leaves input untouched', () => {
  expect(names(sortRows(rows, columns, {key: 'qty', direction: 'desc'}))).toBe(
    '나가다',
  );
  expect(names(rows)).toBe('나가다');
});

it('ignores unknown or non-sortable columns', () => {
  expect(sortRows(rows, columns, {key: 'locked', direction: 'asc'})).toBe(rows);
  expect(sortRows(rows, columns, null)).toBe(rows);
});

it('starts ascending and toggles on the same column', () => {
  expect(nextSort(null, 'qty')).toEqual({key: 'qty', direction: 'asc'});
  expect(nextSort({key: 'qty', direction: 'asc'}, 'qty')).toEqual({
    key: 'qty',
    direction: 'desc',
  });
  expect(nextSort({key: 'qty', direction: 'desc'}, 'name')).toEqual({
    key: 'name',
    direction: 'asc',
  });
});
