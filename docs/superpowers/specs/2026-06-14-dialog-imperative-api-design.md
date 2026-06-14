# Dialog 임퍼러티브 API 설계

> @woosign/ui — 기존 controlled `<Dialog>` 위에 Promise 기반 임퍼러티브
> `useDialog().confirm()/alert()` 레이어를 추가한다. Toast의 Provider+hook+상태머신
> 규약을 그대로 따른다. 기존 Dialog 컴포넌트/서브컴포넌트 API는 무손상.

## 목표

`const ok = await useDialog().confirm({...})` 형태로, 컴포넌트 트리에 controlled
state를 두지 않고도 확인/경고 대화를 띄우고 사용자 응답을 await할 수 있게 한다.
Toast의 `useToast()` 패턴(Provider가 상태 소유, hook이 API 노출)을 미러링하되,
Dialog는 차단형이라 **Promise 기반**(응답을 기다림)이고 **큐잉**(한 번에 하나)이다.

## 비목표 (이번 범위 제외)

- `prompt()`(텍스트 입력) — Input 조합이 필요해 별도 작업.
- 동시 다중 표시 — Dialog는 차단형, 한 번에 하나(큐잉).
- 애니메이션/위치/size 커스터마이즈 — controlled Dialog의 기존 동작을 그대로 사용.
- 컴포넌트 다크모드 연동 — 별도 작업.

## 아키텍처 (Toast 패턴 미러링)

```
src/components/Dialog/
  useDialogState.ts            # 상태머신: 큐 + Promise resolve + confirm/alert/dismiss API (shared)
  DialogImperativeContext.ts   # API 전달용 Context — 기존 DialogContext(aria id용)와 이름 분리
  useDialog.ts                 # consumer hook; Provider 밖이면 throw
  DialogProvider.tsx           # web facade → export from './DialogProvider.web'
  DialogProvider.web.tsx       # 큐 head를 controlled <Dialog>로 렌더 + Context
  DialogProvider.native.tsx    # 동일 (RN; Dialog.native가 Modal이라 별도 오버레이 불필요)
  types.ts                     # 확장: DialogApi, ConfirmOptions, AlertOptions, DialogEntry, DialogProviderProps
  index.ts                     # 확장: Provider/hook/타입 export
```

기존 `DialogContext.ts`(aria id 전달, web 내부용)는 그대로 두고, 임퍼러티브 API
전달용은 **별도** `DialogImperativeContext.ts`에 둔다(역할/이름 충돌 회피).

`DialogProvider`는 controlled `<Dialog>`와 `Button`을 재사용한다 — 새 시각 컴포넌트를
만들지 않는다.

## API

```ts
const dialog = useDialog();

// 확인/취소 2버튼. 확인=true, 취소/scrim/Esc=false.
const ok: boolean = await dialog.confirm({
  title: ReactNode,
  description?: ReactNode,
  confirmText?: string,   // 기본 '확인'
  cancelText?: string,    // 기본 '취소'
  tone?: 'default' | 'destructive',  // 기본 'default'. destructive면 확인 버튼 variant="destructive"
});

// 확인 1버튼. 닫히면 resolve.
await dialog.alert({
  title: ReactNode,
  description?: ReactNode,
  confirmText?: string,   // 기본 '확인'
});
```

`useDialog()`는 `<DialogProvider>` 밖에서 호출하면 명확한 에러를 throw한다(Toast의
`useToast()`와 동일 패턴).

## 타입 (types.ts 추가분)

```ts
export interface ConfirmOptions {
  title: ReactNode;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  tone?: 'default' | 'destructive';
}

export interface AlertOptions {
  title: ReactNode;
  description?: ReactNode;
  confirmText?: string;
}

export interface DialogApi {
  confirm(options: ConfirmOptions): Promise<boolean>;
  alert(options: AlertOptions): Promise<void>;
}

/** 내부 큐 엔트리 — id/resolve는 상태머신이 부여. */
export type DialogEntry =
  | {id: string; kind: 'confirm'; options: ConfirmOptions; resolve: (v: boolean) => void}
  | {id: string; kind: 'alert'; options: AlertOptions; resolve: () => void};

export interface DialogProviderProps {
  children?: ReactNode;
}
```

## 상태머신 (`useDialogState`)

Toast의 `useToastState`와 동형. 반환: `{api: DialogApi, current: DialogEntry | null, confirmCurrent, cancelCurrent}`.

- 큐: `DialogEntry[]` (useState). `current` = 큐의 head(`queue[0] ?? null`).
- id는 모듈/ref 카운터로 부여(`wb-dialog-imperative-${n}`).
- `confirm(options)`: 새 엔트리를 큐에 push하고 `new Promise<boolean>`을 만들어 그
  resolve를 엔트리에 저장, Promise 반환.
- `alert(options)`: 동일하되 `Promise<void>`.
- `confirmCurrent()`: head를 `resolve(true)`(confirm) 또는 `resolve()`(alert) 하고
  큐에서 제거(`setQueue(prev => prev.slice(1))`).
- `cancelCurrent()`: head를 `resolve(false)`(confirm) 또는 `resolve()`(alert) 하고
  큐에서 제거. scrim 클릭/Esc/취소 버튼이 모두 이 경로.
- `api`는 `useMemo`로 안정화. 큐가 비면 `current`가 null이라 Dialog는 닫힌다.
- 언마운트 시 남은 엔트리는 cancel로 resolve(매달린 Promise 방지).

## Provider 렌더 (web/native 공통 구조)

`current`가 있으면:

```tsx
<Dialog open onClose={cancelCurrent}>
  <Dialog.Header>
    <Dialog.Title>{current.options.title}</Dialog.Title>
    {current.options.description && (
      <Dialog.Description>{current.options.description}</Dialog.Description>
    )}
  </Dialog.Header>
  <Dialog.Footer>
    {current.kind === 'confirm' && (
      <Button variant="secondary" onPress={cancelCurrent}>
        {current.options.cancelText ?? '취소'}
      </Button>
    )}
    <Button
      variant={current.kind === 'confirm' && current.options.tone === 'destructive'
        ? 'destructive' : 'default'}
      onPress={confirmCurrent}>
      {current.options.confirmText ?? '확인'}
    </Button>
  </Dialog.Footer>
</Dialog>
```

`current`가 null이면 Dialog 미렌더(`open` false 효과). `onClose`(scrim/Esc/Android
back)는 `cancelCurrent`에 연결.

- **Web Provider**: `<DialogImperativeContext.Provider value={api}>{children}{dialogEl}</...>`.
  Dialog.web이 portal을 쓰므로 Provider는 추가 portal 불필요.
- **Native Provider**: 동일 구조. Dialog.native가 RN `<Modal>`이라 Toast식 absolute
  overlay 불필요 — `{children}` 옆에 그냥 렌더.

## 테스트

### `DialogProvider.web.test.tsx` (jsdom)

1. `useDialog()`를 Provider 밖에서 호출하면 throw한다(`renderHook` 또는 에러 경계).
2. `confirm` 호출 시 title/description과 확인·취소 버튼이 렌더된다.
3. 확인 버튼 클릭 → confirm Promise가 `true`로 resolve.
4. 취소 버튼 클릭 → `false`로 resolve.
5. scrim 클릭 → `false`로 resolve(닫힘 = 취소).
6. `alert` 호출 → 확인 버튼만(취소 없음), 클릭 시 Promise resolve.
7. `tone: 'destructive'`면 확인 버튼이 destructive variant 스타일.
8. 큐잉: confirm 두 번 연속 호출 시 첫 번째만 표시되고, 응답 후 두 번째가 표시되며
   각 Promise가 올바른 값으로 resolve된다.

비동기 resolve 검증은 버튼 클릭(`userEvent.click`) 후 `await expect(promise).resolves.toBe(...)`로 한다. 호출은 테스트용 소비자 컴포넌트(버튼이 `useDialog()`를 호출)를 통해 한다.

### `DialogProvider.native.test.tsx` (react-native preset)

핵심 동작 미러: confirm 렌더, 확인→true, 취소/back(`Modal onRequestClose`)→false,
alert→resolve. scrim/버튼은 testID/role 대신 native 쿼리(`getByText`로 버튼 라벨, back은
`UNSAFE_getByType(Modal).props.onRequestClose()`).

## 스토리

`DialogProvider.web.stories.tsx`: `<DialogProvider>`로 감싼 데모 — 버튼들이
`useDialog().confirm()`/`alert()`를 호출하고 결과를 표시. confirm(default),
confirm(destructive), alert 시나리오.

## index 내보내기

`Dialog/index.ts`에 추가: `DialogProvider`(facade), `useDialog`, 그리고 타입
`DialogApi`, `ConfirmOptions`, `AlertOptions`, `DialogProviderProps`. `useDialogState`와
`DialogEntry`는 내부 구현 — export하지 않는다.

## 검증 (완료 기준)

- `pnpm test` — web(새 DialogProvider.web.test) + native(새 DialogProvider.native.test)
  포함 전체 그린.
- `pnpm typecheck` 클린; `pnpm lint` 0 errors(스토리 제외, 테스트 포함 — prettier 통과);
  `pnpm build` 성공.
