import {render, screen, fireEvent} from '@testing-library/react-native';
import {Collapsible} from './Collapsible.native';
it('opens on activation and respects disabled state', () => {
  const {rerender} = render(
    <Collapsible id="faq" title="상세">
      내용
    </Collapsible>,
  );
  expect(screen.queryByText('내용')).toBeNull();
  fireEvent.press(screen.getByRole('button'));
  expect(screen.getByText('내용')).toBeTruthy();
  rerender(
    <Collapsible id="faq" title="상세" disabled>
      내용
    </Collapsible>,
  );
  fireEvent.press(screen.getByRole('button'));
  expect(screen.getByText('내용')).toBeTruthy();
});
