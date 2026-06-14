# Dialog 임퍼러티브 API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기존 controlled `<Dialog>` 위에 Promise 기반 임퍼러티브 `useDialog().confirm()/alert()` 레이어(Provider + hook + 큐잉 상태머신)를 추가한다.

**Architecture:** Toast의 Provider+hook+상태머신 규약을 미러링한다. `useDialogState`가 큐와 Promise resolve를 소유하고, `DialogProvider`가 큐 head를 controlled `<Dialog>` + `Button`으로 렌더한다. `useDialog()`는 `DialogImperativeContext`에서 API를 읽고 Provider 밖이면 throw한다. 기존 Dialog 컴포넌트/서브컴포넌트는 무손상.

**Tech Stack:** React(useState/useRef/useCallback/useMemo), `@testing-library/react`(+renderHook, userEvent), jest(web jsdom + native react-native preset), `@testing-library/react-native`.

**Spec:** `docs/superpowers/specs/2026-06-14-dialog-imperative-api-design.md`

검증된 사실:
- Button variant 배경: `default` → `colors.actionPrimary`, `destructive` → `colors.actionDanger`, `secondary` → `colors.card`.
- Toast 패턴 파일: `ToastContext.ts`(`createContext<ToastApi|null>(null)`), `useToast.ts`(throw if null), `useToastState.ts`(상태머신), `ToastProvider.web/.native/.tsx`.
- Dialog.web의 scrim testID 기본값은 `'dialog-scrim'`(Provider는 Dialog에 testID를 주지 않음). Dialog.native도 동일. Modal back은 `UNSAFE_getByType(Modal).props.onRequestClose()`.
- `@testing-library/react`(v16)는 `renderHook`을 export한다.

---

## File Structure

```
src/components/Dialog/
  types.ts                       # MODIFY: ConfirmOptions/AlertOptions/DialogApi/DialogEntry/DialogProviderProps 추가
  DialogImperativeContext.ts     # CREATE: createContext<DialogApi|null>(null)
  useDialog.ts                   # CREATE: consumer hook (throw outside provider)
  useDialog.web.test.tsx         # CREATE: throw 테스트
  useDialogState.ts              # CREATE: 큐 + Promise resolve 상태머신
  DialogProvider.web.tsx         # CREATE: 큐 head를 <Dialog>로 렌더 + Context
  DialogProvider.tsx             # CREATE: web facade
  DialogProvider.web.test.tsx    # CREATE: confirm/alert/cancel/scrim/queue/destructive 테스트
  DialogProvider.native.tsx      # CREATE: RN 버전
  DialogProvider.native.test.tsx # CREATE: 핵심 동작 미러
  DialogProvider.web.stories.tsx # CREATE: 데모
  index.ts                       # MODIFY: Provider/hook/타입 export
```

---

### Task 1: 타입 + Context + useDialog (throw 테스트)

**Files:**
- Modify: `src/components/Dialog/types.ts`
- Create: `src/components/Dialog/DialogImperativeContext.ts`
- Create: `src/components/Dialog/useDialog.ts`
- Create: `src/components/Dialog/useDialog.web.test.tsx`

- [ ] **Step 1: types.ts에 임퍼러티브 타입 추가**

`src/components/Dialog/types.ts` 맨 끝에 추가(기존 내용은 그대로):

```ts
/** useDialog().confirm(...) 옵션. */
export interface ConfirmOptions {
  title: ReactNode;
  description?: ReactNode;
  /** 확인 버튼 라벨. 기본 '확인'. */
  confirmText?: string;
  /** 취소 버튼 라벨. 기본 '취소'. */
  cancelText?: string;
  /** 'destructive'면 확인 버튼이 destructive variant. 기본 'default'. */
  tone?: 'default' | 'destructive';
}

/** useDialog().alert(...) 옵션. */
export interface AlertOptions {
  title: ReactNode;
  description?: ReactNode;
  /** 확인 버튼 라벨. 기본 '확인'. */
  confirmText?: string;
}

/** useDialog()가 반환하는 임퍼러티브 API. */
export interface DialogApi {
  /** 확인=true, 취소/scrim/Esc=false. */
  confirm(options: ConfirmOptions): Promise<boolean>;
  /** 닫히면 resolve. */
  alert(options: AlertOptions): Promise<void>;
}

/** 내부 큐 엔트리 — id/resolve는 상태머신이 부여. */
export type DialogEntry =
  | {
      id: string;
      kind: 'confirm';
      options: ConfirmOptions;
      resolve: (value: boolean) => void;
    }
  | {
      id: string;
      kind: 'alert';
      options: AlertOptions;
      resolve: () => void;
    };

export interface DialogProviderProps {
  children?: ReactNode;
}
```

`ReactNode`는 파일 상단에서 이미 import되어 있다(`import type {ReactNode} from 'react';`). 확인만 하고 중복 import하지 말 것.

- [ ] **Step 2: DialogImperativeContext.ts 작성**

`src/components/Dialog/DialogImperativeContext.ts`:

```ts
import {createContext} from 'react';
import type {DialogApi} from './types';

/**
 * `<DialogProvider>`가 노출하는 임퍼러티브 DialogApi를 useDialog() 소비자에게
 * 전달한다. `null`이면 Provider가 트리에 없는 것 — useDialog()가 throw한다.
 *
 * 주의: 기존 DialogContext(aria id 전달, web 내부용)와 역할이 다르므로 별도 파일.
 */
export const DialogImperativeContext = createContext<DialogApi | null>(null);
DialogImperativeContext.displayName = 'DialogImperativeContext';
```

- [ ] **Step 3: useDialog throw 테스트 작성**

`src/components/Dialog/useDialog.web.test.tsx`:

```tsx
/**
 * useDialog()는 Provider 밖에서 호출되면 throw한다.
 */
import {renderHook} from '@testing-library/react';
import {useDialog} from './useDialog';

describe('useDialog (web)', () => {
  it('throws a helpful error when used outside DialogProvider', () => {
    // renderHook이 콘솔에 에러를 출력하므로 일시적으로 억제
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useDialog())).toThrow(/DialogProvider/);
    spy.mockRestore();
  });
});
```

- [ ] **Step 4: 테스트 실패 확인**

Run: `pnpm test -- --selectProjects web useDialog.web.test`
Expected: FAIL — `Cannot find module './useDialog'`.

- [ ] **Step 5: useDialog.ts 작성**

`src/components/Dialog/useDialog.ts`:

```ts
import {useContext} from 'react';
import {DialogImperativeContext} from './DialogImperativeContext';
import type {DialogApi} from './types';

/**
 * 임퍼러티브 Dialog API. `<DialogProvider>` 안에서만 호출할 수 있다.
 *
 * ```tsx
 * const dialog = useDialog();
 * const ok = await dialog.confirm({title: '삭제할까요?', tone: 'destructive'});
 * await dialog.alert({title: '저장됐어요'});
 * ```
 */
export function useDialog(): DialogApi {
  const ctx = useContext(DialogImperativeContext);
  if (!ctx) {
    throw new Error(
      'useDialog() must be used inside <DialogProvider>. ' +
        'Wrap your app (or the subtree that needs dialogs) with <DialogProvider>.',
    );
  }
  return ctx;
}
```

- [ ] **Step 6: 테스트 통과 + typecheck**

Run: `pnpm test -- --selectProjects web useDialog.web.test`
Expected: PASS (1 test).

Run: `pnpm typecheck`
Expected: 클린.

- [ ] **Step 7: 커밋**

```bash
git add src/components/Dialog/types.ts src/components/Dialog/DialogImperativeContext.ts src/components/Dialog/useDialog.ts src/components/Dialog/useDialog.web.test.tsx
git commit -m "feat(Dialog): imperative API types, context, useDialog hook

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: 상태머신 + Web Provider (TDD)

**Files:**
- Create: `src/components/Dialog/useDialogState.ts`
- Create: `src/components/Dialog/DialogProvider.web.tsx`
- Create: `src/components/Dialog/DialogProvider.tsx`
- Create: `src/components/Dialog/DialogProvider.web.test.tsx`

- [ ] **Step 1: Provider 동작 테스트 작성**

`src/components/Dialog/DialogProvider.web.test.tsx`:

```tsx
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
  return (
    <button onClick={() => onPromise(dialog.alert(options))}>open</button>
  );
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
    expect(screen.queryByRole('button', {name: '취소'})).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {name: '확인'}));
    await expect(promise).resolves.toBeUndefined();
  });

  it('uses the destructive variant on the confirm button when tone is destructive', async () => {
    render(
      <DialogProvider>
        <ConfirmHarness
          options={{title: '삭제할까요?', tone: 'destructive', confirmText: '삭제'}}
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
    // 첫 번째만 표시
    expect(screen.getByText('첫 번째')).toBeInTheDocument();
    expect(screen.queryByText('두 번째')).not.toBeInTheDocument();
    // 첫 번째 확인 → true, 그다음 두 번째가 표시
    await userEvent.click(screen.getByRole('button', {name: '확인'}));
    await expect(p1).resolves.toBe(true);
    expect(screen.getByText('두 번째')).toBeInTheDocument();
    // 두 번째 취소 → false
    await userEvent.click(screen.getByRole('button', {name: '취소'}));
    await expect(p2).resolves.toBe(false);
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `pnpm test -- --selectProjects web DialogProvider.web.test`
Expected: FAIL — `Cannot find module './DialogProvider'`.

- [ ] **Step 3: useDialogState.ts 작성**

`src/components/Dialog/useDialogState.ts`:

```ts
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {
  AlertOptions,
  ConfirmOptions,
  DialogApi,
  DialogEntry,
} from './types';

/**
 * 임퍼러티브 Dialog의 상태머신. 큐(한 번에 하나)와 각 호출의 Promise resolve를
 * 소유한다. 플랫폼 Provider는 렌더링만 담당한다.
 *
 * - confirm()/alert()는 엔트리를 큐에 push하고 Promise를 반환한다.
 * - confirmCurrent()/cancelCurrent()는 head를 resolve하고 큐에서 제거한다.
 * - dismiss(scrim/Esc/취소)는 cancelCurrent와 동일 경로다.
 */
export function useDialogState(): {
  api: DialogApi;
  current: DialogEntry | null;
  confirmCurrent: () => void;
  cancelCurrent: () => void;
} {
  const [queue, setQueue] = useState<DialogEntry[]>([]);
  const idRef = useRef(0);

  // head를 ref로 들고 있어 안정적인 핸들러가 최신 엔트리를 resolve할 수 있게 한다.
  const currentRef = useRef<DialogEntry | null>(null);
  currentRef.current = queue[0] ?? null;

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>(resolve => {
      idRef.current += 1;
      const entry: DialogEntry = {
        id: `wb-dialog-imperative-${idRef.current}`,
        kind: 'confirm',
        options,
        resolve,
      };
      setQueue(prev => [...prev, entry]);
    });
  }, []);

  const alert = useCallback((options: AlertOptions) => {
    return new Promise<void>(resolve => {
      idRef.current += 1;
      const entry: DialogEntry = {
        id: `wb-dialog-imperative-${idRef.current}`,
        kind: 'alert',
        options,
        resolve,
      };
      setQueue(prev => [...prev, entry]);
    });
  }, []);

  // value는 confirm일 때만 의미. resolve는 updater 밖에서 호출(부작용 분리).
  const settle = useCallback((value: boolean) => {
    const head = currentRef.current;
    if (!head) return;
    if (head.kind === 'confirm') head.resolve(value);
    else head.resolve();
    setQueue(prev => prev.slice(1));
  }, []);

  const confirmCurrent = useCallback(() => settle(true), [settle]);
  const cancelCurrent = useCallback(() => settle(false), [settle]);

  // 언마운트 시 남은 엔트리는 cancel로 resolve(매달린 Promise 방지).
  const queueRef = useRef(queue);
  queueRef.current = queue;
  useEffect(() => {
    return () => {
      queueRef.current.forEach(e => {
        if (e.kind === 'confirm') e.resolve(false);
        else e.resolve();
      });
    };
  }, []);

  const api = useMemo<DialogApi>(() => ({confirm, alert}), [confirm, alert]);
  return {api, current: queue[0] ?? null, confirmCurrent, cancelCurrent};
}
```

- [ ] **Step 4: DialogProvider.web.tsx 작성**

`src/components/Dialog/DialogProvider.web.tsx`:

```tsx
/**
 * DialogProvider — Web implementation.
 *
 * 임퍼러티브 DialogApi를 useDialog() 소비자에게 노출하고, 큐 head를 controlled
 * <Dialog>로 렌더한다. Dialog.web이 portal을 쓰므로 추가 portal은 불필요하다.
 * scrim/Esc(onClose)는 cancelCurrent에 연결 — 닫힘을 취소로 간주한다.
 */
import {Dialog} from './Dialog.web';
import {DialogImperativeContext} from './DialogImperativeContext';
import {useDialogState} from './useDialogState';
import {Button} from '../Button';
import type {DialogProviderProps} from './types';

export function DialogProvider({children}: DialogProviderProps) {
  const {api, current, confirmCurrent, cancelCurrent} = useDialogState();

  return (
    <DialogImperativeContext.Provider value={api}>
      {children}
      {current && (
        <Dialog open onClose={cancelCurrent}>
          <Dialog.Header>
            <Dialog.Title>{current.options.title}</Dialog.Title>
            {current.options.description != null && (
              <Dialog.Description>
                {current.options.description}
              </Dialog.Description>
            )}
          </Dialog.Header>
          <Dialog.Footer>
            {current.kind === 'confirm' && (
              <Button variant="secondary" onPress={cancelCurrent}>
                {current.options.cancelText ?? '취소'}
              </Button>
            )}
            <Button
              variant={
                current.kind === 'confirm' &&
                current.options.tone === 'destructive'
                  ? 'destructive'
                  : 'default'
              }
              onPress={confirmCurrent}>
              {current.options.confirmText ?? '확인'}
            </Button>
          </Dialog.Footer>
        </Dialog>
      )}
    </DialogImperativeContext.Provider>
  );
}

DialogProvider.displayName = 'DialogProvider';
```

- [ ] **Step 5: facade 작성**

`src/components/Dialog/DialogProvider.tsx`:

```tsx
// Web-side facade fallback: Metro reads src/ directly and resolves .native via platform extensions.
export {DialogProvider} from './DialogProvider.web';
```

- [ ] **Step 6: 테스트 통과 + typecheck**

Run: `pnpm test -- --selectProjects web DialogProvider.web.test`
Expected: PASS (7 tests).

Run: `pnpm typecheck`
Expected: 클린.

- [ ] **Step 7: 커밋**

```bash
git add src/components/Dialog/useDialogState.ts src/components/Dialog/DialogProvider.web.tsx src/components/Dialog/DialogProvider.tsx src/components/Dialog/DialogProvider.web.test.tsx
git commit -m "feat(Dialog): queueing state machine + web DialogProvider

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Native Provider + 테스트

**Files:**
- Create: `src/components/Dialog/DialogProvider.native.tsx`
- Create: `src/components/Dialog/DialogProvider.native.test.tsx`

- [ ] **Step 1: DialogProvider.native.tsx 작성**

`src/components/Dialog/DialogProvider.native.tsx`:

```tsx
/**
 * DialogProvider — React Native implementation.
 *
 * Dialog.native가 RN <Modal>이라 Toast식 absolute overlay가 필요 없다 —
 * {children} 옆에 큐 head Dialog를 그대로 렌더한다. onClose(scrim/Android back)는
 * cancelCurrent에 연결한다. 상태머신은 web과 동일한 useDialogState를 공유한다.
 */
import {Dialog} from './Dialog.native';
import {DialogImperativeContext} from './DialogImperativeContext';
import {useDialogState} from './useDialogState';
import {Button} from '../Button';
import type {DialogProviderProps} from './types';

export function DialogProvider({children}: DialogProviderProps) {
  const {api, current, confirmCurrent, cancelCurrent} = useDialogState();

  return (
    <DialogImperativeContext.Provider value={api}>
      {children}
      {current && (
        <Dialog open onClose={cancelCurrent}>
          <Dialog.Header>
            <Dialog.Title>{current.options.title}</Dialog.Title>
            {current.options.description != null && (
              <Dialog.Description>
                {current.options.description}
              </Dialog.Description>
            )}
          </Dialog.Header>
          <Dialog.Footer>
            {current.kind === 'confirm' && (
              <Button variant="secondary" onPress={cancelCurrent}>
                {current.options.cancelText ?? '취소'}
              </Button>
            )}
            <Button
              variant={
                current.kind === 'confirm' &&
                current.options.tone === 'destructive'
                  ? 'destructive'
                  : 'default'
              }
              onPress={confirmCurrent}>
              {current.options.confirmText ?? '확인'}
            </Button>
          </Dialog.Footer>
        </Dialog>
      )}
    </DialogImperativeContext.Provider>
  );
}

DialogProvider.displayName = 'DialogProvider';
```

- [ ] **Step 2: DialogProvider.native.test.tsx 작성**

`src/components/Dialog/DialogProvider.native.test.tsx` — 트리거는 RN core `Pressable`+`Text`로 만든다(@woosign Button 의존 없이 `fireEvent.press`/`getByText('open')`가 확실히 동작). 확인/취소 버튼은 Provider가 렌더한 @woosign Button의 라벨이므로 `getByText('확인')`/`getByText('취소')`로 누른다:

```tsx
/**
 * Native harness tests for the imperative DialogProvider. react-native preset.
 * Modal은 프리셋이 목킹하므로 동작(콜백/조건부 렌더/resolve)만 검증한다.
 * 트리거는 RN core Pressable+Text(@woosign Button 비의존)로 만든다.
 */
import {Modal, Pressable, Text} from 'react-native';
import {render, screen, fireEvent} from '@testing-library/react-native';
import {DialogProvider} from './DialogProvider.native';
import {useDialog} from './useDialog';
import type {ConfirmOptions, AlertOptions} from './types';

function ConfirmHarness({
  options,
  onPromise,
}: {
  options: ConfirmOptions;
  onPromise: (p: Promise<boolean>) => void;
}) {
  const dialog = useDialog();
  return (
    <Pressable onPress={() => onPromise(dialog.confirm(options))}>
      <Text>open</Text>
    </Pressable>
  );
}

function AlertHarness({
  options,
  onPromise,
}: {
  options: AlertOptions;
  onPromise: (p: Promise<void>) => void;
}) {
  const dialog = useDialog();
  return (
    <Pressable onPress={() => onPromise(dialog.alert(options))}>
      <Text>open</Text>
    </Pressable>
  );
}

describe('DialogProvider (native)', () => {
  it('resolves true when the confirm button is pressed', async () => {
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
    fireEvent.press(screen.getByText('open'));
    expect(screen.getByText('삭제할까요?')).toBeTruthy();
    fireEvent.press(screen.getByText('확인'));
    await expect(promise).resolves.toBe(true);
  });

  it('resolves false when the cancel button is pressed', async () => {
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
    fireEvent.press(screen.getByText('open'));
    fireEvent.press(screen.getByText('취소'));
    await expect(promise).resolves.toBe(false);
  });

  it('resolves false on Android back (Modal onRequestClose)', async () => {
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
    fireEvent.press(screen.getByText('open'));
    screen.UNSAFE_getByType(Modal).props.onRequestClose();
    await expect(promise).resolves.toBe(false);
  });

  it('alert() resolves when the confirm button is pressed', async () => {
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
    fireEvent.press(screen.getByText('open'));
    expect(screen.queryByText('취소')).toBeNull();
    fireEvent.press(screen.getByText('확인'));
    await expect(promise).resolves.toBeUndefined();
  });
});
```

주의: native Dialog의 confirm/cancel 버튼이 @woosign Button(라벨 텍스트로 렌더)이라 `getByText('확인')`/`getByText('취소')`로 누른다. 만약 @woosign Button이 라벨을 `getByText`로 찾을 수 없는 구조(예: 접근성 노드 분리)라면 Button에 `testID`를 줄 수 없으므로(Provider 코드 변경 금지) `getByRole('button', {name})` 또는 `*ByText`의 동작을 확인해 맞춘다 — Provider 소스는 바꾸지 말 것.

- [ ] **Step 3: 테스트 통과 + typecheck/lint**

Run: `pnpm test -- --selectProjects native DialogProvider.native.test`
Expected: PASS (4 tests).

Run: `pnpm typecheck && pnpm exec eslint src/components/Dialog/DialogProvider.native.tsx src/components/Dialog/DialogProvider.native.test.tsx`
Expected: typecheck 클린; eslint 0 errors(prettier 포함).

- [ ] **Step 4: 커밋**

```bash
git add src/components/Dialog/DialogProvider.native.tsx src/components/Dialog/DialogProvider.native.test.tsx
git commit -m "feat(Dialog): native DialogProvider + behavior tests

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: index export + 스토리 + 전체 검증

**Files:**
- Modify: `src/components/Dialog/index.ts`
- Create: `src/components/Dialog/DialogProvider.web.stories.tsx`

- [ ] **Step 1: index.ts에 export 추가**

`src/components/Dialog/index.ts`의 타입 블록과 컴포넌트 블록에 각각 추가한다. 타입 `export type {...} from './types'` 목록 끝에:

```ts
  DialogApi,
  ConfirmOptions,
  AlertOptions,
  DialogProviderProps,
```

그리고 파일 끝에 새 export 두 줄 추가:

```ts
export {DialogProvider} from './DialogProvider';
export {useDialog} from './useDialog';
```

(`useDialogState`, `DialogEntry`, `DialogImperativeContext`는 내부 구현 — export하지 않는다.)

- [ ] **Step 2: 스토리 작성**

`src/components/Dialog/DialogProvider.web.stories.tsx`:

```tsx
import type {Meta, StoryObj} from '@storybook/react';
import React, {useState} from 'react';
import {DialogProvider} from './DialogProvider';
import {useDialog} from './useDialog';
import {Button} from '../Button';
import {Box} from '../Box';
import {Text} from '../Text';

const meta: Meta<typeof DialogProvider> = {
  title: 'Components/DialogProvider',
  component: DialogProvider,
  parameters: {layout: 'centered'},
};
export default meta;

type Story = StoryObj<typeof DialogProvider>;

function Demo() {
  const dialog = useDialog();
  const [result, setResult] = useState('—');
  return (
    <Box style={{display: 'flex', flexDirection: 'column', gap: 12, width: 280}}>
      <Button
        onPress={async () => {
          const ok = await dialog.confirm({
            title: '주문을 취소할까요?',
            description: '이 작업은 되돌릴 수 없어요.',
          });
          setResult(`confirm → ${ok}`);
        }}>
        confirm 열기
      </Button>
      <Button
        variant="destructive"
        onPress={async () => {
          const ok = await dialog.confirm({
            title: '계정을 삭제할까요?',
            description: '모든 데이터가 사라집니다.',
            tone: 'destructive',
            confirmText: '삭제',
          });
          setResult(`destructive confirm → ${ok}`);
        }}>
        destructive confirm
      </Button>
      <Button
        variant="secondary"
        onPress={async () => {
          await dialog.alert({title: '저장됐어요'});
          setResult('alert 닫힘');
        }}>
        alert 열기
      </Button>
      <Text>결과: {result}</Text>
    </Box>
  );
}

export const Default: Story = {
  render: () => (
    <DialogProvider>
      <Demo />
    </DialogProvider>
  ),
};
```

- [ ] **Step 3: 전체 검증**

Run: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`
Expected: typecheck 클린; lint 0 errors(스토리 제외, 테스트 포함 — prettier 통과); web(useDialog.web.test + DialogProvider.web.test) + native(DialogProvider.native.test) 포함 전체 그린; build 성공.

lint에 prettier 에러가 나면 새로 만든/수정한 파일에 `pnpm exec eslint --fix <files>`를 적용한다.

- [ ] **Step 4: 커밋**

```bash
git add src/components/Dialog/index.ts src/components/Dialog/DialogProvider.web.stories.tsx
git commit -m "feat(Dialog): export DialogProvider/useDialog + storybook demo

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
