import {render, screen, fireEvent} from '@testing-library/react';
import {Accordion} from './Accordion.web';
const items = [
  {value: 'a', title: '첫 항목', content: '첫 내용'},
  {value: 'b', title: '둘째 항목', content: '둘째 내용'},
  {value: 'c', title: '비활성', content: '숨긴 내용', disabled: true},
];
it('supports single and multiple expansion and keyboard navigation', () => {
  const {rerender} = render(<Accordion id="faq" items={items} />);
  fireEvent.click(screen.getByRole('button', {name: /첫 항목/}));
  fireEvent.click(screen.getByRole('button', {name: /둘째 항목/}));
  expect(screen.getByRole('button', {name: /첫 항목/})).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  rerender(<Accordion id="faq" items={items} multiple />);
  fireEvent.click(screen.getByRole('button', {name: /첫 항목/}));
  expect(screen.getAllByRole('region')).toHaveLength(2);
  fireEvent.keyDown(screen.getByRole('button', {name: /둘째 항목/}), {
    key: 'ArrowDown',
  });
  expect(screen.getByRole('button', {name: /첫 항목/})).toHaveFocus();
  expect(screen.getByRole('button', {name: /비활성/})).toBeDisabled();
});
