import {render, screen, fireEvent} from '@testing-library/react-native';
import {Text, View} from 'react-native';
import {Carousel} from './Carousel.native';

const slides = ['첫 화면', '두 번째 화면', '세 번째 화면'].map(text => (
  <Text key={text}>{text}</Text>
));

function layout(width: number) {
  return {nativeEvent: {layout: {width, height: 200, x: 0, y: 0}}};
}

it('moves with buttons and dots', () => {
  const onIndexChange = jest.fn();
  render(
    <Carousel label="온보딩" onIndexChange={onIndexChange} testID="carousel">
      {slides}
    </Carousel>,
  );
  expect(screen.getByRole('button', {name: '이전 슬라이드'})).toBeDisabled();
  fireEvent.press(screen.getByRole('button', {name: '다음 슬라이드'}));
  expect(onIndexChange).toHaveBeenLastCalledWith(1);
  expect(
    screen.getByRole('button', {name: '2번 슬라이드로 이동'}),
  ).toBeSelected();
  fireEvent.press(screen.getByRole('button', {name: '3번 슬라이드로 이동'}));
  expect(onIndexChange).toHaveBeenLastCalledWith(2);
  expect(screen.getByRole('button', {name: '다음 슬라이드'})).toBeDisabled();
});

it('syncs the index when a swipe settles', () => {
  const onIndexChange = jest.fn();
  render(
    <Carousel label="온보딩" onIndexChange={onIndexChange}>
      {slides}
    </Carousel>,
  );
  const scroll = screen.getByLabelText('온보딩');
  fireEvent(scroll.parent as never, 'layout', layout(300));
  fireEvent(scroll, 'momentumScrollEnd', {
    nativeEvent: {contentOffset: {x: 300, y: 0}},
  });
  expect(onIndexChange).toHaveBeenLastCalledWith(1);
});

it('hides off-screen slides from screen readers', () => {
  render(
    <Carousel label="온보딩" defaultIndex={1}>
      {slides}
    </Carousel>,
  );
  expect(screen.queryByText('첫 화면')).toBeNull();
  expect(screen.getByText('두 번째 화면')).toBeTruthy();
  expect(
    screen.getByText('첫 화면', {includeHiddenElements: true}),
  ).toBeTruthy();
});

it('renders a single slide without controls', () => {
  render(
    <Carousel label="온보딩">
      <View>
        <Text>하나</Text>
      </View>
    </Carousel>,
  );
  expect(screen.queryByRole('button')).toBeNull();
});
