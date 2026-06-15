# Dialog `prompt()` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `useDialog().prompt(options): Promise<string | null>` — a text-input dialog that resolves the typed string on confirm (empty → `''`) and `null` on cancel/scrim/Esc.

**Architecture:** Extend the existing imperative-Dialog 3-part structure: types (`types.ts`) → queue state machine (`useDialogState.ts`) → platform Provider render. Prompt needs input state, so its render lives in a new shared `PromptDialog.tsx` (uses the `./Dialog` + `../Input` facades, which resolve per-platform in each jest project / Metro / tsc), keeping the confirm/alert render path untouched.

**Tech Stack:** TypeScript, React, React Native, jest (3 projects: web=jsdom/ts-jest, native=react-native preset), `@testing-library/react` + `@testing-library/react-native`.

**Conventions to follow:** TDD (failing test → implement → green → commit). Match existing prettier style (2-space indent, single quotes, trailing commas). The CI-scoped lint (`eslint "src/components/**/!(*.stories).tsx"`) includes `*.test.tsx`, so test files must be prettier-clean. Run `pnpm eslint --fix <file>` if needed before committing.

**Reference files (read for exact patterns):**
- `src/components/Dialog/useDialogState.ts` — current state machine (the file you rewrite in Task 1).
- `src/components/Dialog/DialogProvider.web.tsx` / `.native.tsx` — current providers.
- `src/components/Dialog/DialogProvider.web.test.tsx` / `.native.test.tsx` — test harness patterns you mirror.

---

## File Structure

| File | Responsibility | Change |
|---|---|---|
| `src/components/Dialog/types.ts` | Type surface | Add `PromptOptions`, `DialogApi.prompt`, `DialogEntry` prompt variant |
| `src/components/Dialog/index.ts` | Barrel | Export `PromptOptions` |
| `src/components/Dialog/useDialogState.ts` | Queue state machine | Add `prompt()`, generalize `settle`, `confirmCurrent(value?)`, cleanup |
| `src/components/Dialog/PromptDialog.tsx` | Prompt render (owns input state) | **New, shared web/native** |
| `src/components/Dialog/DialogProvider.web.tsx` | Web render | Branch to `PromptDialog` for prompt entries |
| `src/components/Dialog/DialogProvider.native.tsx` | Native render | Branch to `PromptDialog` for prompt entries |
| `src/components/Dialog/DialogProvider.web.test.tsx` | Web tests | Add 5 prompt tests |
| `src/components/Dialog/DialogProvider.native.test.tsx` | Native tests | Add 2 prompt tests |
| `src/components/Dialog/DialogProvider.web.stories.tsx` | Storybook demo | Add prompt button |

---

## Task 1: Prompt — types, state machine, shared render, web wiring (+ web tests)

This task delivers prompt working end-to-end on web. Native provider keeps compiling (its `confirmCurrent`/`cancelCurrent` calls take no args; it just doesn't render prompt entries yet — fixed in Task 2). Write the web test first (TDD).

**Files:**
- Create: `src/components/Dialog/PromptDialog.tsx`
- Modify: `src/components/Dialog/types.ts`, `src/components/Dialog/index.ts`, `src/components/Dialog/useDialogState.ts`, `src/components/Dialog/DialogProvider.web.tsx`
- Test: `src/components/Dialog/DialogProvider.web.test.tsx`

- [ ] **Step 1: Write the failing web tests**

Append these tests inside the existing `describe('DialogProvider (web)', () => { ... })` block in `src/components/Dialog/DialogProvider.web.test.tsx` (before its closing `});`). Also add a `PromptHarness` next to the existing harnesses (after `AlertHarness`), and add `PromptOptions` to the existing `import type {...} from './types';` line so it reads `import type {ConfirmOptions, AlertOptions, PromptOptions} from './types';`.

```tsx
/** prompt()을 호출하는 소비자. */
function PromptHarness({
  options,
  onPromise,
}: {
  options: PromptOptions;
  onPromise: (p: Promise<string | null>) => void;
}) {
  const dialog = useDialog();
  return (
    <button onClick={() => onPromise(dialog.prompt(options))}>open</button>
  );
}
```

```tsx
it('prompt() renders an input and resolves the typed value on confirm', async () => {
  let promise!: Promise<string | null>;
  render(
    <DialogProvider>
      <PromptHarness
        options={{title: '이름을 입력하세요', placeholder: '이름'}}
        onPromise={p => {
          promise = p;
        }}
      />
    </DialogProvider>,
  );
  await userEvent.click(screen.getByText('open'));
  await userEvent.type(screen.getByPlaceholderText('이름'), '커피');
  await userEvent.click(screen.getByRole('button', {name: '확인'}));
  await expect(promise).resolves.toBe('커피');
});

it('prompt() resolves an empty string when confirmed with no input', async () => {
  let promise!: Promise<string | null>;
  render(
    <DialogProvider>
      <PromptHarness
        options={{title: '이름', placeholder: '이름'}}
        onPromise={p => {
          promise = p;
        }}
      />
    </DialogProvider>,
  );
  await userEvent.click(screen.getByText('open'));
  await userEvent.click(screen.getByRole('button', {name: '확인'}));
  await expect(promise).resolves.toBe('');
});

it('prompt() resolves null when the cancel button is clicked', async () => {
  let promise!: Promise<string | null>;
  render(
    <DialogProvider>
      <PromptHarness
        options={{title: '이름', placeholder: '이름'}}
        onPromise={p => {
          promise = p;
        }}
      />
    </DialogProvider>,
  );
  await userEvent.click(screen.getByText('open'));
  await userEvent.click(screen.getByRole('button', {name: '취소'}));
  await expect(promise).resolves.toBeNull();
});

it('prompt() resolves null when the scrim is clicked', async () => {
  let promise!: Promise<string | null>;
  render(
    <DialogProvider>
      <PromptHarness
        options={{title: '이름', placeholder: '이름'}}
        onPromise={p => {
          promise = p;
        }}
      />
    </DialogProvider>,
  );
  await userEvent.click(screen.getByText('open'));
  await userEvent.click(screen.getByTestId('dialog-scrim'));
  await expect(promise).resolves.toBeNull();
});

it('prompt() shows the provided defaultValue in the input', async () => {
  render(
    <DialogProvider>
      <PromptHarness
        options={{title: '이름', placeholder: '이름', defaultValue: '기존값'}}
        onPromise={() => {}}
      />
    </DialogProvider>,
  );
  await userEvent.click(screen.getByText('open'));
  expect(screen.getByPlaceholderText('이름')).toHaveValue('기존값');
});
```

- [ ] **Step 2: Run the tests to confirm they fail**

Run: `pnpm jest --selectProjects web src/components/Dialog/DialogProvider.web.test.tsx`
Expected: FAIL — `dialog.prompt is not a function` / TS error `Property 'prompt' does not exist on type 'DialogApi'`.

- [ ] **Step 3: Add the types**

In `src/components/Dialog/types.ts`, add `PromptOptions` after the `AlertOptions` interface:

```ts
/** useDialog().prompt(...) 옵션. */
export interface PromptOptions {
  title: ReactNode;
  description?: ReactNode;
  /** Input placeholder. */
  placeholder?: string;
  /** Input 초기값. 기본 ''. */
  defaultValue?: string;
  /** 확인 버튼 라벨. 기본 '확인'. */
  confirmText?: string;
  /** 취소 버튼 라벨. 기본 '취소'. */
  cancelText?: string;
}
```

Add `prompt` to the `DialogApi` interface (after the `alert` method):

```ts
export interface DialogApi {
  /** 확인=true, 취소/scrim/Esc=false. */
  confirm(options: ConfirmOptions): Promise<boolean>;
  /** 닫히면 resolve. */
  alert(options: AlertOptions): Promise<void>;
  /** 확인=입력 문자열(빈 값이면 ''), 취소/scrim/Esc=null. */
  prompt(options: PromptOptions): Promise<string | null>;
}
```

Add the `prompt` variant to the `DialogEntry` union (after the `alert` variant):

```ts
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
    }
  | {
      id: string;
      kind: 'prompt';
      options: PromptOptions;
      resolve: (value: string | null) => void;
    };
```

- [ ] **Step 4: Export the new type from the barrel**

In `src/components/Dialog/index.ts`, add `PromptOptions` to the type export list (next to `ConfirmOptions`, `AlertOptions`):

```ts
  DialogApi,
  ConfirmOptions,
  AlertOptions,
  PromptOptions,
  DialogProviderProps,
```

- [ ] **Step 5: Implement the state machine**

Replace the entire contents of `src/components/Dialog/useDialogState.ts` with:

```ts
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {
  AlertOptions,
  ConfirmOptions,
  PromptOptions,
  DialogApi,
  DialogEntry,
} from './types';

/**
 * 임퍼러티브 Dialog의 상태머신. 큐(한 번에 하나)와 각 호출의 Promise resolve를
 * 소유한다. 플랫폼 Provider는 렌더링만 담당한다.
 *
 * - confirm()/alert()/prompt()는 엔트리를 큐에 push하고 Promise를 반환한다.
 * - confirmCurrent(value?)/cancelCurrent()는 head를 resolve하고 큐에서 제거한다.
 * - prompt는 확인 시 입력 문자열(value), 취소/scrim/Esc 시 null로 resolve한다.
 */
export function useDialogState(): {
  api: DialogApi;
  current: DialogEntry | null;
  confirmCurrent: (value?: string) => void;
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

  const prompt = useCallback((options: PromptOptions) => {
    return new Promise<string | null>(resolve => {
      idRef.current += 1;
      const entry: DialogEntry = {
        id: `wb-dialog-imperative-${idRef.current}`,
        kind: 'prompt',
        options,
        resolve,
      };
      setQueue(prev => [...prev, entry]);
    });
  }, []);

  // confirmed=확인 여부. promptValue는 prompt 확인 시의 입력값.
  // resolve는 updater 밖에서 호출(부작용 분리).
  const settle = useCallback((confirmed: boolean, promptValue?: string) => {
    const head = currentRef.current;
    if (!head) return;
    if (head.kind === 'confirm') head.resolve(confirmed);
    else if (head.kind === 'alert') head.resolve();
    else head.resolve(confirmed ? promptValue ?? '' : null); // prompt
    setQueue(prev => prev.slice(1));
  }, []);

  const confirmCurrent = useCallback(
    (value?: string) => settle(true, value),
    [settle],
  );
  const cancelCurrent = useCallback(() => settle(false), [settle]);

  // 언마운트 시 남은 엔트리는 취소로 resolve(매달린 Promise 방지).
  const queueRef = useRef(queue);
  queueRef.current = queue;
  useEffect(() => {
    return () => {
      queueRef.current.forEach(e => {
        if (e.kind === 'confirm') e.resolve(false);
        else if (e.kind === 'alert') e.resolve();
        else e.resolve(null); // prompt
      });
    };
  }, []);

  const api = useMemo<DialogApi>(
    () => ({confirm, alert, prompt}),
    [confirm, alert, prompt],
  );
  return {api, current: queue[0] ?? null, confirmCurrent, cancelCurrent};
}
```

Note: the `confirmed ? promptValue ?? '' : null` line may get parens added by prettier (`confirmed ? (promptValue ?? '') : null`) — either is fine; run `pnpm eslint --fix` if lint complains.

- [ ] **Step 6: Create the shared PromptDialog**

Create `src/components/Dialog/PromptDialog.tsx`:

```tsx
/**
 * PromptDialog — 임퍼러티브 prompt()의 렌더. 입력 상태(useState)를 소유하며
 * web/native 공통이다(Dialog/Input 파사드가 각 플랫폼 구현으로 resolve된다).
 * Provider가 key={entry.id}로 엔트리마다 새 인스턴스를 만들어 입력값을 리셋한다.
 */
import {useState} from 'react';
import {Dialog} from './Dialog';
import {Input} from '../Input';
import {Button} from '../Button';
import type {DialogEntry} from './types';

type PromptEntry = Extract<DialogEntry, {kind: 'prompt'}>;

interface PromptDialogProps {
  entry: PromptEntry;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export function PromptDialog({entry, onConfirm, onCancel}: PromptDialogProps) {
  const {options} = entry;
  const [value, setValue] = useState(options.defaultValue ?? '');
  return (
    <Dialog open onClose={onCancel}>
      <Dialog.Header>
        <Dialog.Title>{options.title}</Dialog.Title>
        {options.description != null && (
          <Dialog.Description>{options.description}</Dialog.Description>
        )}
      </Dialog.Header>
      <Dialog.Body>
        <Input
          value={value}
          onChangeText={setValue}
          placeholder={options.placeholder}
          fullWidth
          autoFocus
        />
      </Dialog.Body>
      <Dialog.Footer>
        <Button variant="secondary" onPress={onCancel}>
          {options.cancelText ?? '취소'}
        </Button>
        <Button onPress={() => onConfirm(value)}>
          {options.confirmText ?? '확인'}
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}

PromptDialog.displayName = 'PromptDialog';
```

- [ ] **Step 7: Wire the web Provider**

Replace the entire contents of `src/components/Dialog/DialogProvider.web.tsx` with:

```tsx
/**
 * DialogProvider — Web implementation.
 *
 * 임퍼러티브 DialogApi를 useDialog() 소비자에게 노출하고, 큐 head를 controlled
 * Dialog로 렌더한다. prompt 엔트리는 입력 상태가 필요해 PromptDialog로 분기한다.
 * scrim/Esc(onClose)는 cancelCurrent에 연결 — 닫힘을 취소로 간주한다.
 */
import {Dialog} from './Dialog.web';
import {PromptDialog} from './PromptDialog';
import {DialogImperativeContext} from './DialogImperativeContext';
import {useDialogState} from './useDialogState';
import {Button} from '../Button';
import type {DialogProviderProps} from './types';

export function DialogProvider({children}: DialogProviderProps) {
  const {api, current, confirmCurrent, cancelCurrent} = useDialogState();

  return (
    <DialogImperativeContext.Provider value={api}>
      {children}
      {current &&
        (current.kind === 'prompt' ? (
          <PromptDialog
            key={current.id}
            entry={current}
            onConfirm={confirmCurrent}
            onCancel={cancelCurrent}
          />
        ) : (
          // key로 큐 head마다 새 Dialog 인스턴스를 만들어 aria id·진입 애니메이션을
          // 다이얼로그 간에 깨끗이 리셋한다(큐잉 시 이전 항목 상태 잔존 방지).
          <Dialog key={current.id} open onClose={cancelCurrent}>
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
                onPress={() => confirmCurrent()}>
                {current.options.confirmText ?? '확인'}
              </Button>
            </Dialog.Footer>
          </Dialog>
        ))}
    </DialogImperativeContext.Provider>
  );
}

DialogProvider.displayName = 'DialogProvider';
```

Note the confirm/alert confirm button changed from `onPress={confirmCurrent}` to `onPress={() => confirmCurrent()}` — `confirmCurrent` now takes an optional `value`, so wrapping avoids passing a press event as the value.

- [ ] **Step 8: Run web tests + typecheck to confirm green**

Run: `pnpm jest --selectProjects web src/components/Dialog/DialogProvider.web.test.tsx`
Expected: PASS — all prompt tests plus the existing confirm/alert tests pass.

Run: `pnpm typecheck`
Expected: PASS (the native provider still compiles even though it doesn't render prompt yet).

- [ ] **Step 9: Commit**

```bash
git add src/components/Dialog/types.ts src/components/Dialog/index.ts src/components/Dialog/useDialogState.ts src/components/Dialog/PromptDialog.tsx src/components/Dialog/DialogProvider.web.tsx src/components/Dialog/DialogProvider.web.test.tsx
git commit -m "feat(Dialog): imperative prompt() with web provider + tests"
```

---

## Task 2: Native Provider prompt branch (+ native tests)

**Files:**
- Modify: `src/components/Dialog/DialogProvider.native.tsx`
- Test: `src/components/Dialog/DialogProvider.native.test.tsx`

- [ ] **Step 1: Write the failing native tests**

In `src/components/Dialog/DialogProvider.native.test.tsx`: add `PromptOptions` to the `import type {ConfirmOptions, AlertOptions} from './types';` line (→ `import type {ConfirmOptions, AlertOptions, PromptOptions} from './types';`), add a `PromptHarness` after `AlertHarness`, and append the two tests inside the existing `describe('DialogProvider (native)', () => { ... })` block.

```tsx
function PromptHarness({
  options,
  onPromise,
}: {
  options: PromptOptions;
  onPromise: (p: Promise<string | null>) => void;
}) {
  const dialog = useDialog();
  return (
    <Pressable onPress={() => onPromise(dialog.prompt(options))}>
      <Text>open</Text>
    </Pressable>
  );
}
```

```tsx
it('prompt() renders an input and resolves the typed value on confirm', async () => {
  let promise!: Promise<string | null>;
  render(
    <DialogProvider>
      <PromptHarness
        options={{title: '이름', placeholder: '이름'}}
        onPromise={p => {
          promise = p;
        }}
      />
    </DialogProvider>,
  );
  fireEvent.press(screen.getByText('open'));
  fireEvent.changeText(screen.getByPlaceholderText('이름'), '커피');
  fireEvent.press(screen.getByText('확인'));
  await expect(promise).resolves.toBe('커피');
});

it('prompt() resolves null when cancelled', async () => {
  let promise!: Promise<string | null>;
  render(
    <DialogProvider>
      <PromptHarness
        options={{title: '이름', placeholder: '이름'}}
        onPromise={p => {
          promise = p;
        }}
      />
    </DialogProvider>,
  );
  fireEvent.press(screen.getByText('open'));
  fireEvent.press(screen.getByText('취소'));
  await expect(promise).resolves.toBeNull();
});
```

- [ ] **Step 2: Run the tests to confirm they fail**

Run: `pnpm jest --selectProjects native src/components/Dialog/DialogProvider.native.test.tsx`
Expected: FAIL — the native provider renders a confirm-style Dialog (no Input) for prompt entries, so `getByPlaceholderText('이름')` is not found.

- [ ] **Step 3: Wire the native Provider**

Replace the entire contents of `src/components/Dialog/DialogProvider.native.tsx` with:

```tsx
/**
 * DialogProvider — React Native implementation.
 *
 * Dialog.native가 RN <Modal>이라 Toast식 absolute overlay가 필요 없다 —
 * {children} 옆에 큐 head Dialog를 그대로 렌더한다. prompt 엔트리는 입력 상태가
 * 필요해 PromptDialog로 분기한다. onClose(scrim/Android back)는 cancelCurrent에
 * 연결한다. 상태머신은 web과 동일한 useDialogState를 공유한다.
 */
import {Dialog} from './Dialog.native';
import {PromptDialog} from './PromptDialog';
import {DialogImperativeContext} from './DialogImperativeContext';
import {useDialogState} from './useDialogState';
import {Button} from '../Button';
import type {DialogProviderProps} from './types';

export function DialogProvider({children}: DialogProviderProps) {
  const {api, current, confirmCurrent, cancelCurrent} = useDialogState();

  return (
    <DialogImperativeContext.Provider value={api}>
      {children}
      {current &&
        (current.kind === 'prompt' ? (
          <PromptDialog
            key={current.id}
            entry={current}
            onConfirm={confirmCurrent}
            onCancel={cancelCurrent}
          />
        ) : (
          // key로 큐 head마다 새 Dialog 인스턴스를 만들어 상태를 깨끗이 리셋한다.
          <Dialog key={current.id} open onClose={cancelCurrent}>
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
                onPress={() => confirmCurrent()}>
                {current.options.confirmText ?? '확인'}
              </Button>
            </Dialog.Footer>
          </Dialog>
        ))}
    </DialogImperativeContext.Provider>
  );
}

DialogProvider.displayName = 'DialogProvider';
```

- [ ] **Step 4: Run native tests + typecheck to confirm green**

Run: `pnpm jest --selectProjects native src/components/Dialog/DialogProvider.native.test.tsx`
Expected: PASS — prompt tests plus existing confirm/alert tests pass.

Run: `pnpm typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Dialog/DialogProvider.native.tsx src/components/Dialog/DialogProvider.native.test.tsx
git commit -m "feat(Dialog): native provider prompt() branch + tests"
```

---

## Task 3: Storybook prompt demo

**Files:**
- Modify: `src/components/Dialog/DialogProvider.web.stories.tsx`

No test (visual artifact). Verified by typecheck.

- [ ] **Step 1: Add a prompt button to the Demo**

In `src/components/Dialog/DialogProvider.web.stories.tsx`, inside the `Demo` component's `<Box>`, add this button after the existing `alert 열기` `<Button>` (before the `<Text>결과: {result}</Text>` line):

```tsx
<Button
  variant="secondary"
  onPress={async () => {
    const name = await dialog.prompt({
      title: '닉네임을 입력하세요',
      description: '주문 화면에 표시됩니다.',
      placeholder: '닉네임',
    });
    setResult(name === null ? 'prompt 취소됨' : `prompt → ${name}`);
  }}>
  prompt 열기
</Button>
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/Dialog/DialogProvider.web.stories.tsx
git commit -m "feat(Dialog): prompt demo in DialogProvider story"
```

---

## Final Verification (after all 3 tasks)

- [ ] **Full test suite:** `pnpm test` → all 3 projects green (existing + new prompt tests).
- [ ] **Typecheck:** `pnpm typecheck` → PASS.
- [ ] **Build:** `pnpm build` → PASS (commonjs/module/typescript targets).
- [ ] **Regression check:** confirm the existing confirm/alert tests still pass (they're in the same files and run in the suite above).
- [ ] **Update memory:** append to `/Users/logan/.claude/projects/-Users-logan-Repository-wooBottle-externalProjects-woosign/memory/bottomsheet-component.md` noting prompt() shipped (PromptOptions, Promise<string|null>, shared PromptDialog facade, empty→'' / cancel→null, web 5 + native 2 tests).

---

## Self-Review Notes

- **Spec coverage:** §1 types → Task 1 Step 3-4. §2 state machine → Task 1 Step 5. §3 PromptDialog → Task 1 Step 6. §4 provider branch → Task 1 Step 7 (web) + Task 2 Step 3 (native). §5 tests → Task 1 (web 5) + Task 2 (native 2). §6 story → Task 3. Verification → Final. All covered.
- **Type consistency:** `confirmCurrent: (value?: string) => void` is defined in the state-machine return type (Task 1 Step 5) and consumed in both providers via `onConfirm={confirmCurrent}` (PromptDialog `onConfirm: (value: string) => void` — assignable) and `onPress={() => confirmCurrent()}` (confirm/alert). `PromptEntry = Extract<DialogEntry, {kind: 'prompt'}>` matches the `'prompt'` variant added in Task 1 Step 3. `prompt(options: PromptOptions): Promise<string | null>` is identical in `DialogApi` (types) and `useDialogState` (impl).
- **No placeholders:** every code step shows complete content.
