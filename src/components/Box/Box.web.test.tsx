/**
 * Web harness tests for Box. jsdom 환경, .web.tsx 구현을 사용한다.
 * props → CSS 스타일 변환의 분기/정밀 로직(shorthand 확장, 우선순위, 프리셋
 * 매핑, borderStyle 게이팅, as 엘리먼트, style 병합)을 검증한다.
 */
import {render, screen} from '@testing-library/react';
import {Box} from './Box';
import {borderRadius as radiusTokens} from '../../core/theme/tokens';

describe('Box (web)', () => {
  it('renders children with a data-testid and defaults to a flex column', () => {
    render(<Box testID="box">본문</Box>);
    const box = screen.getByTestId('box');
    expect(box).toHaveTextContent('본문');
    expect(box).toHaveStyle({display: 'flex', flexDirection: 'column'});
  });

  it('uses the provided flexDirection', () => {
    render(<Box testID="box" flexDirection="row" />);
    expect(screen.getByTestId('box')).toHaveStyle({flexDirection: 'row'});
  });

  it('expands paddingX to left and right', () => {
    render(<Box testID="box" paddingX={16} />);
    expect(screen.getByTestId('box')).toHaveStyle({
      paddingLeft: '16px',
      paddingRight: '16px',
    });
  });

  it('expands paddingY to top and bottom', () => {
    render(<Box testID="box" paddingY={8} />);
    expect(screen.getByTestId('box')).toHaveStyle({
      paddingTop: '8px',
      paddingBottom: '8px',
    });
  });

  it('lets an explicit side padding override the shorthand', () => {
    render(<Box testID="box" paddingX={16} paddingLeft={4} />);
    expect(screen.getByTestId('box')).toHaveStyle({
      paddingLeft: '4px',
      paddingRight: '16px',
    });
  });

  it('expands marginX to left and right', () => {
    render(<Box testID="box" marginX={12} />);
    expect(screen.getByTestId('box')).toHaveStyle({
      marginLeft: '12px',
      marginRight: '12px',
    });
  });

  it('resolves a borderRadius preset to its token value', () => {
    render(<Box testID="box" borderRadius="md" />);
    expect(screen.getByTestId('box')).toHaveStyle({
      borderRadius: `${radiusTokens.md}px`,
    });
  });

  it('passes a numeric borderRadius through', () => {
    render(<Box testID="box" borderRadius={20} />);
    expect(screen.getByTestId('box')).toHaveStyle({borderRadius: '20px'});
  });

  it('sets borderStyle solid only when borderWidth is provided', () => {
    const {rerender} = render(<Box testID="box" />);
    expect(screen.getByTestId('box').style.borderStyle).toBe('');
    rerender(<Box testID="box" borderWidth={2} />);
    expect(screen.getByTestId('box')).toHaveStyle({
      borderWidth: '2px',
      borderStyle: 'solid',
    });
  });

  it('renders the element given by the `as` prop (default div)', () => {
    const {rerender} = render(<Box testID="box" />);
    expect(screen.getByTestId('box').tagName).toBe('DIV');
    rerender(<Box testID="box" as="section" />);
    expect(screen.getByTestId('box').tagName).toBe('SECTION');
  });

  it('merges custom style and applies a numeric size', () => {
    render(
      <Box
        testID="box"
        width={200}
        style={{backgroundColor: 'rgb(255, 0, 0)'}}
      />,
    );
    const box = screen.getByTestId('box');
    expect(box).toHaveStyle({
      width: '200px',
      backgroundColor: 'rgb(255, 0, 0)',
    });
  });

  it('accepts a string width', () => {
    render(<Box testID="box" width="50%" />);
    expect(screen.getByTestId('box')).toHaveStyle({width: '50%'});
  });
});
