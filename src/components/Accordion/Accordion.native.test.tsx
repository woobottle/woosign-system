import {render, screen, fireEvent} from '@testing-library/react-native';
import {Accordion} from './Accordion.native';
const items = [
  {value: 'a', title: '첫 항목', content: '첫 내용'},
  {value: 'b', title: '둘째 항목', content: '둘째 내용'},
  {value: 'c', title: '비활성', content: '숨긴 내용', disabled: true},
];
it('supports single and multiple expansion and disabled items', () => {
  const {rerender} = render(<Accordion id="faq" items={items} />);
  fireEvent.press(screen.getByRole('button', {name: '첫 항목'}));
  fireEvent.press(screen.getByRole('button', {name: '둘째 항목'}));
  expect(screen.queryByText('첫 내용')).toBeNull();
  expect(screen.getByText('둘째 내용')).toBeTruthy();
  rerender(<Accordion id="faq" items={items} multiple />);
  fireEvent.press(screen.getByRole('button', {name: '첫 항목'}));
  expect(screen.getByText('첫 내용')).toBeTruthy();
  fireEvent.press(screen.getByRole('button', {name: '비활성'}));
  expect(screen.queryByText('숨긴 내용')).toBeNull();
});
