import {render, screen} from '@testing-library/react-native';
import {AspectRatio} from './AspectRatio.native';
import {Text, StyleSheet} from 'react-native';
it('uses a safe ratio for invalid input and preserves content', () => {
  render(
    <AspectRatio ratio={0} testID="ratio">
      <Text>콘텐츠</Text>
    </AspectRatio>,
  );
  expect(
    StyleSheet.flatten(screen.getByTestId('ratio').props.style).aspectRatio,
  ).toBe(1);
  expect(screen.getByText('콘텐츠')).toBeTruthy();
});
