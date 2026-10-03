import {render, screen, fireEvent} from '@testing-library/react';
import {EmptyState} from './EmptyState.web';
it('renders the empty message and a working action', () => {
  const onPress = jest.fn();
  render(
    <EmptyState
      title="목록이 비었습니다"
      description="항목을 추가하세요"
      action={<button onClick={onPress}>추가</button>}
    />,
  );
  expect(
    screen.getByRole('heading', {name: '목록이 비었습니다'}),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByText('추가'));
  expect(onPress).toHaveBeenCalledTimes(1);
});
