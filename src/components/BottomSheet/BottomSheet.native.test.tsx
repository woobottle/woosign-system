/**
 * Native harness tests for BottomSheet. react-native preset(jest), .native.tsx
 * 구현을 사용한다. Modal/ScrollView는 프리셋이 목킹하므로 이 테스트는 동작
 * (콜백/조건부 렌더/props 배선)만 검증한다 — 실제 스크롤/레이아웃은 범위 밖.
 */
import {Modal, ScrollView, StyleSheet, Text} from 'react-native';
import {render, screen, fireEvent} from '@testing-library/react-native';
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

  it('calls onClose when the scrim is pressed', () => {
    const onClose = jest.fn();
    render(
      <BottomSheet open onClose={onClose} testID="sheet">
        <Text>본문</Text>
      </BottomSheet>,
    );
    fireEvent.press(screen.getByTestId('sheet-scrim'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on scrim press when closeOnScrimClick=false', () => {
    const onClose = jest.fn();
    render(
      <BottomSheet
        open
        onClose={onClose}
        closeOnScrimClick={false}
        testID="sheet">
        <Text>본문</Text>
      </BottomSheet>,
    );
    fireEvent.press(screen.getByTestId('sheet-scrim'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose on Android back (Modal onRequestClose)', () => {
    const onClose = jest.fn();
    render(
      <BottomSheet open onClose={onClose}>
        <Text>본문</Text>
      </BottomSheet>,
    );
    screen.UNSAFE_getByType(Modal).props.onRequestClose();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on back when closeOnEsc=false', () => {
    const onClose = jest.fn();
    render(
      <BottomSheet open onClose={onClose} closeOnEsc={false}>
        <Text>본문</Text>
      </BottomSheet>,
    );
    screen.UNSAFE_getByType(Modal).props.onRequestClose();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders the grab handle by default and hides it when dragToClose=false', () => {
    const {rerender} = render(
      <BottomSheet open onClose={() => {}} testID="sheet">
        <Text>본문</Text>
      </BottomSheet>,
    );
    expect(screen.queryByTestId('sheet-handle')).not.toBeNull();
    rerender(
      <BottomSheet open onClose={() => {}} dragToClose={false} testID="sheet">
        <Text>본문</Text>
      </BottomSheet>,
    );
    expect(screen.queryByTestId('sheet-handle')).toBeNull();
  });

  // 표면 Pressable 자체의 onPress가 no-op임을 확인한다. 주의: fireEvent.press는
  // 네이티브 터치 버블링을 재현하지 않으므로 "표면 탭이 scrim까지 전파되지
  // 않는다"는 런타임 동작 자체는 검증하지 못한다 — 표면 핸들러가 닫지 않음만 확인.
  it('surface press handler is a no-op (does not call onClose itself)', () => {
    const onClose = jest.fn();
    render(
      <BottomSheet open onClose={onClose} testID="sheet">
        <Text>본문</Text>
      </BottomSheet>,
    );
    fireEvent.press(screen.getByTestId('sheet'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders subcomponents and gives the Body a shrinkable ScrollView', () => {
    render(
      <BottomSheet open onClose={() => {}}>
        <BottomSheet.Header>
          <BottomSheet.Title>제목</BottomSheet.Title>
          <BottomSheet.Description>설명</BottomSheet.Description>
        </BottomSheet.Header>
        <BottomSheet.Body>
          <Text>본문</Text>
        </BottomSheet.Body>
        <BottomSheet.Footer>
          <Text>확인</Text>
        </BottomSheet.Footer>
      </BottomSheet>,
    );
    expect(screen.getByText('제목')).toBeTruthy();
    expect(screen.getByText('설명')).toBeTruthy();
    expect(screen.getByText('본문')).toBeTruthy();
    expect(screen.getByText('확인')).toBeTruthy();
    const flat = StyleSheet.flatten(
      screen.UNSAFE_getByType(ScrollView).props.style,
    );
    expect(flat.flexShrink).toBe(1);
  });
});
