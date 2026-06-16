/**
 * Native harness tests for Tabs. 라이트 스모크 + 다크 테마 토큰 단언.
 * 첫 항목을 value로 줘 첫 Pressable이 active가 되고, 그 borderBottomColor가
 * 다크 textBrand 토큰을 쓰는지 본다.
 */
import {StyleSheet, Pressable} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {Tabs} from './Tabs.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

const ITEMS = [
  {key: 'a', label: '메뉴'},
  {key: 'b', label: '주문'},
];

describe('Tabs (native)', () => {
  it('renders its tab labels (light smoke)', () => {
    render(<Tabs items={ITEMS} value="a" onChange={() => {}} />);
    expect(screen.getByText('메뉴')).toBeTruthy();
    expect(screen.getByText('주문')).toBeTruthy();
  });

  it('uses the dark textBrand underline on the active tab in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Tabs items={ITEMS} value="a" onChange={() => {}} />
      </ThemeProvider>,
    );
    const activeTab = screen.UNSAFE_getAllByType(Pressable)[0];
    const flat = StyleSheet.flatten(activeTab.props.style);
    expect(flat.borderBottomColor).toBe(darkColors.textBrand);
  });
});
