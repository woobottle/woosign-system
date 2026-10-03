import {render, screen} from '@testing-library/react-native';
import {ScrollArea} from './ScrollArea.native';
import {Text} from 'react-native';
it('preserves content and horizontal scrolling', () => {
  render(
    <ScrollArea label="주문 목록" horizontal testID="scroll">
      <Text>주문</Text>
    </ScrollArea>,
  );
  expect(screen.getByTestId('scroll').props.horizontal).toBe(true);
  expect(screen.getByText('주문')).toBeTruthy();
});
