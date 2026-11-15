import {render, screen, fireEvent} from '@testing-library/react';
import {useState} from 'react';
import {Carousel} from './Carousel.web';

const slides = ['첫 화면', '두 번째 화면', '세 번째 화면'].map(text => (
  <p key={text}>{text}</p>
));

it('exposes a labelled carousel with one group per slide', () => {
  render(<Carousel label="온보딩">{slides}</Carousel>);
  const region = screen.getByRole('region', {name: '온보딩'});
  expect(region).toHaveAttribute('aria-roledescription', 'carousel');
  expect(screen.getByRole('group', {name: '1 / 3'})).toHaveTextContent(
    '첫 화면',
  );
  expect(screen.getAllByRole('group', {hidden: true})).toHaveLength(3);
  expect(screen.getByRole('button', {name: '이전 슬라이드'})).toBeDisabled();
});

it('moves with buttons, dots and arrow keys', () => {
  const onIndexChange = jest.fn();
  render(
    <Carousel label="온보딩" onIndexChange={onIndexChange}>
      {slides}
    </Carousel>,
  );
  fireEvent.click(screen.getByRole('button', {name: '다음 슬라이드'}));
  expect(onIndexChange).toHaveBeenLastCalledWith(1);
  expect(screen.getByRole('group', {name: '2 / 3'})).toBeVisible();
  expect(
    screen.getByRole('button', {name: '2번 슬라이드로 이동'}),
  ).toHaveAttribute('aria-current', 'true');

  fireEvent.click(screen.getByRole('button', {name: '3번 슬라이드로 이동'}));
  expect(onIndexChange).toHaveBeenLastCalledWith(2);
  expect(screen.getByRole('button', {name: '다음 슬라이드'})).toBeDisabled();

  fireEvent.keyDown(screen.getByRole('region'), {key: 'ArrowLeft'});
  expect(onIndexChange).toHaveBeenLastCalledWith(1);
});

it('syncs the index from swipe scrolling', () => {
  const onIndexChange = jest.fn();
  render(
    <Carousel label="온보딩" onIndexChange={onIndexChange}>
      {slides}
    </Carousel>,
  );
  const track = screen.getByRole('group', {name: '1 / 3'}).parentElement!;
  Object.defineProperty(track, 'clientWidth', {value: 300});
  fireEvent.scroll(track, {target: {scrollLeft: 600}});
  expect(onIndexChange).toHaveBeenLastCalledWith(2);
});

it('follows a controlled index and clamps out-of-range values', () => {
  function Controlled() {
    const [index, setIndex] = useState(5);
    return (
      <>
        <Carousel label="온보딩" index={index} onIndexChange={setIndex}>
          {slides}
        </Carousel>
        <button onClick={() => setIndex(0)}>처음으로</button>
      </>
    );
  }
  render(<Controlled />);
  expect(
    screen.getByRole('button', {name: '3번 슬라이드로 이동'}),
  ).toHaveAttribute('aria-current', 'true');
  fireEvent.click(screen.getByRole('button', {name: '처음으로'}));
  expect(
    screen.getByRole('button', {name: '1번 슬라이드로 이동'}),
  ).toHaveAttribute('aria-current', 'true');
});

it('hides controls for a single slide or when turned off', () => {
  const {rerender} = render(
    <Carousel label="온보딩">
      <p>하나</p>
    </Carousel>,
  );
  expect(screen.queryByRole('button')).toBeNull();
  rerender(
    <Carousel label="온보딩" showControls={false} showIndicators={false}>
      {slides}
    </Carousel>,
  );
  expect(screen.queryByRole('button')).toBeNull();
});

it('ignores in-between scroll events while animating to a button target', () => {
  const onIndexChange = jest.fn();
  render(
    <Carousel label="온보딩" onIndexChange={onIndexChange}>
      {slides}
    </Carousel>,
  );
  const track = screen.getByRole('group', {name: '1 / 3'}).parentElement!;
  Object.defineProperty(track, 'clientWidth', {value: 300});
  track.scrollTo = jest.fn();
  fireEvent.click(screen.getByRole('button', {name: '다음 슬라이드'}));
  expect(track.scrollTo).toHaveBeenCalledWith(
    expect.objectContaining({left: 300}),
  );
  // Smooth scroll passes 40px: still rounds to slide 1, must not revert.
  fireEvent.scroll(track, {target: {scrollLeft: 40}});
  fireEvent.scroll(track, {target: {scrollLeft: 300}});
  expect(onIndexChange.mock.calls).toEqual([[1]]);
  // After arriving, a user swipe updates the index again.
  fireEvent.scroll(track, {target: {scrollLeft: 600}});
  expect(onIndexChange).toHaveBeenLastCalledWith(2);
});
