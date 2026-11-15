import {render, screen, fireEvent} from '@testing-library/react-native';
import {Table} from './Table.native';

type Order = {id: string; name: string; price: number};
const data: Order[] = [
  {id: '1', name: '노트', price: 3000},
  {id: '2', name: '가방', price: 25000},
  {id: '3', name: '연필', price: 800},
];
const columns = [
  {key: 'name', header: '상품'},
  {
    key: 'price',
    header: '가격',
    align: 'right' as const,
    sortable: true,
    render: (row: Order) => `${row.price}원`,
  },
];
const order = () =>
  screen.getAllByText(/^(노트|가방|연필)$/).map(node => node.props.children);

it('renders caption, headers and cells', () => {
  render(
    <Table
      caption="주문 목록"
      columns={columns}
      data={data}
      rowKey={r => r.id}
    />,
  );
  expect(screen.getByRole('header', {name: '주문 목록'})).toBeTruthy();
  expect(screen.getByText('25000원')).toBeTruthy();
  expect(order()).toEqual(['노트', '가방', '연필']);
});

it('sorts from a labelled header button', () => {
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
  fireEvent.press(screen.getByRole('button', {name: '가격, 정렬 가능'}));
  expect(onSortChange).toHaveBeenLastCalledWith({
    key: 'price',
    direction: 'asc',
  });
  expect(order()).toEqual(['연필', '노트', '가방']);
  fireEvent.press(screen.getByRole('button', {name: '가격, 오름차순 정렬됨'}));
  expect(order()).toEqual(['가방', '노트', '연필']);
  expect(
    screen.getByRole('button', {name: '가격, 내림차순 정렬됨'}),
  ).toBeTruthy();
});

it('shows the empty text and can hide the caption', () => {
  render(
    <Table
      caption="주문 목록"
      hideCaption
      columns={columns}
      data={[]}
      rowKey={r => r.id}
    />,
  );
  expect(screen.queryByRole('header', {name: '주문 목록'})).toBeNull();
  expect(screen.getByLabelText('주문 목록')).toBeTruthy();
  expect(screen.getByText('표시할 데이터가 없습니다')).toBeTruthy();
});
