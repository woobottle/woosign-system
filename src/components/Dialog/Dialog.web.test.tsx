/**
 * Web harness tests for Dialog. jsdom 환경, .web.tsx 구현을 사용한다.
 */
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Dialog} from './Dialog';

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
});
