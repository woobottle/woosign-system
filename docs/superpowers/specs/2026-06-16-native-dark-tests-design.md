# 나머지 컴포넌트 native 다크 테스트 설계

**날짜:** 2026-06-16
**범위:** native 테스트가 없는 15개 테마-소비 컴포넌트에 native 단위 테스트(`X.native.test.tsx`)를 추가한다. 각 파일은 라이트 스모크 렌더 1건 + 다크 토큰 단언 1건(Switch 예외).

## 목표

native에서 테마 색을 소비하는 19개 중 4개(BottomSheet/Dialog/Input/Drawer)만 native 다크 테스트를 보유한다. 나머지 15개(Badge, Button, Card, Chip, Divider, Eyebrow, Fab, FeatureBand, Pill, Progress, StatusDot, Switch, Tabs, Text, Toast)는 native 테스트 파일이 전무하다. 공유 스타일 팩토리(`getXStyles(colors)`)는 web 다크 테스트로 검증되므로, native 갭은 **`.native.tsx`가 `useResolvedColors()` + 팩토리를 올바르게 배선했는가**다. 이를 컴포넌트당 다크 토큰 단언으로 닫고, native 테스트 부재 컴포넌트에 스모크 렌더로 기본 보증을 더한다.

## 비목표 (YAGNI)

- 소스/구현 변경 (impl에 testID 추가 금지 — 이미 testID prop을 받는 컴포넌트만 활용, 없으면 `UNSAFE_*` 쿼리).
- Animated 보간값 단언 (Switch track 등).
- variant/tone 매트릭스 (web 테스트와 중복).
- web 테스트 추가/변경.

## 테스트 패턴 (기존 미러)

`src/components/Input/Input.native.test.tsx`, `src/components/BottomSheet/BottomSheet.native.test.tsx` 패턴:

- 라이트 스모크: 최소 props로 `render(...)` → 핵심 노드 존재 단언(`getByText`/`getByTestId`로 크래시 없이 렌더 확인).
- 다크 토큰: `<ThemeProvider defaultColorScheme="dark">`로 감싸 렌더 → 테마 노드 조회 → `StyleSheet.flatten(node.props.style)`(Pressable은 style 배열이라 flatten이 배열도 병합) → `backgroundColor`/`color`/`borderColor`가 `darkColors.<key>`와 일치.
- 조회: 컴포넌트가 `testID` prop을 테마 노드에 붙이면 `screen.getByTestId(...)`. 아니면 `screen.UNSAFE_getAllByType(...)[idx]`.
- import: `import {colors, darkColors} from '../../core/theme/tokens';` (라이트 비교가 필요하면 colors도).

**중요:** 아래 토큰 키는 설문 기준 추정이다. 구현 시 각 `X.styles.ts`의 `getXStyles`/팩토리에서 **실제 키를 확인**하고 단언을 그에 맞춘다(키가 다르면 styles 파일 기준으로 수정). typecheck/실행으로 검증된다.

## 컴포넌트별 명세

| 컴포넌트 | 최소 props | 테마 속성 = 토큰 | 조회 |
|---|---|---|---|
| Badge | `children` | `backgroundColor` = actionPrimary | `getByTestId` |
| Button | `children` | `backgroundColor` = actionPrimary | `getByTestId`(Pressable, flatten) |
| Card | `children`(onPress 생략→View) | `backgroundColor` = card | `getByTestId` |
| Chip | `children` | `backgroundColor` = card | `getByTestId`(flatten) |
| Divider | 없음 | `backgroundColor` = borderDefault | `getByTestId` |
| Eyebrow | `children` | `color` = textSecondary | `getByTestId`(Text) |
| Fab | `accessibilityLabel`, `children` | `backgroundColor` = actionPrimary | `getByTestId`(flatten) |
| FeatureBand | `children` | `backgroundColor` = inverse | `getByTestId` |
| Pill | `children`(active=false) | `backgroundColor` = card | `getByTestId`(flatten) |
| Progress | `value` | fill `backgroundColor` = gold (정적) | `UNSAFE_getAllByType(View)[1]` |
| StatusDot | `children`(글리프) | `backgroundColor` = section | `getByTestId` |
| Tabs | `items`/`value`/`onChange` | active 탭 `borderBottomColor` = textBrand | `UNSAFE_getAllByType(Pressable)[0]` |
| Text | `children` | `color` = foreground | `getByTestId` |
| Toast | `title` | `backgroundColor` = card | `getByTestId` |

각 위 14개: 스모크 렌더 + 다크 토큰 단언 2건.

### 예외 — Switch (스모크 렌더만)

Switch.native의 track 색은 `animatedValue.interpolate({outputRange:[trackColors.unchecked, trackColors.checked]})`로 만든 `AnimatedInterpolation` 객체를 `backgroundColor`에 바인딩한다. `StyleSheet.flatten`이 문자열로 환원하지 못해 `=== darkColors.<key>` 단언이 불가능하다. 따라서 **Switch는 스모크 렌더 1건만** 작성하고, 다크 배선은 (a) web Switch 다크 테스트와 (b) 공유 `getTrackColors(colors)` 팩토리(web에서 검증됨)로 커버됨을 테스트 파일 상단 주석에 명시한다. (silent skip 아님 — 명시적 문서화.)

## 총량

14개 × 2 + Switch 1 = **29 테스트**, 15개 신규 파일.

## 조회 주의

- Pressable 기반(Button/Chip/Fab/Pill)은 `style`이 `[base, variant, ...]` 배열 → `StyleSheet.flatten`이 배열을 병합하므로 그대로 사용 가능(인덱싱 불필요).
- Progress는 outer rail View + inner fill View 2개 → fill은 `[1]`. fill 색은 정적(width만 동적).
- Tabs는 컨테이너 투명, 색은 active 탭 밑줄 → 첫 항목을 `value`로 줘 `[0]`이 active가 되게 한다.

## 검증

- `pnpm jest --selectProjects native` — 그린(기존 + 신규 29).
- `pnpm typecheck` — PASS.
- 소스 변경 0 — 순수 테스트 추가. CI-스코프 lint(*.test 포함) prettier-clean.

## 파일 구조

```
src/components/{Badge,Button,Card,Chip,Divider,Eyebrow,Fab,FeatureBand,Pill,Progress,StatusDot,Switch,Tabs,Text,Toast}/<Name>.native.test.tsx  (신규 15)
```

기존 파일 수정 없음.
