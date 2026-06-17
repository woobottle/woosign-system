# 오버레이 포커스 트랩 설계

**날짜:** 2026-06-17
**범위:** web 오버레이 3종(Dialog, BottomSheet, Drawer)에 포커스 트랩 + 초기 포커스 + 포커스 복원을 추가한다.

## 목표

세 web 오버레이는 `role="dialog"`/`aria-modal`만 있고 키보드 포커스 관리가 없다(현재 포커스 관련 코드 0). 모달이 열리면 포커스가 배경에 남아 키보드/스크린리더 사용자가 모달 밖 요소로 Tab 이동할 수 있는 접근성 결함이다. 공유 훅으로 (1) 열릴 때 모달 내부로 포커스 이동, (2) Tab 순환을 모달 내부로 가둠, (3) 닫힐 때 직전 요소로 복원을 추가한다.

## 비목표 (YAGNI)

- native 변경 — RN `Modal` + OS 접근성이 포커스를 자체 처리한다(이 작업은 web 전용).
- `initialFocusRef`/`finalFocusRef` 커스터마이즈 prop.
- 배경 `inert`/`aria-hidden` 처리(트랩 + 복원까지만).
- 의존성 추가(focus-trap 등) — 제로-의존 원칙 유지.

## 아키텍처

**공유 훅 `useFocusTrap(containerRef, active)`** (web DOM 전용). 세 web 구현(`Dialog.web.tsx`/`BottomSheet.web.tsx`/`Drawer.web.tsx`)이 surface ref와 `open`을 넘겨 사용한다. 훅은 DOM API(`document.activeElement`, `focus()`, `keydown`)를 쓰므로 web 전용이며, native가 실수로 import하지 못하도록 **`src/core/hooks/index.ts` 배럴에 추가하지 않고** 각 web 파일이 직접 import한다.

| 파일 | 변경 |
|---|---|
| `src/core/hooks/useFocusTrap.ts` | 신규 — 공유 포커스 트랩 훅 |
| `src/components/Dialog/Dialog.web.tsx` | surface ref + `useFocusTrap` 배선 |
| `src/components/BottomSheet/BottomSheet.web.tsx` | 기존 `surfaceRef`에 `useFocusTrap` 배선 |
| `src/components/Drawer/Drawer.web.tsx` | surface ref 추가 + `useFocusTrap` 배선 |

## 훅 명세 (`useFocusTrap.ts`)

시그니처: `useFocusTrap(containerRef: RefObject<HTMLElement | null>, active: boolean): void`

동작:

1. **활성화(`active`가 true가 될 때)**:
   - `previousActiveElement = document.activeElement as HTMLElement | null` 저장.
   - 컨테이너 내 첫 포커서블 요소를 찾아 `focus()`. 없으면 컨테이너에 `tabIndex=-1`을 부여하고 컨테이너를 `focus()`.
2. **활성 중 `keydown` 리스너(document)**:
   - Tab(Shift 없음)이고 현재 포커스가 마지막 포커서블이거나 컨테이너 밖이면 → `preventDefault()` 후 첫 포커서블로 이동.
   - Shift+Tab이고 현재 포커스가 첫 포커서블이거나 컨테이너 밖이면 → `preventDefault()` 후 마지막 포커서블로 이동.
   - 포커서블이 0개면 Tab 시 컨테이너 자신에 머무름(`preventDefault`).
3. **비활성화/언마운트**: `previousActiveElement?.focus()`로 복원. 리스너 정리.

포커서블 셀렉터:
```
a[href], button:not([disabled]), input:not([disabled]),
select:not([disabled]), textarea:not([disabled]),
[tabindex]:not([tabindex="-1"])
```
조회 후 `offsetParent !== null`(가시) 필터로 숨김 요소 제외(jsdom에선 offsetParent가 null일 수 있어, 필터는 "정의돼 있고 disabled 아님" 수준으로 방어적으로 — 실행 환경에서 테스트로 검증).

훅은 `active`/`containerRef.current` 변화에 반응하되, 활성 진입 시 1회 초기 포커스를 잡고, 리스너는 active 동안만 등록한다. 콜백은 ref로 최신값 참조(stale 방지) — 기존 오버레이의 `onCloseRef` 패턴과 동일 결.

## 배선

각 web 오버레이의 surface `<div>`에 `ref={surfaceRef}`(Dialog/Drawer는 신규 ref, BottomSheet는 기존 `surfaceRef` 재사용)를 달고, 컴포넌트 본문에서 `useFocusTrap(surfaceRef, open && mounted)` 호출. scrim 클릭/Esc/aria/슬라이드 등 기존 로직은 전부 무변경. 초기 포커스는 **첫 포커서블(폴백 컨테이너)**.

> 구현 정정: 활성 신호는 `open`이 아니라 **`open && mounted`**다. 세 오버레이는 SSR/portal용 `mounted` 게이트가 있어 surface가 한 렌더 늦게 그려진다. `open`만 쓰면 직접 `open` 마운트 시 훅 이펙트가 처음 돌 때 `containerRef.current`가 아직 null이고, deps가 안 바뀌어 재실행되지 않아 트랩이 안 걸린다. `open && mounted`로 하면 mounted 확정(surface 존재) 후 활성 전이가 일어나 정상 동작한다(훅 자체는 무변경).

## 테스트 (jsdom, `@testing-library/react` + `userEvent`)

**훅 단위 테스트 `src/core/hooks/useFocusTrap.web.test.tsx`**(테스트용 하니스 컴포넌트로 훅 구동):
- 활성 시 컨테이너 첫 포커서블로 초기 포커스 이동.
- 포커서블이 없으면 컨테이너 자신이 포커스(받기 위해 tabIndex=-1).
- 마지막에서 `userEvent.tab()` → 첫 요소로 순환.
- 첫에서 `userEvent.tab({shift: true})` → 마지막으로 순환.
- 비활성화 시 직전 포커스 요소로 복원.

**오버레이 통합 테스트**(각 web 테스트 파일에 1~2건 추가):
- Dialog/BottomSheet/Drawer: 트리거 버튼에 포커스 → 열기 → 포커스가 surface 내부 요소로 이동 → 닫기 → 트리거 버튼으로 복원. (열린 상태에서 Tab 순환 1건은 Dialog 또는 한 곳에서 대표 검증.)

native 무변경 → native 테스트 추가 없음.

## 검증

- `pnpm jest --selectProjects web` — 그린(기존 + 신규 훅/통합 테스트).
- `pnpm typecheck` — PASS.
- `pnpm build` — PASS. native 빌드/번들이 `useFocusTrap`을 끌어오지 않음(배럴 미포함, web 파일만 import) 확인.
- CI-스코프 lint prettier-clean.

## 파일 구조

```
src/core/hooks/useFocusTrap.ts            (신규)
src/core/hooks/useFocusTrap.web.test.tsx  (신규)
src/components/Dialog/Dialog.web.tsx       (수정: ref + 훅)
src/components/BottomSheet/BottomSheet.web.tsx (수정: 훅)
src/components/Drawer/Drawer.web.tsx       (수정: ref + 훅)
+ 각 web 테스트 파일에 통합 테스트 추가
```
