/**
 * Native harness tests for Drawer. react-native preset, .native.tsx 구현.
 * Modal은 프리셋이 목킹하므로 동작(콜백/조건부 렌더/표면 토큰)만 검증한다.
 */
import {Modal, StyleSheet, Text} from 'react-native';
import {render, screen, fireEvent} from '@testing-library/react-native';
import {Drawer} from './Drawer.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Drawer (native)', () => {
  it('does not render content when closed', () => {
    render(
      <Drawer open={false} onClose={() => {}}>
        <Text>본문</Text>
      </Drawer>,
    );
    expect(screen.queryByText('본문')).toBeNull();
  });

  it('renders content when open', () => {
    render(
      <Drawer open onClose={() => {}}>
        <Text>본문</Text>
      </Drawer>,
    );
    expect(screen.queryByText('본문')).not.toBeNull();
  });

  it('calls onClose when the scrim is pressed', () => {
    const onClose = jest.fn();
    render(
      <Drawer open onClose={onClose} testID="nav">
        <Text>본문</Text>
      </Drawer>,
    );
    fireEvent.press(screen.getByTestId('nav-scrim'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on scrim press when closeOnScrimClick=false', () => {
    const onClose = jest.fn();
    render(
      <Drawer open onClose={onClose} closeOnScrimClick={false} testID="nav">
        <Text>본문</Text>
      </Drawer>,
    );
    fireEvent.press(screen.getByTestId('nav-scrim'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose on Android back (Modal onRequestClose)', () => {
    const onClose = jest.fn();
    render(
      <Drawer open onClose={onClose}>
        <Text>본문</Text>
      </Drawer>,
    );
    screen.UNSAFE_getByType(Modal).props.onRequestClose();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on back when closeOnEsc=false', () => {
    const onClose = jest.fn();
    render(
      <Drawer open onClose={onClose} closeOnEsc={false}>
        <Text>본문</Text>
      </Drawer>,
    );
    screen.UNSAFE_getByType(Modal).props.onRequestClose();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('surface press handler is a no-op (does not call onClose itself)', () => {
    const onClose = jest.fn();
    render(
      <Drawer open onClose={onClose} testID="nav">
        <Text>본문</Text>
      </Drawer>,
    );
    fireEvent.press(screen.getByTestId('nav'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders subcomponents', () => {
    render(
      <Drawer open onClose={() => {}}>
        <Drawer.Header>
          <Drawer.Title>제목</Drawer.Title>
          <Drawer.Description>설명</Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>
          <Text>본문</Text>
        </Drawer.Body>
        <Drawer.Footer>
          <Text>확인</Text>
        </Drawer.Footer>
      </Drawer>,
    );
    expect(screen.getByText('제목')).toBeTruthy();
    expect(screen.getByText('설명')).toBeTruthy();
    expect(screen.getByText('본문')).toBeTruthy();
    expect(screen.getByText('확인')).toBeTruthy();
  });

  it('uses the dark surface token inside a dark ThemeProvider', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Drawer open onClose={() => {}} testID="nav">
          <Text>본문</Text>
        </Drawer>
      </ThemeProvider>,
    );
    const flat = StyleSheet.flatten(screen.getByTestId('nav').props.style);
    expect(flat.backgroundColor).toBe(darkColors.card);
  });

  it('exposes subcomponents as standalone named exports', () => {
    const mod = require('./Drawer.native');
    expect(typeof mod.DrawerHeader).toBe('function');
    expect(typeof mod.DrawerTitle).toBe('function');
    expect(typeof mod.DrawerDescription).toBe('function');
    expect(typeof mod.DrawerBody).toBe('function');
    expect(typeof mod.DrawerFooter).toBe('function');
  });
});
