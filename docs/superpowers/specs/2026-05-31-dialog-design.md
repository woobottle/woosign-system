# Dialog 컴포넌트 설계

> @woosign/ui — "Paper & Ink" 디자인 시스템의 차단형(modal) Dialog 컴포넌트.
> 크로스 플랫폼(RN + Web). Toast 컴포넌트의 파일/스타일 규약을 그대로 따른다.

## 목표

확인/경고/폼 등을 담는 표준 **Controlled** Dialog를 제공한다. 사용처가 `open`
상태를 소유하고, Dialog는 표면·scrim·닫기 동작만 책임진다.

## 비목표 (이번 범위 제외)

- Imperative API (`useDialog().confirm(...)`) — 추후 별도 작업.
- Focus trap, body scroll lock — 이번 범위 제외. (단, 저렴한 ARIA 속성은 포함)
- Drawer/BottomSheet 등 변형.

## 아키텍처

### 파일 구조 (Toast 패턴)

```
src/components/Dialog/
  types.ts              # DialogProps(base/web/native) + 서브컴포넌트 props
  Dialog.styles.ts      # surface/scrim/size 토큰 (shared)
  Dialog.web.tsx        # createPortal + scrim + Esc, role="dialog"
  Dialog.native.tsx     # RN <Modal> 래퍼
  Dialog.tsx            # web facade fallback (export from './Dialog.web')
  Dialog.web.stories.tsx
  index.ts
```

`src/components/index.ts`에 `export * from './Dialog'` 추가.

### 렌더링 방식

- **Web:** `createPortal(document.body)` — 부모 `overflow`/stacking context를
  탈출. SSR 가드(`mounted` 상태)는 Toast.web과 동일하게 적용.
- **Native:** React Native 내장 `<Modal>` 사용. Android 하드웨어 back 버튼,
  상태바, 전체화면 오버레이를 RN이 처리한다. `onRequestClose`로 back을 onClose에
  연결. (Toast가 absolute 오버레이를 쓰는 것과 다른 이유: Toast는 비차단이지만
  Dialog는 차단형이라 RN Modal의 포커스/back 처리가 정확히 들어맞음.)

## API

### Dialog (컨테이너)

```tsx
<Dialog
  open={boolean}                  // 필수. 표시 여부
  onClose={() => void}            // 필수. scrim/Esc/back 시 호출
  size="sm" | "md" | "lg"         // 기본 "md"
  closeOnScrimClick={boolean}     // 기본 true
  closeOnEsc={boolean}            // 기본 true (web Esc / native Android back)
  testID={string}
>
  {children}
</Dialog>
```

### 서브컴포넌트 (모두 선택적, 자유 조합)

`Dialog.Header`, `Dialog.Title`, `Dialog.Description`, `Dialog.Body`,
`Dialog.Footer` — 각 함수 컴포넌트를 `Dialog.Title = DialogTitle` 형태로 attach.
children만 넣어도 동작하며, 서브컴포넌트는 일관된 패딩/타이포/간격을 제공한다.

```tsx
<Dialog open={open} onClose={close}>
  <Dialog.Header>
    <Dialog.Title>주문을 취소할까요?</Dialog.Title>
    <Dialog.Description>이 작업은 되돌릴 수 없어요.</Dialog.Description>
  </Dialog.Header>
  <Dialog.Body>본문 콘텐츠</Dialog.Body>
  <Dialog.Footer>
    <Button variant="secondary" onPress={close}>닫기</Button>
    <Button variant="destructive" onPress={confirm}>취소하기</Button>
  </Dialog.Footer>
</Dialog>
```

### size → maxWidth 매핑

| size | maxWidth |
|------|----------|
| sm   | 360      |
| md   | 440      |
| lg   | 560      |

- Web: 카드 `width: 'min(<maxWidth>px, calc(100vw - 32px))'`.
- Native: `width: '90%'`, `maxWidth: <위 값>`.

## 동작

| 동작 | Web | Native |
|------|-----|--------|
| 열림 제어 | `open` → portal mount/unmount | RN `<Modal visible={open}>` |
| Scrim 클릭 | scrim `<div onClick>` → `closeOnScrimClick && onClose()` | scrim `<Pressable>` → 동일 |
| Esc / back | `document` keydown `Escape` 리스너 (open & closeOnEsc일 때만 등록) | `<Modal onRequestClose>` (Android back) |
| 표면 클릭 전파 | 카드 `onClick`에서 `stopPropagation` | 카드 `<Pressable>`이 전파 차단 |

- 애니메이션
  - Web: Toast처럼 `<style>@keyframes>`로 scrim fade-in + 카드 fade/scale-in(0.96→1),
    약 180ms ease-out.
  - Native: `<Modal animationType="fade" transparent>`.
- 접근성(저렴한 범위만 포함): 카드에 `role="dialog"`, `aria-modal="true"`.
  `Dialog.Title`이 있으면 자동 생성 id로 `aria-labelledby` 연결, `Dialog.Description`은
  `aria-describedby` 연결. (web 한정. id 연결은 React `useId`로 생성하여 Context로
  서브컴포넌트에 전달.)

## 토큰 활용 (모두 기존 토큰 사용, 신규 토큰 추가 없음)

- 표면 배경: `colors.card` (`#FFFFFF`).
- 모서리: `borderRadius.lg` (16).
- 그림자: web `shadowsCss.modal`, native `shadows.modal`.
- scrim: `rgba(0, 0, 0, 0.5)` (ink 계열 반투명).
- z-index: web `zIndex.modal` (1400).
- 텍스트: Title `colors.textPrimary`, Description `colors.textSecondary`.
- 패딩/간격: `spacing` 토큰 (Header/Body/Footer 패딩, Footer 버튼 gap).
  Card.styles의 헤더/푸터 패딩값을 참고해 일관성 유지.

## 내부 설계 메모

- web/native가 공유하는 size/scrim 상수는 `Dialog.styles.ts`에 둔다.
- 서브컴포넌트는 `Dialog.styles.ts`의 스타일을 web(CSSProperties)·native(StyleSheet)
  양쪽에서 사용. Toast가 `Toast.styles.ts` 하나를 공유하는 방식과 동일.
- aria id 전달용 내부 Context(`DialogContext`)는 web에서만 의미가 있으나, 타입
  공유를 위해 `Dialog/` 내부에 두고 native에선 미사용.

## 테스트 (`Dialog.test.tsx`, web 환경 jsdom)

1. `open={false}`이면 콘텐츠가 렌더되지 않는다.
2. `open={true}`이면 Title/Body 등이 렌더된다.
3. scrim 클릭 시 `onClose` 호출.
4. `closeOnScrimClick={false}`이면 scrim 클릭해도 `onClose` 미호출.
5. Esc 키 → `onClose` 호출. `closeOnEsc={false}`이면 미호출.
6. 카드(표면) 클릭 시 `onClose` 미호출 (전파 차단 확인).
7. `aria-modal`, `role="dialog"`, Title 연결(`aria-labelledby`) 존재.

## index 내보내기

`Dialog/index.ts`에서 `Dialog`(서브컴포넌트 attach된 것)와 모든 public 타입
(`DialogProps`, `DialogWebProps`, `DialogNativeProps`, `DialogSize`, 서브컴포넌트
props)을 export. 컴포넌트 본체는 `Dialog.tsx`(web facade)에서 가져온다.
