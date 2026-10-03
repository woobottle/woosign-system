import {render, screen} from '@testing-library/react';
import {FormField} from './FormField.web';
it('links label, help and error to the field', () => {
  render(
    <FormField
      id="email"
      label="이메일"
      description="업무 이메일"
      error="필수 항목"
      required>
      {props => (
        <input
          id={props.id}
          required={props.required}
          aria-invalid={props['aria-invalid']}
          aria-describedby={props['aria-describedby']}
        />
      )}
    </FormField>,
  );
  const input = screen.getByRole('textbox', {name: '이메일 필수'});
  expect(input).toHaveAttribute('aria-describedby', 'email-help email-error');
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(input).toBeRequired();
  expect(screen.getByRole('alert')).toHaveTextContent('필수 항목');
});
