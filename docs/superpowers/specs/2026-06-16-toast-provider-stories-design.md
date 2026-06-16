# ToastProvider 임퍼러티브 데모 스토리 설계

**날짜:** 2026-06-16
**범위:** `ToastProvider` + `useToast()` 임퍼러티브 API를 시연하는 Storybook 스토리를 web·native 두 플랫폼에 추가한다.

## 목표

현재 Toast는 dumb 컴포넌트 스토리만 있고 임퍼러티브 Provider 데모는 web·native 둘 다 없다. DialogProvider의 web 스토리(`DialogProvider.web.stories.tsx`)와 동일한 `Demo` 패턴으로 `ToastProvider`/`useToast`를 시연하는 스토리를 양 플랫폼에 추가해 일관성을 확보한다.

## 비목표 (YAGNI)

- dumb `Toast` 스토리 변경 (이미 있음).
- 새 Provider 기능/prop 추가.
- 자동화 테스트 (스토리는 시각 산출물 — typecheck로만 검증).

## 산출물

신규 2개 파일:
- `src/components/Toast/ToastProvider.web.stories.tsx` — `@storybook/react`
- `src/components/Toast/ToastProvider.native.stories.tsx` — `@storybook/react-native`, `tags: ['autodocs']`

둘 다 `title: 'Components/ToastProvider'`.

## 구성

각 파일에 `<ToastProvider>`로 감싼 named `Demo` 컴포넌트(hook 규칙 준수). `useToast()`의 API를 트리거 버튼으로 시연:

- `success({title})` — 성공 토스트
- `error({title, description})` — 에러 토스트(설명 포함)
- `brand({title})` — 브랜드 토스트
- `show({tone: 'neutral', title, duration: 0})` — 자동닫힘 끈 영구 토스트(반환 id는 사용 안 해도 무방)
- `dismiss()` — 전체 닫기

레이아웃은 `Box`/`Text`/`Button`만 사용(web도 DialogProvider 스토리처럼 `Box`). 토스트가 화면 스택에 직접 뜨므로 결과 텍스트 표시는 불필요.

### 스토리 (각 파일 2개)

- `Default` — 기본 `<ToastProvider>`(하단 스택).
- `TopPosition` — `<ToastProvider position="top">` — provider의 `position` prop 시연.

각 스토리는 `render: () => (<ToastProvider ...><Demo/></ToastProvider>)` 형태. `Demo`는 한 번 정의해 두 스토리가 공유한다.

## 참조 패턴

`DialogProvider.web.stories.tsx`의 `Demo`(named 컴포넌트가 `useDialog()` 호출 + Button들) 구조를 미러. native 레이아웃은 기존 네이티브 스토리(`Switch.native.stories.tsx` 등)의 `Box`/`Text` 사용 규약을 따른다.

## API 참조 (변경 없음)

`useToast(): ToastApi` — `show(ToastOptions): string`, `success/error/brand/neutral(Omit<ToastOptions,'tone'>): string`, `dismiss(id?): void`. `ToastProvider` props: `duration`(기본 4000), `position`('bottom'|'top', 기본 'bottom'), `max`(기본 5), `offset`(기본 24).

## 검증

- `pnpm typecheck` — tsc가 stories 포함 타입 검증, PASS.
- `pnpm build` — 스토리는 빌드/tarball 제외, PASS.
- CI lint는 `*.stories` 제외 — lint 대상 아님. 단 prettier-clean 유지.
- 테스트 없음.

## 파일 구조

```
src/components/Toast/ToastProvider.web.stories.tsx     (신규)
src/components/Toast/ToastProvider.native.stories.tsx  (신규)
```

기존 파일 수정 없음(순수 신규 추가).
