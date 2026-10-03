import {render, screen} from '@testing-library/react';
import {ScrollArea} from './ScrollArea.web';
it('provides a keyboard focusable named scroll region', () => {
  render(
    <ScrollArea label="주문 목록" maxHeight={100}>
      주문
    </ScrollArea>,
  );
  expect(screen.getByRole('region', {name: '주문 목록'})).toHaveAttribute(
    'tabindex',
    '0',
  );
  expect(screen.getByRole('region')).toHaveStyle({
    maxHeight: '100px',
    overflowY: 'auto',
  });
});
