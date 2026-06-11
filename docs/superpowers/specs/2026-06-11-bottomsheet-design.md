# BottomSheet 컴포넌트 설계

> @woosign/ui — "Paper & Ink" 디자인 시스템의 하단 시트(BottomSheet) 컴포넌트.
> 크로스 플랫폼(RN + Web). Dialog 컴포넌트의 파일/스타일/테스트 규약을 그대로 따른다.

## 목표

화면 하단에서 올라오는 **Controlled** 시트를 제공한다. 사용처가 `open` 상태를
소유하고, BottomSheet는 표면·scrim·닫기 동작(탭/Esc/back/드래그)만 책임진다.
높이는 콘텐츠 기반(auto)이며 `maxHeightRatio` 상한을 가진다.

## 비목표 (이번 범위 제외)

- 스냅포인트(50%/90% 등 다단 높이) — 추후 별도 작업.
- Focus trap, web body scroll lock — Dialog와 동일하게 보류. (저렴한 ARIA 속성은 포함)
- 키보드 회피(keyboard avoidance) — 호스트 앱 책임.
- 사이드 Drawer 변형 — 다음 라운드.
- 네이티브 스토리북 스토리 — 기존 컴포넌트들과 동일하게 보류.
- 외부 의존성(@gorhom/bottom-sheet, reanimated, gesture-handler) 채택 — 제로
  의존성 유지가 라이브러리 원칙.

## 아키텍처

### 파일 구조 (Dialog 패턴)

```
src/components/BottomSheet/
  types.ts                    # BottomSheetProps(base/web/native) + 서브컴포넌트 props
  BottomSheetContext.ts       # aria id 전달용 내부 Context (web 한정 의미)
  BottomSheet.styles.ts       # surface/handle/section 스타일 + 상수 (shared)
  dismiss.ts                  # shouldDismiss(dy, vy, sheetHeight) 순수 함수 (shared)
  BottomSheet.web.tsx         # createPortal + scrim + Esc + pointer 드래그
  BottomSheet.native.tsx      # RN <Modal> + PanResponder 드래그
  BottomSheet.tsx             # web facade fallback (export from './BottomSheet.web')
  BottomSheet.web.stories.tsx
  BottomSheet.web.test.tsx
  index.ts
```

`src/components/index.ts`에 `export * from './BottomSheet'` 추가.

### 렌더링 방식

- **Web:** `createPortal(document.body)` — 부모 `overflow`/stacking context 탈출.
  SSR 가드(`mounted` 상태)는 Dialog.web과 동일. scrim은 `position: fixed; inset: 0`
  + `display: flex; align-items: flex-end`로 표면을 하단 정렬.
- **Native:** RN 내장 `<Modal transparent animationType="slide">`. 진입/퇴장
  슬라이드를 Modal에 위임(Dialog가 fade를 위임한 것과 동일한 단순함). Android
  하드웨어 back은 `onRequestClose`로 onClose에 연결.

## API

### BottomSheet (컨테이너)

```tsx
<BottomSheet
  open={boolean}                  // 필수. 표시 여부
  onClose={() => void}            // 필수. scrim/Esc/back/드래그 디스미스 시 호출
  closeOnScrimClick={boolean}     // 기본 true
  closeOnEsc={boolean}            // 기본 true (web Esc / native Android back)
  dragToClose={boolean}           // 기본 true. true면 grabber 핸들 자동 렌더 + 드래그 디스미스
  maxHeightRatio={number}         // 기본 0.9. 화면 높이 대비 시트 최대 높이 (0~1)
  testID={string}
>
  {children}
</BottomSheet>
```

`size` prop은 없다 — 시트는 가로 꽉 참 + 콘텐츠 기반 높이.

### 서브컴포넌트 (모두 선택적, 자유 조합)

`BottomSheet.Header`, `BottomSheet.Title`, `BottomSheet.Description`,
`BottomSheet.Body`, `BottomSheet.Footer` — Dialog와 동일하게 dot-notation attach.
Body는 콘텐츠가 maxHeight를 넘으면 스크롤된다(web `overflow-y: auto`,
native `<ScrollView>`).

```tsx
<BottomSheet open={open} onClose={close}>
  <BottomSheet.Header>
    <BottomSheet.Title>옵션 선택</BottomSheet.Title>
    <BottomSheet.Description>하나를 골라주세요.</BottomSheet.Description>
  </BottomSheet.Header>
  <BottomSheet.Body>{/* 목록 등 스크롤 콘텐츠 */}</BottomSheet.Body>
  <BottomSheet.Footer>
    <Button onPress={confirm}>확인</Button>
  </BottomSheet.Footer>
</BottomSheet>
```

### 핸들 (grabber)

`dragToClose={true}`(기본)일 때 표면 최상단에 자동 렌더되는 36×4 알약형 바.
별도 서브컴포넌트로 노출하지 않는다 — 드래그 가능성의 시각적 신호와 드래그
히트 영역(핸들 주변 상하 패딩 포함)을 컴포넌트가 소유한다.
`dragToClose={false}`면 핸들과 드래그 모두 비활성.

## 동작

| 동작 | Web | Native |
|------|-----|--------|
| 열림 제어 | `open` → portal mount/unmount | RN `<Modal visible={open}>` |
| Scrim 탭 | scrim `<div onClick>` → `closeOnScrimClick && onClose()` | scrim `<Pressable>` → 동일 |
| Esc / back | `document` keydown `Escape` 리스너 (open & closeOnEsc일 때만 등록, onCloseRef 패턴) | `<Modal onRequestClose>` (Android back) |
| 표면 탭 전파 | 표면 `onClick`에서 `stopPropagation` | 표면 `<Pressable>`이 전파 차단 |
| 드래그 디스미스 | 핸들 영역 Pointer Events (`pointerdown/move/up` + `setPointerCapture`) | 핸들 영역 `PanResponder` |

### 드래그 디스미스 상세

- 드래그는 **핸들 영역에서만** 시작된다. Body 스크롤과의 제스처 충돌을 원천
  차단하기 위한 의도적 제약(스코프 결정 사항).
- 아래 방향만 따라온다: `translateY = max(0, dy)`. 위로는 저항 없이 0에 고정.
- 릴리스 시 판정은 공유 순수 함수로:

```ts
// dismiss.ts
/** 드래그 릴리스 시 시트를 닫을지 판정. dy: 누적 하강(px), vy: 릴리스 속도(px/ms). */
export function shouldDismiss(dy: number, vy: number, sheetHeight: number): boolean
```

- 판정 기준: `dy > sheetHeight * 0.25` (충분히 내림) **또는** `vy > 0.5` (빠른
  플릭, dy가 최소 24px 이상일 때).
- 닫힘 판정 → `onClose()` 호출. 복귀 판정 → web은 CSS transition
  (`duration.normal` ≈ 200ms, `easing.out`)으로, native는 `Animated.spring`으로
  translateY 0 복귀.
- native에서 닫힘 판정 시 translateY를 리셋하지 않고 바로 `onClose()`를 호출한다
  — Modal의 slide-out이 현재 위치에서 이어져 시각적 점프를 최소화.

### 애니메이션

- Web: Dialog처럼 `<style>@keyframes`로 scrim fade-in + 표면 slide-up
  (translateY 100%→0), 약 220ms `easing.out`.
- Native: `<Modal animationType="slide" transparent>`.

### 접근성 (저렴한 범위만, Dialog와 동일 수준)

- 표면에 `role="dialog"`, `aria-modal="true"` (web).
- `BottomSheet.Title` 마운트 시 `aria-labelledby`, `BottomSheet.Description`
  마운트 시 `aria-describedby` 자동 연결 — Dialog와 동일한 등록형 Context 패턴.
- id 생성은 Dialog와 동일하게 모듈 레벨 카운터(`wb-bottomsheet-title-N`) 사용
  (React 17 호환 — `useId` 금지).

## 토큰 활용 (모두 기존 토큰 사용, 신규 토큰 추가 없음)

- 표면 배경: `colors.card`.
- 모서리: 상단만 `borderRadius.lg` (16). 하단 0.
- 그림자: web `shadowsCss.modal`, native `shadows.modal`.
- scrim: `rgba(0, 0, 0, 0.5)` (Dialog와 동일 상수 값, BottomSheet.styles.ts에 자체 보유).
- z-index: web `zIndex.modal` (1400).
- 핸들 색: `colors.borderStrong` 계열(blackAlpha 중간 단계) — 기존 토큰에서 선택.
- 텍스트: Title `colors.textPrimary`, Description `colors.textSecondary`.
- 패딩/간격: `spacing` 토큰. Header/Body/Footer 패딩은 Dialog.styles와 동일 값.
- 모션: `duration`, `easing` 토큰.

## 내부 설계 메모

- web/native 공유 스타일·상수는 `BottomSheet.styles.ts`에 둔다 (Dialog 방식).
- native 하단 safe area: 표면을 RN 코어 `SafeAreaView`로 감싸 iOS 홈 인디케이터
  영역을 확보 (외부 safe-area 라이브러리 불사용).
- `maxHeightRatio` 적용: web은 `maxHeight: calc(<ratio> * 100dvh)` (dvh 미지원
  브라우저는 vh fallback), native는 `Dimensions.get('window').height * ratio`.
- 드래그 중에는 scrim 클릭 판정을 막을 필요 없음 — 핸들에서 시작한 포인터는
  표면 내부이므로 전파 차단에 이미 걸린다.

## 테스트

### `BottomSheet.web.test.tsx` (jsdom)

1. `open={false}`이면 콘텐츠가 렌더되지 않는다.
2. `open={true}`이면 Title/Body 등이 렌더된다.
3. scrim 클릭 시 `onClose` 호출.
4. `closeOnScrimClick={false}`이면 scrim 클릭해도 `onClose` 미호출.
5. Esc 키 → `onClose` 호출. `closeOnEsc={false}`이면 미호출.
6. 표면 클릭 시 `onClose` 미호출 (전파 차단 확인).
7. `aria-modal`, `role="dialog"`, Title 연결(`aria-labelledby`) 존재.
8. `dragToClose={true}`(기본)면 핸들이 렌더되고, `false`면 렌더되지 않는다.
9. 핸들 pointer 시퀀스(down→큰 move→up)로 `onClose` 호출, 작은 move면 미호출.
   (jsdom pointer capture 제약이 크면 이 항목은 `shouldDismiss` 단위 테스트로 대체 가능)

### `src/__tests__/bottomsheet-dismiss.test.ts` (기존 "tokens" node 프로젝트에 잡힘)

- `shouldDismiss` 경계값: 거리 임계 초과/미달, 속도 임계 초과/미달, 플릭 최소
  거리(24px) 미달 시 false.

## 스토리 (`BottomSheet.web.stories.tsx`)

- 기본(Header+Body+Footer), 긴 콘텐츠(Body 스크롤), `dragToClose={false}`,
  scrim/Esc 옵션 조합 — Dialog 스토리 구성을 미러링.

## index 내보내기

`BottomSheet/index.ts`에서 `BottomSheet`(서브컴포넌트 attach된 것)와 모든 public
타입(`BottomSheetProps`, `BottomSheetWebProps`, `BottomSheetNativeProps`,
서브컴포넌트 props)을 export. 컴포넌트 본체는 `BottomSheet.tsx`(web facade)에서
가져온다. `shouldDismiss`는 내부 구현으로 public export하지 않는다.
