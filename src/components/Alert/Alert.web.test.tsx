import {render, screen, fireEvent} from '@testing-library/react';
import {Alert} from './Alert.web';
it('announces errors and delegates dismissal', () => {
  const onClose = jest.fn();
  render(
    <Alert title="오류" tone="danger" onClose={onClose}>
      다시 시도
    </Alert>,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('다시 시도');
  fireEvent.click(screen.getByRole('button', {name: '알림 닫기'}));
  expect(onClose).toHaveBeenCalledTimes(1);
});
