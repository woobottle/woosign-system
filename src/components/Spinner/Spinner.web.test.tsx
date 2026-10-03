import {render, screen} from '@testing-library/react';
import {Spinner} from './Spinner.web';
it('announces loading without exposing decorative graphics', () => {
  render(<Spinner label="저장 중" />);
  expect(screen.getByRole('status', {name: '저장 중'})).toBeInTheDocument();
});
