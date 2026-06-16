# ToastProvider Imperative Demo Stories Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Storybook stories demonstrating the `ToastProvider` + `useToast()` imperative API on both web and native.

**Architecture:** Two new story files mirroring the existing `DialogProvider.web.stories.tsx` `Demo` pattern — a named `Demo` component calls `useToast()` and renders trigger Buttons, wrapped in `<ToastProvider>`. Web uses `@storybook/react`, native uses `@storybook/react-native`. No source changes, no tests (visual artifacts validated by typecheck).

**Tech Stack:** TypeScript, React, React Native, `@storybook/react` + `@storybook/react-native`, the local `@woosign/ui` Toast components.

**Conventions:** Stories are excluded from CI lint and from the build/tarball but ARE typechecked by `tsc` (covers `src/**`). Author prettier-clean (2-space, single quotes, trailing commas). The cycle is **write → `pnpm typecheck` → `pnpm build` → commit** (no TDD — stories have no tests).

**Reference:** `src/components/Toast/useToast.ts` (`ToastApi`: `show/success/error/brand/neutral/dismiss`), `src/components/Toast/types.ts` (`ToastProviderProps`: `duration/position/max/offset`), `src/components/Dialog/DialogProvider.web.stories.tsx` (the `Demo` + provider-wrapper story pattern), `src/components/Toast/Toast.native.stories.tsx` (native story header convention). `Button` accepts `variant` (incl. `'secondary'`, `'destructive'`) and `onPress`.

---

## File Structure

| File | Responsibility |
|---|---|
| `src/components/Toast/ToastProvider.web.stories.tsx` | web imperative demo (`@storybook/react`) |
| `src/components/Toast/ToastProvider.native.stories.tsx` | native imperative demo (`@storybook/react-native`) |

Pure additive — no existing files modified.

---

## Task 1: ToastProvider demo stories (web + native)

**Files:**
- Create: `src/components/Toast/ToastProvider.web.stories.tsx`, `src/components/Toast/ToastProvider.native.stories.tsx`

- [ ] **Step 1: Create the web story**

`src/components/Toast/ToastProvider.web.stories.tsx`:

```tsx
import type {Meta, StoryObj} from '@storybook/react';
import React from 'react';
import {ToastProvider} from './ToastProvider';
import {useToast} from './useToast';
import {Button} from '../Button';
import {Box} from '../Box';

const meta: Meta<typeof ToastProvider> = {
  title: 'Components/ToastProvider',
  component: ToastProvider,
  parameters: {layout: 'centered'},
};
export default meta;

type Story = StoryObj<typeof ToastProvider>;

function Demo() {
  const toast = useToast();
  return (
    <Box
      style={{display: 'flex', flexDirection: 'column', gap: 12, width: 280}}>
      <Button onPress={() => toast.success({title: '저장됐어요'})}>
        success
      </Button>
      <Button
        variant="destructive"
        onPress={() =>
          toast.error({
            title: '결제 실패',
            description: '잠시 후 다시 시도해 주세요.',
          })
        }>
        error
      </Button>
      <Button
        onPress={() =>
          toast.brand({title: '스타 적립!', description: '+12 stars'})
        }>
        brand
      </Button>
      <Button
        onPress={() =>
          toast.show({tone: 'neutral', title: '계속 표시', duration: 0})
        }>
        show (duration 0)
      </Button>
      <Button variant="secondary" onPress={() => toast.dismiss()}>
        dismiss all
      </Button>
    </Box>
  );
}

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <Demo />
    </ToastProvider>
  ),
};

export const TopPosition: Story = {
  render: () => (
    <ToastProvider position="top">
      <Demo />
    </ToastProvider>
  ),
};
```

- [ ] **Step 2: Create the native story**

`src/components/Toast/ToastProvider.native.stories.tsx`:

```tsx
import type {Meta, StoryObj} from '@storybook/react-native';
import React from 'react';
import {ToastProvider} from './ToastProvider';
import {useToast} from './useToast';
import {Button} from '../Button';
import {Box} from '../Box';

const meta: Meta<typeof ToastProvider> = {
  title: 'Components/ToastProvider',
  component: ToastProvider,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ToastProvider>;

function Demo() {
  const toast = useToast();
  return (
    <Box flexDirection="column" gap={12} width={280}>
      <Button onPress={() => toast.success({title: '저장됐어요'})}>
        success
      </Button>
      <Button
        variant="destructive"
        onPress={() =>
          toast.error({
            title: '결제 실패',
            description: '잠시 후 다시 시도해 주세요.',
          })
        }>
        error
      </Button>
      <Button
        onPress={() =>
          toast.brand({title: '스타 적립!', description: '+12 stars'})
        }>
        brand
      </Button>
      <Button
        onPress={() =>
          toast.show({tone: 'neutral', title: '계속 표시', duration: 0})
        }>
        show (duration 0)
      </Button>
      <Button variant="secondary" onPress={() => toast.dismiss()}>
        dismiss all
      </Button>
    </Box>
  );
}

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <Demo />
    </ToastProvider>
  ),
};

export const TopPosition: Story = {
  render: () => (
    <ToastProvider position="top">
      <Demo />
    </ToastProvider>
  ),
};
```

- [ ] **Step 3: Typecheck**

Run: `pnpm typecheck`
Expected: PASS. If an error references the new files, fix prop names against `src/components/Toast/types.ts` / `src/components/Button/types.ts` and re-run.

- [ ] **Step 4: Build**

Run: `pnpm build`
Expected: PASS (commonjs/module/typescript). Stories are excluded from the tarball (`*.stories` glob) — confirm no build error.

- [ ] **Step 5: Commit**

```bash
git add src/components/Toast/ToastProvider.web.stories.tsx src/components/Toast/ToastProvider.native.stories.tsx
git commit -m "feat(Toast): ToastProvider imperative demo stories (web + native)"
```

---

## Final Verification

- [ ] **Confirm both files present:** `ls src/components/Toast/ToastProvider.*.stories.tsx` → 2 files.
- [ ] **Full typecheck:** `pnpm typecheck` → PASS.
- [ ] **Update memory:** append to `/Users/logan/.claude/projects/-Users-logan-Repository-wooBottle-externalProjects-woosign/memory/bottomsheet-component.md` noting ToastProvider imperative demo stories added (web + native, Default + TopPosition, no tests).

---

## Self-Review Notes

- **Spec coverage:** web story → Step 1; native story → Step 2; `Demo` showcases success/error/brand/show(duration:0)/dismiss → both steps; `Default` + `TopPosition` stories → both steps; validation typecheck+build → Steps 3-4. All spec sections covered.
- **API consistency:** `toast.success/error/brand/show/dismiss` match `ToastApi` in `useToast.ts`/`types.ts`. `ToastProvider position="top"` matches `ToastProviderProps.position`. `show({tone:'neutral', title, duration:0})` matches `ToastOptions`. `Button variant`/`onPress` confirmed against `Button/types.ts`.
- **No placeholders:** both story files are complete.
```
