# Overlay Focus Trap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a shared web-only `useFocusTrap` hook (initial focus + Tab cycling + focus restore) and wire it into the Dialog, BottomSheet, and Drawer web overlays for keyboard/screen-reader accessibility.

**Architecture:** One hook `src/core/hooks/useFocusTrap.ts` (uses DOM APIs, NOT added to the `core/hooks` barrel so native never imports it). Each web overlay passes its surface `ref` + `open` to `useFocusTrap(surfaceRef, open)`. Native is unchanged (RN `Modal`/OS handles focus). Existing scrim/Esc/aria/slide logic is untouched.

**Tech Stack:** TypeScript, React, jsdom jest (web project, `*.web.test.tsx`), `@testing-library/react` + `@testing-library/user-event`.

**Conventions:** TDD. Prettier-clean (CI lint includes `*.test.tsx`); `pnpm eslint --fix` if needed.

**Reference:** `src/components/BottomSheet/BottomSheet.web.tsx` already declares `const surfaceRef = useRef<HTMLDivElement>(null)` and puts `ref={surfaceRef}` on its surface — reuse it. `Dialog.web.tsx` and `Drawer.web.tsx` each have a surface `<div role="dialog" aria-modal="true" ...>` that needs a new ref. All three early-return `null` when closed AFTER their hooks — place the `useFocusTrap` call with the other top-level hooks, before the early return.

**Key jsdom/userEvent note:** `userEvent.tab()` fires a real `keydown` Tab event and respects `preventDefault()`. The hook's document `keydown` listener calls `preventDefault()` + `focus()` at the trap boundaries, so userEvent's default focus move is suppressed there and our manual move wins. Mid-list tabs (no preventDefault) move naturally. This is why the trap is testable in jsdom.

---

## File Structure

| File | Responsibility | Change |
|---|---|---|
| `src/core/hooks/useFocusTrap.ts` | shared focus trap hook (web DOM) | **New** |
| `src/core/hooks/useFocusTrap.web.test.tsx` | hook unit tests | **New** |
| `src/components/Dialog/Dialog.web.tsx` | wire hook + surface ref | Modify |
| `src/components/Dialog/Dialog.web.test.tsx` | focus integration tests | Modify |
| `src/components/BottomSheet/BottomSheet.web.tsx` | wire hook (reuse `surfaceRef`) | Modify |
| `src/components/BottomSheet/BottomSheet.web.test.tsx` | focus integration tests | Modify |
| `src/components/Drawer/Drawer.web.tsx` | wire hook + surface ref | Modify |
| `src/components/Drawer/Drawer.web.test.tsx` | focus integration tests | Modify |

`core/hooks/index.ts` is NOT modified (hook intentionally excluded from the barrel; web overlays import it directly).

---

## Task 1: `useFocusTrap` hook + unit tests

**Files:**
- Create: `src/core/hooks/useFocusTrap.ts`, `src/core/hooks/useFocusTrap.web.test.tsx`

- [ ] **Step 1: Write the failing unit test**

Create `src/core/hooks/useFocusTrap.web.test.tsx`:

```tsx
/**
 * Unit tests for useFocusTrap (web). jsdom + userEvent.
 */
import {useRef} from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {useFocusTrap} from './useFocusTrap';

function Harness({active}: {active: boolean}) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, active);
  return (
    <div>
      <button>바깥</button>
      <div ref={ref} data-testid="container">
        <button>첫</button>
        <button>중간</button>
        <button>끝</button>
      </div>
    </div>
  );
}

function EmptyHarness({active}: {active: boolean}) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, active);
  return (
    <div ref={ref} data-testid="container">
      <span>내용 없음</span>
    </div>
  );
}

describe('useFocusTrap (web)', () => {
  it('moves focus to the first focusable when activated', () => {
    render(<Harness active />);
    expect(screen.getByText('첫')).toHaveFocus();
  });

  it('focuses the container itself when there is no focusable child', () => {
    render(<EmptyHarness active />);
    expect(screen.getByTestId('container')).toHaveFocus();
  });

  it('cycles from the last element back to the first on Tab', async () => {
    render(<Harness active />);
    screen.getByText('끝').focus();
    await userEvent.tab();
    expect(screen.getByText('첫')).toHaveFocus();
  });

  it('cycles from the first element to the last on Shift+Tab', async () => {
    render(<Harness active />);
    screen.getByText('첫').focus();
    await userEvent.tab({shift: true});
    expect(screen.getByText('끝')).toHaveFocus();
  });

  it('restores focus to the previously focused element on deactivate', () => {
    const {rerender} = render(<Harness active={false} />);
    const trigger = screen.getByText('바깥');
    trigger.focus();
    expect(trigger).toHaveFocus();
    rerender(<Harness active />);
    expect(screen.getByText('첫')).toHaveFocus();
    rerender(<Harness active={false} />);
    expect(trigger).toHaveFocus();
  });
});
```

- [ ] **Step 2: Run to confirm failure**

Run: `pnpm jest --selectProjects web src/core/hooks/useFocusTrap.web.test.tsx`
Expected: FAIL — `Cannot find module './useFocusTrap'`.

- [ ] **Step 3: Implement the hook**

Create `src/core/hooks/useFocusTrap.ts`:

```ts
import {useEffect, useRef} from 'react';
import type {RefObject} from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1);
}

/**
 * web 전용 포커스 트랩. active가 true가 되면 컨테이너 내부 첫 포커서블(없으면
 * 컨테이너 자신)로 포커스를 옮기고, Tab/Shift+Tab을 컨테이너 안에서 순환시키며,
 * 비활성화/언마운트 시 직전 포커스를 복원한다. native는 RN Modal/OS 접근성이
 * 처리하므로 이 훅은 web 오버레이에서만 쓴다(core/hooks 배럴에 미포함).
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
): void {
  const previousRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    previousRef.current = document.activeElement as HTMLElement | null;

    const focusables = getFocusable(container);
    if (focusables.length > 0) {
      focusables[0].focus();
    } else {
      container.tabIndex = -1;
      container.focus();
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const els = getFocusable(container);
      if (els.length === 0) {
        e.preventDefault();
        container.focus();
        return;
      }
      const first = els[0];
      const last = els[els.length - 1];
      const activeEl = document.activeElement;
      const inside = container.contains(activeEl);
      if (e.shiftKey) {
        if (activeEl === first || !inside) {
          e.preventDefault();
          last.focus();
        }
      } else if (activeEl === last || !inside) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previousRef.current?.focus();
    };
  }, [active, containerRef]);
}
```

- [ ] **Step 4: Run to confirm green**

Run: `pnpm jest --selectProjects web src/core/hooks/useFocusTrap.web.test.tsx`
Expected: PASS (5 tests).

Run: `pnpm typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/core/hooks/useFocusTrap.ts src/core/hooks/useFocusTrap.web.test.tsx
git commit -m "feat(core): useFocusTrap hook for web overlays"
```

---

## Task 2: Wire into Dialog + integration tests

**Files:**
- Modify: `src/components/Dialog/Dialog.web.tsx`, `src/components/Dialog/Dialog.web.test.tsx`

- [ ] **Step 1: Write the failing integration tests**

Append to `src/components/Dialog/Dialog.web.test.tsx` (inside the existing `describe('Dialog (web)', ...)` block). Add `import userEvent from '@testing-library/user-event';` at the top if not already imported.

```tsx
it('moves focus into the surface on open and restores it on close', () => {
  function Wrap({open}: {open: boolean}) {
    return (
      <>
        <button>트리거</button>
        <Dialog open={open} onClose={() => {}}>
          <Dialog.Footer>
            <button>확인</button>
          </Dialog.Footer>
        </Dialog>
      </>
    );
  }
  const {rerender} = render(<Wrap open={false} />);
  const trigger = screen.getByText('트리거');
  trigger.focus();
  rerender(<Wrap open />);
  expect(screen.getByRole('button', {name: '확인'})).toHaveFocus();
  rerender(<Wrap open={false} />);
  expect(trigger).toHaveFocus();
});

it('traps Tab within the dialog surface', async () => {
  render(
    <Dialog open onClose={() => {}}>
      <Dialog.Footer>
        <button>취소</button>
        <button>확인</button>
      </Dialog.Footer>
    </Dialog>,
  );
  // 초기 포커스는 첫 버튼(취소). 끝(확인)에서 Tab → 첫(취소)로 순환.
  expect(screen.getByRole('button', {name: '취소'})).toHaveFocus();
  screen.getByRole('button', {name: '확인'}).focus();
  await userEvent.tab();
  expect(screen.getByRole('button', {name: '취소'})).toHaveFocus();
});
```

- [ ] **Step 2: Run to confirm failure**

Run: `pnpm jest --selectProjects web src/components/Dialog/Dialog.web.test.tsx`
Expected: FAIL — focus stays on `트리거`/body (no trap yet).

- [ ] **Step 3: Wire the hook into `Dialog.web.tsx`**

1. Add the import near the other imports:

```tsx
import {useFocusTrap} from '../../core/hooks/useFocusTrap';
```

2. With the other top-level hooks in `DialogBase` (before the `if (!open || !mounted ...) return null;` early return), add a surface ref and the trap call:

```tsx
const surfaceRef = useRef<HTMLDivElement>(null);
useFocusTrap(surfaceRef, open);
```

(`useRef` is already imported in `Dialog.web.tsx`.)

3. On the surface element — the `<div role="dialog" aria-modal="true" ...>` — add `ref={surfaceRef}` (alongside its existing props). Do not change any other attribute.

- [ ] **Step 4: Run to confirm green**

Run: `pnpm jest --selectProjects web src/components/Dialog/Dialog.web.test.tsx`
Expected: PASS (existing + 2 new).

Run: `pnpm typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Dialog/Dialog.web.tsx src/components/Dialog/Dialog.web.test.tsx
git commit -m "feat(Dialog): focus trap on web overlay"
```

---

## Task 3: Wire into BottomSheet + integration test

**Files:**
- Modify: `src/components/BottomSheet/BottomSheet.web.tsx`, `src/components/BottomSheet/BottomSheet.web.test.tsx`

`BottomSheet.web.tsx` already has `const surfaceRef = useRef<HTMLDivElement>(null)` (≈line 101) and `ref={surfaceRef}` on its surface (≈line 168) — reuse it.

- [ ] **Step 1: Write the failing integration test**

Append to `src/components/BottomSheet/BottomSheet.web.test.tsx` (inside `describe('BottomSheet (web)', ...)`):

```tsx
it('moves focus into the sheet on open and restores it on close', () => {
  function Wrap({open}: {open: boolean}) {
    return (
      <>
        <button>트리거</button>
        <BottomSheet open={open} onClose={() => {}}>
          <BottomSheet.Footer>
            <button>확인</button>
          </BottomSheet.Footer>
        </BottomSheet>
      </>
    );
  }
  const {rerender} = render(<Wrap open={false} />);
  const trigger = screen.getByText('트리거');
  trigger.focus();
  rerender(<Wrap open />);
  expect(screen.getByRole('button', {name: '확인'})).toHaveFocus();
  rerender(<Wrap open={false} />);
  expect(trigger).toHaveFocus();
});
```

- [ ] **Step 2: Run to confirm failure**

Run: `pnpm jest --selectProjects web src/components/BottomSheet/BottomSheet.web.test.tsx`
Expected: FAIL — focus not moved into the sheet.

- [ ] **Step 3: Wire the hook into `BottomSheet.web.tsx`**

1. Add the import near the other imports:

```tsx
import {useFocusTrap} from '../../core/hooks/useFocusTrap';
```

2. Right after the existing `const surfaceRef = useRef<HTMLDivElement>(null);` line (and the `dragRef`/state lines are fine to keep), with the other hooks and BEFORE the `if (!open || !mounted ...) return null;` early return, add:

```tsx
useFocusTrap(surfaceRef, open);
```

(The surface already has `ref={surfaceRef}` — no JSX change needed.)

- [ ] **Step 4: Run to confirm green**

Run: `pnpm jest --selectProjects web src/components/BottomSheet/BottomSheet.web.test.tsx`
Expected: PASS (existing + 1 new).

Run: `pnpm typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/BottomSheet/BottomSheet.web.tsx src/components/BottomSheet/BottomSheet.web.test.tsx
git commit -m "feat(BottomSheet): focus trap on web overlay"
```

---

## Task 4: Wire into Drawer + integration test

**Files:**
- Modify: `src/components/Drawer/Drawer.web.tsx`, `src/components/Drawer/Drawer.web.test.tsx`

- [ ] **Step 1: Write the failing integration test**

Append to `src/components/Drawer/Drawer.web.test.tsx` (inside `describe('Drawer (web)', ...)`):

```tsx
it('moves focus into the panel on open and restores it on close', () => {
  function Wrap({open}: {open: boolean}) {
    return (
      <>
        <button>트리거</button>
        <Drawer open={open} onClose={() => {}}>
          <Drawer.Footer>
            <button>닫기</button>
          </Drawer.Footer>
        </Drawer>
      </>
    );
  }
  const {rerender} = render(<Wrap open={false} />);
  const trigger = screen.getByText('트리거');
  trigger.focus();
  rerender(<Wrap open />);
  expect(screen.getByRole('button', {name: '닫기'})).toHaveFocus();
  rerender(<Wrap open={false} />);
  expect(trigger).toHaveFocus();
});
```

- [ ] **Step 2: Run to confirm failure**

Run: `pnpm jest --selectProjects web src/components/Drawer/Drawer.web.test.tsx`
Expected: FAIL — focus not moved into the panel.

- [ ] **Step 3: Wire the hook into `Drawer.web.tsx`**

1. Add the import near the other imports:

```tsx
import {useFocusTrap} from '../../core/hooks/useFocusTrap';
```

2. With the other top-level hooks in `DrawerBase` (before the `if (!open || !mounted ...) return null;` early return), add:

```tsx
const surfaceRef = useRef<HTMLDivElement>(null);
useFocusTrap(surfaceRef, open);
```

(`useRef` is already imported in `Drawer.web.tsx`.)

3. On the panel element — the `<div role="dialog" aria-modal="true" ...>` — add `ref={surfaceRef}` alongside its existing props. Do not change any other attribute.

- [ ] **Step 4: Run to confirm green**

Run: `pnpm jest --selectProjects web src/components/Drawer/Drawer.web.test.tsx`
Expected: PASS (existing + 1 new).

Run: `pnpm typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Drawer/Drawer.web.tsx src/components/Drawer/Drawer.web.test.tsx
git commit -m "feat(Drawer): focus trap on web overlay"
```

---

## Final Verification

- [ ] **Full suite:** `pnpm test` → all 3 projects green.
- [ ] **Typecheck + build:** `pnpm typecheck` → PASS; `pnpm build` → PASS. Confirm the native build target compiles (the hook is web-only and not in the `core/hooks` barrel, so native never imports it).
- [ ] **Barrel check:** `core/hooks/index.ts` does NOT export `useFocusTrap` (web overlays import it directly).
- [ ] **Update memory:** append to `/Users/logan/.claude/projects/-Users-logan-Repository-wooBottle-externalProjects-woosign/memory/bottomsheet-component.md` noting overlay focus trap shipped (shared `useFocusTrap` web hook; initial focus + Tab cycle + restore; wired into Dialog/BottomSheet/Drawer web; native unchanged; focus trap is no longer a deferred a11y gap).

---

## Self-Review Notes

- **Spec coverage:** hook (Task 1) with the 3 behaviors (initial focus, Tab cycle, restore) + 5 unit tests; Dialog/BottomSheet/Drawer wiring (Tasks 2-4) each with an open→focus-in→close→restore integration test, plus a Tab-cycle test on Dialog (representative, per spec). Native excluded. Barrel exclusion verified in Final. All spec sections covered.
- **Consistency:** `useFocusTrap(surfaceRef, open)` signature identical across all three call sites; `surfaceRef` is `RefObject<HTMLDivElement | null>` which satisfies the hook's `RefObject<HTMLElement | null>` param. BottomSheet reuses its existing `surfaceRef`; Dialog/Drawer add a new one on their `role="dialog"` div.
- **No placeholders:** hook + tests are complete; wiring edits are precise (import + 2 hook lines + one `ref=` attribute on the `role="dialog"` element).
```
