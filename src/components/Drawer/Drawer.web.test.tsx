/**
 * Web harness tests for Drawer. jsdom 환경, .web.tsx 구현을 사용한다.
 */
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Drawer} from './Drawer';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Drawer (web)', () => {
  it('does not render content when closed', () => {
    render(
      <Drawer open={false} onClose={() => {}}>
        <div>본문</div>
      </Drawer>,
    );
    expect(screen.queryByText('본문')).not.toBeInTheDocument();
  });

  it('renders content when open with role=dialog and aria-modal', () => {
    render(
      <Drawer open onClose={() => {}}>
        <div>본문</div>
      </Drawer>,
    );
    expect(screen.getByText('본문')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('calls onClose when scrim is clicked', async () => {
    const onClose = jest.fn();
    render(
      <Drawer open onClose={onClose} testID="nav">
        <div>본문</div>
      </Drawer>,
    );
    await userEvent.click(screen.getByTestId('nav-scrim'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on scrim click when closeOnScrimClick=false', async () => {
    const onClose = jest.fn();
    render(
      <Drawer open onClose={onClose} closeOnScrimClick={false} testID="nav">
        <div>본문</div>
      </Drawer>,
    );
    await userEvent.click(screen.getByTestId('nav-scrim'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not call onClose when the panel is clicked (no propagation)', async () => {
    const onClose = jest.fn();
    render(
      <Drawer open onClose={onClose}>
        <div>본문</div>
      </Drawer>,
    );
    await userEvent.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose on Escape key', async () => {
    const onClose = jest.fn();
    render(
      <Drawer open onClose={onClose}>
        <div>본문</div>
      </Drawer>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on Escape when closeOnEsc=false', async () => {
    const onClose = jest.fn();
    render(
      <Drawer open onClose={onClose} closeOnEsc={false}>
        <div>본문</div>
      </Drawer>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('applies the width prop to the panel', () => {
    render(
      <Drawer open onClose={() => {}} width={420}>
        <div>본문</div>
      </Drawer>,
    );
    expect(screen.getByRole('dialog')).toHaveStyle({width: '420px'});
  });

  it('renders subcomponents and wires aria-labelledby/ describedby', () => {
    render(
      <Drawer open onClose={() => {}}>
        <Drawer.Header>
          <Drawer.Title>제목</Drawer.Title>
          <Drawer.Description>설명</Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>본문</Drawer.Body>
        <Drawer.Footer>
          <button>확인</button>
        </Drawer.Footer>
      </Drawer>,
    );
    const surface = screen.getByRole('dialog');
    expect(screen.getByText('제목')).toHaveAttribute(
      'id',
      surface.getAttribute('aria-labelledby'),
    );
    expect(screen.getByText('설명')).toHaveAttribute(
      'id',
      surface.getAttribute('aria-describedby'),
    );
    expect(screen.getByText('본문')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: '확인'})).toBeInTheDocument();
  });

  it('omits aria-describedby when no Description is rendered', () => {
    render(
      <Drawer open onClose={() => {}}>
        <Drawer.Header>
          <Drawer.Title>제목만</Drawer.Title>
        </Drawer.Header>
      </Drawer>,
    );
    const surface = screen.getByRole('dialog');
    expect(surface).not.toHaveAttribute('aria-describedby');
    expect(surface).toHaveAttribute('aria-labelledby');
  });

  it('uses the dark surface token inside a dark ThemeProvider', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Drawer open onClose={() => {}} testID="nav">
          <div>본문</div>
        </Drawer>
      </ThemeProvider>,
    );
    expect(screen.getByTestId('nav')).toHaveStyle({
      backgroundColor: darkColors.card,
    });
  });

  it('exposes subcomponents as standalone named exports', () => {
    const mod = require('./Drawer');
    expect(typeof mod.DrawerHeader).toBe('function');
    expect(typeof mod.DrawerTitle).toBe('function');
    expect(typeof mod.DrawerDescription).toBe('function');
    expect(typeof mod.DrawerBody).toBe('function');
    expect(typeof mod.DrawerFooter).toBe('function');
  });
});
