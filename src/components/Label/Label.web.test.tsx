import {render, screen} from '@testing-library/react';
import {Label} from './Label.web';
it('associates the label with an input and marks required fields', () => {
  render(
    <>
      <Label htmlFor="email" required>
        이메일
      </Label>
      <input id="email" />
    </>,
  );
  expect(screen.getByLabelText(/이메일/)).toBeInTheDocument();
  expect(screen.getByLabelText('필수')).toBeInTheDocument();
});
