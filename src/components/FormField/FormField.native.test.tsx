import {render, screen} from '@testing-library/react-native';
import {FormField} from './FormField.native';
import {TextInput} from 'react-native';
it('provides an accessible label and error hint to the input', () => {
  render(
    <FormField id="email" label="이메일" error="필수 항목">
      {props => (
        <TextInput
          accessibilityLabel={props.accessibilityLabel}
          accessibilityHint={props.accessibilityHint}
        />
      )}
    </FormField>,
  );
  expect(screen.getByLabelText('이메일').props.accessibilityHint).toBe(
    '필수 항목',
  );
  expect(screen.getByText('필수 항목')).toBeTruthy();
});
