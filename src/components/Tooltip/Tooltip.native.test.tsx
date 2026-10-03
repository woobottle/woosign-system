import {render, screen, fireEvent} from '@testing-library/react-native';
import {Tooltip} from './Tooltip.native';
it('provides help through a touch-accessible sheet', () => {
  render(<Tooltip id="help" trigger="도움말 열기" content="도움말 내용" />);
  fireEvent.press(screen.getByRole('button', {name: '도움말'}));
  expect(screen.getByText('도움말 내용')).toBeTruthy();
  fireEvent.press(screen.getByRole('button', {name: '닫기'}));
  expect(screen.queryByText('도움말 내용')).toBeNull();
});
