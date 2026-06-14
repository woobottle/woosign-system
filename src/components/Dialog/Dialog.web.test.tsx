/**
 * Web harness tests for Dialog. jsdom 환경, .web.tsx 구현을 사용한다.
 */
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Dialog} from './Dialog';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Dialog (web)', () => {
  it('does not render content when closed', () => {
    render(
      <Dialog open={false} onClose={() => {}}>
        <div>본문</div>
      </Dialog>,
    );
    expect(screen.queryByText('본문')).not.toBeInTheDocument();
  });

  it('renders content when open with role=dialog and aria-modal', () => {
    render(
      <Dialog open onClose={() => {}}>
        <div>본문</div>
      </Dialog>,
    );
    expect(screen.getByText('본문')).toBeInTheDocument();
    const surface = screen.getByRole('dialog');
    expect(surface).toHaveAttribute('aria-modal', 'true');
  });

  it('calls onClose when scrim is clicked', async () => {
    const onClose = jest.fn();
    render(
      <Dialog open onClose={onClose} testID="dlg">
        <div>본문</div>
      </Dialog>,
    );
    await userEvent.click(screen.getByTestId('dlg-scrim'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on scrim click when closeOnScrimClick=false', async () => {
    const onClose = jest.fn();
    render(
      <Dialog open onClose={onClose} closeOnScrimClick={false} testID="dlg">
        <div>본문</div>
      </Dialog>,
    );
    await userEvent.click(screen.getByTestId('dlg-scrim'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not call onClose when the surface is clicked (no propagation)', async () => {
    const onClose = jest.fn();
    render(
      <Dialog open onClose={onClose}>
        <div>본문</div>
      </Dialog>,
    );
    await userEvent.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose on Escape key', async () => {
    const onClose = jest.fn();
    render(
      <Dialog open onClose={onClose}>
        <div>본문</div>
      </Dialog>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on Escape when closeOnEsc=false', async () => {
    const onClose = jest.fn();
    render(
      <Dialog open onClose={onClose} closeOnEsc={false}>
        <div>본문</div>
      </Dialog>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders subcomponents and wires aria-labelledby to the title', () => {
    render(
      <Dialog open onClose={() => {}}>
        <Dialog.Header>
          <Dialog.Title>제목</Dialog.Title>
          <Dialog.Description>설명</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>본문</Dialog.Body>
        <Dialog.Footer>
          <button>확인</button>
        </Dialog.Footer>
      </Dialog>,
    );
    const surface = screen.getByRole('dialog');
    const labelledBy = surface.getAttribute('aria-labelledby');
    const title = screen.getByText('제목');
    expect(title).toHaveAttribute('id', labelledBy);
    const describedBy = surface.getAttribute('aria-describedby');
    const description = screen.getByText('설명');
    expect(description).toHaveAttribute('id', describedBy);
    expect(screen.getByText('본문')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: '확인'})).toBeInTheDocument();
  });

  it('omits aria-describedby when no Description is rendered', () => {
    render(
      <Dialog open onClose={() => {}}>
        <Dialog.Header>
          <Dialog.Title>제목만</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>본문</Dialog.Body>
      </Dialog>,
    );
    const surface = screen.getByRole('dialog');
    expect(surface).not.toHaveAttribute('aria-describedby');
    expect(surface).toHaveAttribute('aria-labelledby');
  });

  it('exposes subcomponents as standalone named exports', () => {
    const mod = require('./Dialog');
    expect(typeof mod.DialogHeader).toBe('function');
    expect(typeof mod.DialogTitle).toBe('function');
    expect(typeof mod.DialogDescription).toBe('function');
    expect(typeof mod.DialogBody).toBe('function');
    expect(typeof mod.DialogFooter).toBe('function');
  });

  it('uses the dark surface token inside a dark ThemeProvider', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Dialog open onClose={() => {}}>
          <div>본문</div>
        </Dialog>
      </ThemeProvider>,
    );
    expect(screen.getByRole('dialog')).toHaveStyle({
      backgroundColor: darkColors.card,
    });
  });
});
