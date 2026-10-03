import {render, screen} from '@testing-library/react';
import {AspectRatio} from './AspectRatio.web';
it('uses a safe ratio for invalid input and preserves content', () => {
  render(
    <AspectRatio ratio={0} testID="ratio">
      콘텐츠
    </AspectRatio>,
  );
  expect(screen.getByTestId('ratio')).toHaveStyle({aspectRatio: '1'});
  expect(screen.getByText('콘텐츠')).toBeInTheDocument();
});
