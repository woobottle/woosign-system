import {render, screen, fireEvent} from '@testing-library/react';
import {Slider} from './Slider.web';
it('normalizes values and reports input and committed changes', () => {
  const onValueChange = jest.fn();
  const onValueCommit = jest.fn();
  render(
    <Slider
      label="볼륨"
      defaultValue={200}
      min={0}
      max={10}
      step={2}
      onValueChange={onValueChange}
      onValueCommit={onValueCommit}
    />,
  );
  const slider = screen.getByRole('slider', {name: '볼륨'});
  expect(slider).toHaveValue('10');
  fireEvent.change(slider, {target: {value: '4'}});
  expect(onValueChange).toHaveBeenCalledWith(4);
  fireEvent.keyUp(slider, {key: 'ArrowRight'});
  expect(onValueCommit).toHaveBeenCalledWith(4);
});
