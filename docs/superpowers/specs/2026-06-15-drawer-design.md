# Drawer 컴포넌트 설계

**날짜:** 2026-06-15
**범위:** 좌측에서 슬라이드되는 오버레이 패널(side navigation drawer) 컴포넌트를 cross-platform(web + native)으로 추가한다.

## 목표

`@woosign/ui`에 Drawer 컴포넌트를 추가한다. scrim + 좌측 고정 풀하이트 패널로, 형제 오버레이(Dialog/BottomSheet)와 동일한 파사드 구조·서브컴포넌트·닫기 시맨틱·다크모드 메커니즘을 공유한다.

## 비목표 (YAGNI)

- 우측/상단/하단 앵커 (좌측만).
- 드래그/스와이프 디스미스 (scrim/Esc/back만).
- size 프리셋 (`width: number` 단일 prop).
- focus trap (형제 오버레이와 동일하게 보류 — role/aria만).
- persistent(영구 표시) variant.

## 아키텍처

Dialog/BottomSheet와 동일한 파사드 패턴. Metro는 `src/`를 직접 읽어 `.native` 플랫폼 확장으로 resolve하고, web 번들러/jest web 프로젝트는 `.web`을 우선한다.

| 파일 | 책임 |
|---|---|
| `src/components/Drawer/types.ts` | `DrawerBaseProps`/`DrawerWebProps`/`DrawerNativeProps`, 서브컴포넌트 props, `DrawerContextValue` |
| `src/components/Drawer/Drawer.styles.ts` | `getDrawerStyles(c: Colors)` — 표면/헤더/타이틀/설명/바디/푸터 공유 스타일 + 상수(`SCRIM_COLOR` 재사용, `DEFAULT_WIDTH`) |
| `src/components/Drawer/DrawerContext.ts` | aria id 전달용 context(web 한정 의미) — BottomSheet 패턴 미러 |
| `src/components/Drawer/Drawer.web.tsx` | portal + scrim + 좌측 고정 패널 + CSS 슬라이드 + aria |
| `src/components/Drawer/Drawer.native.tsx` | 투명 Modal + scrim Pressable + 좌측 absolute 패널 + Animated 슬라이드 |
| `src/components/Drawer/Drawer.tsx` | web-side 파사드(`export ... from './Drawer.web'`) |
| `src/components/Drawer/index.ts` | 배럴 export(타입 + Drawer + 서브컴포넌트) |
| `src/components/index.ts` | Drawer 등록 |

## API

```ts
/** web/native 공통 컨테이너 props. */
export interface DrawerBaseProps {
  /** 표시 여부 (controlled). */
  open: boolean;
  /** scrim 클릭 / Esc / Android back 시 호출. */
  onClose: () => void;
  /** 패널 폭(px). 기본 320. 화면폭보다 크면 화면폭으로 클램프. */
  width?: number;
  /** scrim 클릭으로 닫을지. 기본 true. */
  closeOnScrimClick?: boolean;
  /** Esc(web) / Android back(native)로 닫을지. 기본 true. */
  closeOnEsc?: boolean;
  children?: ReactNode;
  testID?: string;
}
```

`width` 기본값 상수 `DEFAULT_WIDTH = 320`은 `Drawer.styles.ts`에 둔다.

서브컴포넌트(형제 오버레이와 동일 패밀리, 전부 선택적):
`Drawer.Header / Drawer.Title / Drawer.Description / Drawer.Body / Drawer.Footer`. 각 `DrawerSectionProps`(children, style, className) 공유. **Body는 스크롤 가능**(web: `overflow:auto`, native: `ScrollView` + `flexShrink:1`) — 긴 네비/리스트 대응.

## 렌더링 & 애니메이션

### web (`Drawer.web.tsx`)
- portal로 document.body에 렌더(BottomSheet.web과 동일 방식).
- 전체화면 scrim(`position:fixed; inset:0; background:SCRIM_COLOR`), `testID`가 있으면 scrim은 `${testID}-scrim`, 없으면 `drawer-scrim`.
- 좌측 고정 패널: `position:fixed; left:0; top:0; height:100%; width:{width}; maxWidth:100vw`.
- 진입 슬라이드: 패널 `transform: translateX(-100%)` → 마운트 후 `translateX(0)`, `transition: transform 200ms ease`. (cssifyWebStyles 사용 시 인라인 transition 적용.)
- 접근성: 패널에 `role="dialog"`, `aria-modal="true"`, `aria-labelledby`(Title 있을 때), `aria-describedby`(Description 있을 때). `DrawerContext`로 Title/Description 마운트 등록 — BottomSheet/Dialog 패턴 그대로.
- Esc: `closeOnEsc`이면 keydown Esc에 `onClose`.

### native (`Drawer.native.tsx`)
- 투명 `Modal`(`transparent`, `visible={open}`, `animationType="none"`, `onRequestClose`=Android back → `closeOnEsc`이면 `onClose`).
- scrim: 전체화면 `Pressable`(`SCRIM_COLOR`), `closeOnScrimClick`이면 press에 `onClose`. testID `${testID}-scrim` 또는 `drawer-scrim`.
- 패널: `position:absolute; left:0; top:0; bottom:0; width`(화면폭 클램프).
- 진입 슬라이드: `Animated.Value`로 `translateX: -width → 0`, `open` 변화 시 `Animated.timing`(~200ms). 닫힐 때는 단순화를 위해 Modal visible=false로 언마운트(역슬라이드 아웃은 비목표).
- aria 미사용(native).

### 테마
`useResolvedColors()` + `useMemo(() => getDrawerStyles(colors), [colors])`. 표면 배경 `c.card`, 타이틀 `c.textPrimary`, 설명 `c.textSecondary` 등 — BottomSheet.styles와 동일 토큰. 다크모드 1일차 대응. `SCRIM_COLOR`는 `BottomSheet.styles`에서 import 재사용(중복 정의 회피).

## 동작 요약

| 트리거 | 조건 | 결과 |
|---|---|---|
| scrim 탭/클릭 | `closeOnScrimClick !== false` | `onClose()` |
| Esc(web) | `closeOnEsc !== false` | `onClose()` |
| Android back(native) | `closeOnEsc !== false` | `onClose()` |
| 패널 내부 탭 | — | 전파 안 됨(닫힘 없음) |

## 테스트

**web** (`Drawer.web.test.tsx`, jsdom — BottomSheet.web.test 패턴 미러):
- `open={false}`면 콘텐츠 미렌더, `open`이면 렌더.
- scrim 클릭 → `onClose` 호출.
- `closeOnScrimClick={false}` → scrim 클릭해도 미호출.
- Esc keydown → `onClose`; `closeOnEsc={false}` → 미호출.
- `width` 지정 시 패널 width 스타일 반영.
- 다크 표면: `ThemeProvider dark`에서 패널 배경 `darkColors.card`.
- 서브컴포넌트(Header/Title/Description/Body/Footer) 렌더 + 텍스트 노출.

**native** (`Drawer.native.test.tsx`, react-native preset):
- open/closed 조건부 렌더.
- scrim press → `onClose`; `closeOnScrimClick={false}` → 미호출.
- Android back(`Modal.onRequestClose`) → `onClose`; `closeOnEsc={false}` → 미호출.
- 다크 표면 토큰(`StyleSheet.flatten` + dark ThemeProvider).
- 서브컴포넌트 렌더.

스토리는 시각 산출물로 테스트 없음.

## 스토리

- **web** (`Drawer.web.stories.tsx`): `useState`+트리거 Button. Default(Header + 스크롤 네비 리스트 Body + Footer), CustomWidth(`width={420}`).
- **native** (`Drawer.native.stories.tsx`): 동일 의도, RN 레이아웃.

## 검증

- `pnpm test`(web+native) 그린, `pnpm typecheck` PASS, `pnpm build` PASS.
- CI lint(`eslint "src/components/**/!(*.stories).tsx"`)에 신규 소스·테스트 포함 — prettier-clean 유지.
