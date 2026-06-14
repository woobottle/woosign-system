/**
 * Native harness tests for Dialog. react-native preset(jest), .native.tsx
 * 구현을 사용한다. Modal은 프리셋이 목킹하므로 이 테스트는 동작만 검증한다.
 * (aria 관련은 web 전용이라 제외 — native는 aria 미사용.)
 */
import {Modal, Text} from 'react-native';
import {render, screen, fireEvent} from '@testing-library/react-native';
import {Dialog} from './Dialog.native';

describe('Dialog (native)', () => {
  it('does not render content when closed', () => {
    render(
      <Dialog open={false} onClose={() => {}}>
        <Text>본문</Text>
      </Dialog>,
    );
    expect(screen.queryByText('본문')).toBeNull();
  });

  it('renders content when open', () => {
    render(
      <Dialog open onClose={() => {}}>
        <Text>본문</Text>
      </Dialog>,
    );
    expect(screen.queryByText('본문')).not.toBeNull();
  });

  it('calls onClose when the scrim is pressed', () => {
    const onClose = jest.fn();
    render(
      <Dialog open onClose={onClose} testID="dlg">
        <Text>본문</Text>
      </Dialog>,
    );
    fireEvent.press(screen.getByTestId('dlg-scrim'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on scrim press when closeOnScrimClick=false', () => {
    const onClose = jest.fn();
    render(
      <Dialog open onClose={onClose} closeOnScrimClick={false} testID="dlg">
        <Text>본문</Text>
      </Dialog>,
    );
    fireEvent.press(screen.getByTestId('dlg-scrim'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose on Android back (Modal onRequestClose)', () => {
    const onClose = jest.fn();
    render(
      <Dialog open onClose={onClose}>
        <Text>본문</Text>
      </Dialog>,
    );
    screen.UNSAFE_getByType(Modal).props.onRequestClose();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on back when closeOnEsc=false', () => {
    const onClose = jest.fn();
    render(
      <Dialog open onClose={onClose} closeOnEsc={false}>
        <Text>본문</Text>
      </Dialog>,
    );
    screen.UNSAFE_getByType(Modal).props.onRequestClose();
    expect(onClose).not.toHaveBeenCalled();
  });

  // 표면 Pressable 자체의 onPress가 no-op임을 확인한다. 주의: fireEvent.press는
  // 네이티브 터치 버블링을 재현하지 않으므로 "표면 탭이 scrim까지 전파되지
  // 않는다"는 런타임 동작 자체는 검증하지 못한다 — 표면 핸들러가 닫지 않음만 확인.
  it('surface press handler is a no-op (does not call onClose itself)', () => {
    const onClose = jest.fn();
    render(
      <Dialog open onClose={onClose} testID="dlg">
        <Text>본문</Text>
      </Dialog>,
    );
    fireEvent.press(screen.getByTestId('dlg'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders subcomponents', () => {
    render(
      <Dialog open onClose={() => {}}>
        <Dialog.Header>
          <Dialog.Title>제목</Dialog.Title>
          <Dialog.Description>설명</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <Text>본문</Text>
        </Dialog.Body>
        <Dialog.Footer>
          <Text>확인</Text>
        </Dialog.Footer>
      </Dialog>,
    );
    expect(screen.getByText('제목')).toBeTruthy();
    expect(screen.getByText('설명')).toBeTruthy();
    expect(screen.getByText('본문')).toBeTruthy();
    expect(screen.getByText('확인')).toBeTruthy();
  });

  it('exposes subcomponents as standalone named exports', () => {
    const mod = require('./Dialog.native');
    expect(typeof mod.DialogHeader).toBe('function');
    expect(typeof mod.DialogTitle).toBe('function');
    expect(typeof mod.DialogDescription).toBe('function');
    expect(typeof mod.DialogBody).toBe('function');
    expect(typeof mod.DialogFooter).toBe('function');
  });
});
