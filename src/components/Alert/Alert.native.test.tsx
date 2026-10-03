import {render, screen, fireEvent} from '@testing-library/react-native';
import {Alert} from './Alert.native';
it('announces errors and delegates dismissal', () => {
  const onClose = jest.fn();
  render(
    <Alert title="오류" tone="danger" onClose={onClose} testID="alert">
      다시 시도
    </Alert>,
  );
  expect(screen.getByTestId('alert').props.accessibilityLiveRegion).toBe(
    'assertive',
  );
  fireEvent.press(screen.getByRole('button', {name: '알림 닫기'}));
  expect(onClose).toHaveBeenCalledTimes(1);
});
