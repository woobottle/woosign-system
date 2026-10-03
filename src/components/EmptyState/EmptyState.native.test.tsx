import {render, screen, fireEvent} from '@testing-library/react-native';
import {EmptyState} from './EmptyState.native';
import {Button} from '../Button/Button.native';
it('renders the empty message and a working action', () => {
  const onPress = jest.fn();
  render(
    <EmptyState
      title="목록이 비었습니다"
      description="항목을 추가하세요"
      action={<Button onPress={onPress}>추가</Button>}
    />,
  );
  expect(screen.getByRole('header', {name: '목록이 비었습니다'})).toBeTruthy();
  fireEvent.press(screen.getByText('추가'));
  expect(onPress).toHaveBeenCalledTimes(1);
});
