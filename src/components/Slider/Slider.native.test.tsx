import {render, screen, fireEvent} from '@testing-library/react-native';
import {Slider} from './Slider.native';
it('supports stepped accessible changes and disabled state', () => {
  const onValueChange = jest.fn();
  const {rerender} = render(
    <Slider
      label="볼륨"
      defaultValue={8}
      max={10}
      step={2}
      onValueChange={onValueChange}
    />,
  );
  const slider = screen.getByRole('adjustable', {name: '볼륨'});
  fireEvent(slider, 'accessibilityAction', {
    nativeEvent: {actionName: 'increment'},
  });
  expect(onValueChange).toHaveBeenCalledWith(10);
  expect(slider.props.accessibilityValue.now).toBe(10);
  rerender(<Slider label="볼륨" disabled onValueChange={onValueChange} />);
  fireEvent(slider, 'accessibilityAction', {
    nativeEvent: {actionName: 'decrement'},
  });
  expect(onValueChange).toHaveBeenCalledTimes(1);
});
it('handles touch dragging and commits the last gesture value', () => {
  const onValueChange = jest.fn();
  const onValueCommit = jest.fn();
  render(
    <Slider
      label="볼륨"
      onValueChange={onValueChange}
      onValueCommit={onValueCommit}
    />,
  );
  const slider = screen.getByRole('adjustable');
  fireEvent(slider, 'layout', {nativeEvent: {layout: {width: 100}}});
  fireEvent(slider, 'responderGrant', {
    nativeEvent: {locationX: 20, pageX: 50},
  });
  fireEvent(slider, 'responderMove', {nativeEvent: {pageX: 80}});
  fireEvent(slider, 'responderRelease');
  expect(onValueChange).toHaveBeenLastCalledWith(50);
  expect(onValueCommit).toHaveBeenCalledWith(50);
});
