/**
 * Web harness tests for the imperative DialogProvider. jsdom 환경.
 * 소비자 컴포넌트(Harness)가 useDialog()를 호출하고, 반환된 Promise를
 * 테스트가 await해 resolve 값을 검증한다.
 */
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {DialogProvider} from './DialogProvider';
import {useDialog} from './useDialog';
import {colors} from '../../core/theme/tokens';
import type {ConfirmOptions, AlertOptions} from './types';

/** confirm()을 호출하고 그 Promise를 콜백으로 넘기는 소비자. */
function ConfirmHarness({
  options,
  onPromise,
}: {
  options: ConfirmOptions;
  onPromise: (p: Promise<boolean>) => void;
}) {
  const dialog = useDialog();
  return (
    <button onClick={() => onPromise(dialog.confirm(options))}>open</button>
  );
}

/** alert()을 호출하는 소비자. */
function AlertHarness({
  options,
  onPromise,
}: {
  options: AlertOptions;
  onPromise: (p: Promise<void>) => void;
}) {
  const dialog = useDialog();
  return <button onClick={() => onPromise(dialog.alert(options))}>open</button>;
}

describe('DialogProvider (web)', () => {
  it('renders title, description and confirm/cancel buttons on confirm()', async () => {
    render(
      <DialogProvider>
        <ConfirmHarness
          options={{title: '삭제할까요?', description: '되돌릴 수 없어요.'}}
          onPromise={() => {}}
        />
      </DialogProvider>,
    );
    await userEvent.click(screen.getByText('open'));
    expect(screen.getByText('삭제할까요?')).toBeInTheDocument();
    expect(screen.getByText('되돌릴 수 없어요.')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: '확인'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: '취소'})).toBeInTheDocument();
  });

  it('resolves true when the confirm button is clicked', async () => {
    let promise!: Promise<boolean>;
    render(
      <DialogProvider>
        <ConfirmHarness
          options={{title: '삭제할까요?'}}
          onPromise={p => {
            promise = p;
          }}
        />
      </DialogProvider>,
    );
    await userEvent.click(screen.getByText('open'));
    await userEvent.click(screen.getByRole('button', {name: '확인'}));
    await expect(promise).resolves.toBe(true);
  });

  it('resolves false when the cancel button is clicked', async () => {
    let promise!: Promise<boolean>;
    render(
      <DialogProvider>
        <ConfirmHarness
          options={{title: '삭제할까요?'}}
          onPromise={p => {
            promise = p;
          }}
        />
      </DialogProvider>,
    );
    await userEvent.click(screen.getByText('open'));
    await userEvent.click(screen.getByRole('button', {name: '취소'}));
    await expect(promise).resolves.toBe(false);
  });

  it('resolves false when the scrim is clicked (dismiss = cancel)', async () => {
    let promise!: Promise<boolean>;
    render(
      <DialogProvider>
        <ConfirmHarness
          options={{title: '삭제할까요?'}}
          onPromise={p => {
            promise = p;
          }}
        />
      </DialogProvider>,
    );
    await userEvent.click(screen.getByText('open'));
    await userEvent.click(screen.getByTestId('dialog-scrim'));
    await expect(promise).resolves.toBe(false);
  });

  it('alert() shows only a confirm button and resolves on click', async () => {
    let promise!: Promise<void>;
    render(
      <DialogProvider>
        <AlertHarness
          options={{title: '저장됐어요'}}
          onPromise={p => {
            promise = p;
          }}
        />
      </DialogProvider>,
    );
    await userEvent.click(screen.getByText('open'));
    expect(screen.getByText('저장됐어요')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', {name: '취소'}),
    ).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {name: '확인'}));
    await expect(promise).resolves.toBeUndefined();
  });

  it('uses the destructive variant on the confirm button when tone is destructive', async () => {
    render(
      <DialogProvider>
        <ConfirmHarness
          options={{
            title: '삭제할까요?',
            tone: 'destructive',
            confirmText: '삭제',
          }}
          onPromise={() => {}}
        />
      </DialogProvider>,
    );
    await userEvent.click(screen.getByText('open'));
    expect(screen.getByRole('button', {name: '삭제'})).toHaveStyle({
      backgroundColor: colors.actionDanger,
    });
  });

  it('queues dialogs: the second confirm shows only after the first is answered', async () => {
    let p1!: Promise<boolean>;
    let p2!: Promise<boolean>;
    function TwoHarness() {
      const dialog = useDialog();
      return (
        <button
          onClick={() => {
            p1 = dialog.confirm({title: '첫 번째'});
            p2 = dialog.confirm({title: '두 번째'});
          }}>
          open
        </button>
      );
    }
    render(
      <DialogProvider>
        <TwoHarness />
      </DialogProvider>,
    );
    await userEvent.click(screen.getByText('open'));
    expect(screen.getByText('첫 번째')).toBeInTheDocument();
    expect(screen.queryByText('두 번째')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {name: '확인'}));
    await expect(p1).resolves.toBe(true);
    expect(screen.getByText('두 번째')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {name: '취소'}));
    await expect(p2).resolves.toBe(false);
  });
});
