/**
 * Native harness tests for BottomSheet. react-native preset(jest), .native.tsx
 * 구현을 사용한다. Modal/ScrollView는 프리셋이 목킹하므로 이 테스트는 동작
 * (콜백/조건부 렌더/props 배선)만 검증한다 — 실제 스크롤/레이아웃은 범위 밖.
 */
import {Text} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {BottomSheet} from './BottomSheet.native';

describe('BottomSheet (native)', () => {
  it('does not render content when closed', () => {
    render(
      <BottomSheet open={false} onClose={() => {}}>
        <Text>본문</Text>
      </BottomSheet>,
    );
    expect(screen.queryByText('본문')).toBeNull();
  });

  it('renders content when open', () => {
    render(
      <BottomSheet open onClose={() => {}}>
        <Text>본문</Text>
      </BottomSheet>,
    );
    expect(screen.queryByText('본문')).not.toBeNull();
  });
});
