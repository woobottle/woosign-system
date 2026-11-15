import type {Meta, StoryObj} from '@storybook/react-native';
import {Table} from './Table.native';

type Order = {id: string; name: string; qty: number; price: number};
const data: Order[] = [
  {id: '1', name: '노트', qty: 3, price: 3000},
  {id: '2', name: '가방', qty: 1, price: 25000},
  {id: '3', name: '연필', qty: 12, price: 800},
];

const meta: Meta<typeof Table<Order>> = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  args: {
    caption: '주문 목록',
    data,
    rowKey: row => row.id,
    columns: [
      {key: 'name', header: '상품', sortable: true},
      {key: 'qty', header: '수량', align: 'right', sortable: true},
      {
        key: 'price',
        header: '가격',
        align: 'right',
        sortable: true,
        render: row => `${row.price.toLocaleString('ko-KR')}원`,
      },
    ],
  },
};
export default meta;
type Story = StoryObj<typeof Table<Order>>;
export const Default: Story = {};
export const Striped: Story = {args: {striped: true}};
export const Empty: Story = {args: {data: []}};
