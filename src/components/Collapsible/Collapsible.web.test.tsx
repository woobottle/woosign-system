import {render, screen, fireEvent} from '@testing-library/react';
import {Collapsible} from './Collapsible.web';
it('opens on activation and preserves a controlled closed state', () => {
  const onOpenChange = jest.fn();
  const {rerender} = render(
    <Collapsible id="faq" title="상세" onOpenChange={onOpenChange}>
      내용
    </Collapsible>,
  );
  const button = screen.getByRole('button');
  fireEvent.click(button);
  expect(button).toHaveAttribute('aria-expanded', 'true');
  expect(onOpenChange).toHaveBeenCalledWith(true);
  rerender(
    <Collapsible id="faq" title="상세" open={false} onOpenChange={onOpenChange}>
      내용
    </Collapsible>,
  );
  fireEvent.click(button);
  expect(button).toHaveAttribute('aria-expanded', 'false');
});
