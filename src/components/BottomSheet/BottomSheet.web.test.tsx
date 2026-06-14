/**
 * Web harness tests for BottomSheet. jsdom 환경, .web.tsx 구현을 사용한다.
 */
import {render, screen, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {BottomSheet} from './BottomSheet';

describe('BottomSheet (web)', () => {
  it('does not render content when closed', () => {
    render(
      <BottomSheet open={false} onClose={() => {}}>
        <div>본문</div>
      </BottomSheet>,
    );
    expect(screen.queryByText('본문')).not.toBeInTheDocument();
  });

  it('renders content when open with role=dialog and aria-modal', () => {
    render(
      <BottomSheet open onClose={() => {}}>
        <div>본문</div>
      </BottomSheet>,
    );
    expect(screen.getByText('본문')).toBeInTheDocument();
    const surface = screen.getByRole('dialog');
    expect(surface).toHaveAttribute('aria-modal', 'true');
  });

  it('calls onClose when scrim is clicked', async () => {
    const onClose = jest.fn();
    render(
      <BottomSheet open onClose={onClose} testID="sheet">
        <div>본문</div>
      </BottomSheet>,
    );
    await userEvent.click(screen.getByTestId('sheet-scrim'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on scrim click when closeOnScrimClick=false', async () => {
    const onClose = jest.fn();
    render(
      <BottomSheet
        open
        onClose={onClose}
        closeOnScrimClick={false}
        testID="sheet">
        <div>본문</div>
      </BottomSheet>,
    );
    await userEvent.click(screen.getByTestId('sheet-scrim'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not call onClose when the surface is clicked (no propagation)', async () => {
    const onClose = jest.fn();
    render(
      <BottomSheet open onClose={onClose}>
        <div>본문</div>
      </BottomSheet>,
    );
    await userEvent.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose on Escape key', async () => {
    const onClose = jest.fn();
    render(
      <BottomSheet open onClose={onClose}>
        <div>본문</div>
      </BottomSheet>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on Escape when closeOnEsc=false', async () => {
    const onClose = jest.fn();
    render(
      <BottomSheet open onClose={onClose} closeOnEsc={false}>
        <div>본문</div>
      </BottomSheet>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders the grab handle by default and hides it when dragToClose=false', () => {
    const {rerender} = render(
      <BottomSheet open onClose={() => {}} testID="sheet">
        <div>본문</div>
      </BottomSheet>,
    );
    expect(screen.getByTestId('sheet-handle')).toBeInTheDocument();
    rerender(
      <BottomSheet open onClose={() => {}} dragToClose={false} testID="sheet">
        <div>본문</div>
      </BottomSheet>,
    );
    expect(screen.queryByTestId('sheet-handle')).not.toBeInTheDocument();
  });

  it('calls onClose after a long downward handle drag', () => {
    const onClose = jest.fn();
    render(
      <BottomSheet open onClose={onClose} testID="sheet">
        <div>본문</div>
      </BottomSheet>,
    );
    const handle = screen.getByTestId('sheet-handle');
    // jsdom은 offsetHeight=0 → shouldDismiss가 fallback 거리(120px) 기준으로 판정
    fireEvent.pointerDown(handle, {pointerId: 1, clientY: 300});
    fireEvent.pointerMove(handle, {pointerId: 1, clientY: 500});
    fireEvent.pointerUp(handle, {pointerId: 1, clientY: 500});
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose after a short slow handle drag', () => {
    const onClose = jest.fn();
    render(
      <BottomSheet open onClose={onClose} testID="sheet">
        <div>본문</div>
      </BottomSheet>,
    );
    const handle = screen.getByTestId('sheet-handle');
    fireEvent.pointerDown(handle, {pointerId: 1, clientY: 300});
    fireEvent.pointerMove(handle, {pointerId: 1, clientY: 310});
    fireEvent.pointerUp(handle, {pointerId: 1, clientY: 310});
    // dy=10 → 거리 임계 미달, 플릭 최소 거리(24px)도 미달
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not call onClose when the drag is cancelled (pointercancel)', () => {
    const onClose = jest.fn();
    render(
      <BottomSheet open onClose={onClose} testID="sheet">
        <div>본문</div>
      </BottomSheet>,
    );
    const handle = screen.getByTestId('sheet-handle');
    fireEvent.pointerDown(handle, {pointerId: 1, clientY: 300});
    fireEvent.pointerMove(handle, {pointerId: 1, clientY: 500});
    fireEvent.pointerCancel(handle, {pointerId: 1, clientY: 500});
    // 긴 드래그였더라도 취소 시엔 디스미스하지 않고 복귀만 한다
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders subcomponents and wires aria-labelledby to the title', () => {
    render(
      <BottomSheet open onClose={() => {}}>
        <BottomSheet.Header>
          <BottomSheet.Title>제목</BottomSheet.Title>
          <BottomSheet.Description>설명</BottomSheet.Description>
        </BottomSheet.Header>
        <BottomSheet.Body>본문</BottomSheet.Body>
        <BottomSheet.Footer>
          <button>확인</button>
        </BottomSheet.Footer>
      </BottomSheet>,
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
      <BottomSheet open onClose={() => {}}>
        <BottomSheet.Header>
          <BottomSheet.Title>제목만</BottomSheet.Title>
        </BottomSheet.Header>
        <BottomSheet.Body>본문</BottomSheet.Body>
      </BottomSheet>,
    );
    const surface = screen.getByRole('dialog');
    expect(surface).not.toHaveAttribute('aria-describedby');
    expect(surface).toHaveAttribute('aria-labelledby');
  });

  it('lets consumer style override the Body scroll default', () => {
    render(
      <BottomSheet open onClose={() => {}}>
        <BottomSheet.Body style={{overflowY: 'hidden'}}>본문</BottomSheet.Body>
      </BottomSheet>,
    );
    expect(screen.getByText('본문')).toHaveStyle({overflowY: 'hidden'});
  });

  it('exposes subcomponents as standalone named exports', () => {
    const mod = require('./BottomSheet');
    expect(typeof mod.BottomSheetHeader).toBe('function');
    expect(typeof mod.BottomSheetTitle).toBe('function');
    expect(typeof mod.BottomSheetDescription).toBe('function');
    expect(typeof mod.BottomSheetBody).toBe('function');
    expect(typeof mod.BottomSheetFooter).toBe('function');
  });
});
