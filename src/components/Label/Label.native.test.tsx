import {render, screen} from '@testing-library/react-native';
import {Label} from './Label.native';
it('marks required fields', () => {
  render(<Label required>이메일</Label>);
  expect(screen.getByText(/이메일/)).toBeTruthy();
  expect(screen.getByLabelText('필수')).toBeTruthy();
});
