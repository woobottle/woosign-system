import {render, screen} from '@testing-library/react-native';
import {Spinner} from './Spinner.native';
it('announces loading', () => {
  render(<Spinner label="저장 중" />);
  expect(screen.getByRole('progressbar', {name: '저장 중'})).toBeTruthy();
});
