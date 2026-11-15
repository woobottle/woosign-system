import {render, screen, fireEvent, within} from '@testing-library/react';
import {Table} from './Table.web';

type Order = {id: string; name: string; price: number};
const data: Order[] = [
  {id: '1', name: '노트', price: 3000},
  {id: '2', name: '가방', price: 25000},
  {id: '3', name: '연필', price: 800},
];
const columns = [
  {key: 'name', header: '상품', sortable: true},
  {
    key: 'price',
    header: '가격',
    align: 'right' as const,
    sortable: true,
    render: (row: Order) => `${row.price.toLocaleString('ko-KR')}원`,
  },
];
const firstColumn = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map(row => within(row).getAllByRole('cell')[0].textContent);

it('renders a captioned table with column headers and custom cells', () => {
  render(
    <Table
      caption="주문 목록"
      columns={columns}
      data={data}
      rowKey={r => r.id}
    />,
  );
  const table = screen.getByRole('table', {name: '주문 목록'});
  expect(within(table).getAllByRole('columnheader')).toHaveLength(2);
  expect(screen.getByRole('cell', {name: '25,000원'})).toBeInTheDocument();
  expect(firstColumn()).toEqual(['노트', '가방', '연필']);
});

it('sorts by a header button and exposes aria-sort', () => {
  const onSortChange = jest.fn();
  render(
    <Table
      caption="주문 목록"
      columns={columns}
      data={data}
      rowKey={r => r.id}
      onSortChange={onSortChange}
    />,
  );
  const priceHeader = screen.getByRole('columnheader', {name: /가격/});
  expect(priceHeader).toHaveAttribute('aria-sort', 'none');
  fireEvent.click(within(priceHeader).getByRole('button'));
  expect(priceHeader).toHaveAttribute('aria-sort', 'ascending');
  expect(onSortChange).toHaveBeenLastCalledWith({
    key: 'price',
    direction: 'asc',
  });
  expect(firstColumn()).toEqual(['연필', '노트', '가방']);
  fireEvent.click(within(priceHeader).getByRole('button'));
  expect(priceHeader).toHaveAttribute('aria-sort', 'descending');
  expect(firstColumn()).toEqual(['가방', '노트', '연필']);
});

it('respects a controlled sort and shows the empty state', () => {
  const {rerender} = render(
    <Table
      caption="주문 목록"
      columns={columns}
      data={data}
      rowKey={r => r.id}
      sort={{key: 'name', direction: 'asc'}}
      onSortChange={() => {}}
    />,
  );
  expect(firstColumn()).toEqual(['가방', '노트', '연필']);
  fireEvent.click(screen.getByRole('button', {name: /가격/}));
  expect(firstColumn()).toEqual(['가방', '노트', '연필']);
  rerender(
    <Table
      caption="주문 목록"
      columns={columns}
      data={[]}
      rowKey={r => r.id}
      emptyText="주문이 없어요"
    />,
  );
  expect(screen.getByRole('cell', {name: '주문이 없어요'})).toHaveAttribute(
    'colspan',
    '2',
  );
});
