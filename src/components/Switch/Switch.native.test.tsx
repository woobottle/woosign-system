/**
 * Native harness tests for Switch. 스모크 렌더만.
 * track 색은 Animated.interpolate 객체라 StyleSheet.flatten으로 문자열 단언이
 * 불가능하다 — 다크 배선은 web Switch 다크 테스트 + 공유 getTrackColors(colors)
 * 팩토리로 커버된다. 여기서는 네이티브 렌더가 깨지지 않는지만 본다.
 */
import {render, screen} from '@testing-library/react-native';
import {Switch} from './Switch.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';

describe('Switch (native)', () => {
  it('renders with a label (light smoke)', () => {
    render(
      <Switch checked={false} onCheckedChange={() => {}} label="알림" />,
    );
    expect(screen.getByText('알림')).toBeTruthy();
  });

  it('renders inside a dark ThemeProvider without crashing', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Switch checked onCheckedChange={() => {}} label="알림" />
      </ThemeProvider>,
    );
    expect(screen.getByText('알림')).toBeTruthy();
  });
});
