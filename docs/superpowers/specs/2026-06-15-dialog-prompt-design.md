# Dialog `prompt()` 설계

**날짜:** 2026-06-15
**범위:** 기존 임퍼러티브 Dialog API(`useDialog().confirm()`/`alert()`)에 텍스트 입력을 받는 `prompt()`를 추가한다.

## 목표

`useDialog().prompt(options)` → `Promise<string | null>`. 확인 시 입력 문자열(빈 값이면 `''`), 취소/scrim/Esc 시 `null`을 resolve한다. 표준 브라우저 `prompt()`의 시맨틱을 따르고, 기존 `confirm`/`alert`과 동일한 큐잉 상태머신·미니멀 옵션 표면을 공유한다.

## 비목표 (YAGNI)

- `required`/`validate` (빈 입력은 항상 허용하고 `''` 반환).
- `secureTextEntry`/`inputType`/멀티라인 등 Input 고급 옵션.
- prompt 전용 네이티브 스토리 (웹 스토리만 추가).
- confirm/alert 경로 동작 변경 (하위호환 유지).

## 아키텍처

기존 3-파트 구조를 그대로 확장한다: 타입(`types.ts`) → 상태머신(`useDialogState.ts`) → 플랫폼 Provider 렌더(`DialogProvider.web/native.tsx`). prompt는 입력 상태(`useState`)가 필요하므로 렌더는 별도 공유 컴포넌트 `PromptDialog.tsx`로 분리해 confirm/alert 경로를 건드리지 않는다.

## 1. 타입 (`src/components/Dialog/types.ts`)

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

`DialogApi`에 추가:

```ts
/** 확인=입력 문자열(빈 값이면 ''), 취소/scrim/Esc=null. */
prompt(options: PromptOptions): Promise<string | null>;
```

`DialogEntry` 유니온에 `'prompt'` variant 추가:

```ts
| {
    id: string;
    kind: 'prompt';
    options: PromptOptions;
    resolve: (value: string | null) => void;
  }
```

`src/components/Dialog/index.ts` 배럴에 `PromptOptions` 타입 export 추가.

## 2. 상태머신 (`src/components/Dialog/useDialogState.ts`)

`prompt()`가 엔트리를 큐에 push하고 `Promise<string | null>`을 반환한다(`confirm`/`alert`와 동일 패턴, `idRef` 사용). `useDialogState`의 반환 타입에 `prompt`를 포함하고, `confirmCurrent` 시그니처를 `(value?: string) => void`로 확장한다.

`settle`을 일반화해 prompt 입력값을 운반한다:

```ts
const settle = useCallback((confirmed: boolean, promptValue?: string) => {
  const head = currentRef.current;
  if (!head) return;
  if (head.kind === 'confirm') head.resolve(confirmed);
  else if (head.kind === 'alert') head.resolve();
  else head.resolve(confirmed ? (promptValue ?? '') : null); // prompt
  setQueue(prev => prev.slice(1));
}, []);

const confirmCurrent = useCallback(
  (value?: string) => settle(true, value),
  [settle],
);
const cancelCurrent = useCallback(() => settle(false), [settle]);
```

- 취소/scrim/Esc는 `cancelCurrent` → `settle(false)` → prompt는 `null` resolve.
- 확인은 `confirmCurrent(value)` → prompt는 입력 문자열 resolve.
- confirm/alert 호출부는 인자 없이 그대로 동작(하위호환).
- 언마운트 cleanup(`useEffect` return)에서 남은 엔트리 정리 시 prompt면 `e.resolve(null)` 추가:

```ts
queueRef.current.forEach(e => {
  if (e.kind === 'confirm') e.resolve(false);
  else if (e.kind === 'alert') e.resolve();
  else e.resolve(null); // prompt
});
```

`api`는 `useMemo<DialogApi>(() => ({confirm, alert, prompt}), [confirm, alert, prompt])`.

## 3. 렌더링 — 공유 `PromptDialog` (`src/components/Dialog/PromptDialog.tsx`)

신규 파일. Dialog/Input **파사드**(`./Dialog`, `../Input`)를 사용해 web/native 단일 구현으로 중복을 제거한다. 입력 상태를 소유하며, Provider가 `key={entry.id}`로 엔트리마다 새 인스턴스를 만들어 입력값을 리셋한다.

```tsx
import {useState} from 'react';
import {Dialog} from './Dialog';
import {Input} from '../Input';
import {Button} from '../Button';

interface PromptDialogProps {
  entry: {id: string; options: PromptOptions};
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
```

(props의 `entry` 타입은 실제 구현에서 `Extract<DialogEntry, {kind: 'prompt'}>`로 좁혀 쓴다.)

## 4. Provider 분기 (`DialogProvider.web.tsx` + `DialogProvider.native.tsx`)

양 Provider에서 큐 head가 prompt면 `PromptDialog`를 렌더하고, 아니면 기존 confirm/alert Dialog를 그대로 렌더한다:

```tsx
{current &&
  (current.kind === 'prompt' ? (
    <PromptDialog
      key={current.id}
      entry={current}
      onConfirm={confirmCurrent}
      onCancel={cancelCurrent}
    />
  ) : (
    <Dialog key={current.id} open onClose={cancelCurrent}>
      {/* 기존 confirm/alert 렌더 — 무변경 */}
    </Dialog>
  ))}
```

`Input` 파사드 import가 web/native 각각에서 올바른 구현으로 resolve된다. Provider는 `confirmCurrent`를 `PromptDialog`에 그대로 넘기고, `PromptDialog`가 `onConfirm(value)`로 입력값을 전달한다.

## 5. 테스트

**`DialogProvider.web.test.tsx`** (기존 `ConfirmHarness` 패턴 미러 — `PromptHarness`가 `useDialog().prompt()` 호출, Promise를 테스트가 await):

- prompt() 시 Input 렌더 + 입력 후 확인 → 입력 문자열 resolve. (placeholder로 Input 조회 후 `userEvent.type`, 확인 클릭 → `resolves.toBe('커피')`.)
- 빈 입력 확인 → `resolves.toBe('')`.
- 취소 버튼 → `resolves.toBeNull()`.
- scrim 클릭(`dialog-scrim` testID) → `resolves.toBeNull()`.
- `defaultValue` 제공 시 Input 초기값 표시.

**`DialogProvider.native.test.tsx`** (Modal 목킹 환경):

- prompt() 시 Input 렌더 + `fireEvent.changeText`로 입력 후 확인 → 입력 문자열 resolve.
- 취소 → null resolve.

**회귀:** 기존 confirm/alert 테스트(web 7 + native) 전부 무변경 통과.

## 6. 스토리 (`DialogProvider.web.stories.tsx`)

prompt 데모 스토리 1개 추가: 버튼 → `prompt({title, placeholder})` → resolve된 값을 화면에 표시(취소 시 'cancelled' 류).

## 검증

- `pnpm test` — web + native jest 프로젝트 그린(신규 prompt 테스트 포함).
- `pnpm typecheck` — PASS.
- `pnpm build` — PASS(commonjs/module/typescript 3 타겟).

## 파일 변경 요약

| 파일 | 변경 |
|---|---|
| `src/components/Dialog/types.ts` | `PromptOptions` 추가, `DialogApi.prompt`, `DialogEntry` prompt variant |
| `src/components/Dialog/index.ts` | `PromptOptions` export |
| `src/components/Dialog/useDialogState.ts` | `prompt()`, `settle` 일반화, `confirmCurrent(value?)`, cleanup |
| `src/components/Dialog/PromptDialog.tsx` | 신규 — 입력 상태 소유 공유 렌더 |
| `src/components/Dialog/DialogProvider.web.tsx` | prompt 분기 |
| `src/components/Dialog/DialogProvider.native.tsx` | prompt 분기 |
| `src/components/Dialog/DialogProvider.web.test.tsx` | prompt 테스트 5건 |
| `src/components/Dialog/DialogProvider.native.test.tsx` | prompt 테스트 2건 |
| `src/components/Dialog/DialogProvider.web.stories.tsx` | prompt 데모 스토리 |
