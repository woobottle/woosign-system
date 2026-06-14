# 다크모드 컴포넌트 배선 설계 (라운드 1)

> @woosign/ui — 이미 완성된 다크모드 인프라(ThemeProvider/darkColors/useColors)를
> 컴포넌트가 실제로 소비하도록 배선한다. 라운드 1은 메커니즘 확립 + 플래그십 5개
> 전환 + Storybook 다크 토글. 나머지 13개는 동일 패턴으로 후속 라운드.

## 배경 / 문제

스타일이 **모듈 로드 시점에 정적 `colors`로 한 번 계산**된다
(`X.styles.ts`의 `createVariants({... colors.card ...})`). 따라서 `ThemeProvider`로
감싸 `darkColors`로 바꿔도 컴포넌트는 light 색에 고정된다. 인프라
(`ThemeProvider`, `darkColors`, `useColors`)는 존재하나 **어떤 컴포넌트도 소비하지
않아 죽은 코드** 상태다.

## 목표

색을 쓰는 스타일을 "colors를 받는 팩토리"로 바꾸고, 컴포넌트가 렌더 시
`useResolvedColors()`로 현재 테마 색을 읽어 스타일을 만들게 한다. 플래그십 5개
(Card, Button, Badge, Text, Input)를 전환하고, Storybook 다크 토글로 즉시 확인
가능하게 한다.

## 비목표 (이번 범위 제외)

- 나머지 13개 컴포넌트 전환(BottomSheet/Chip/Dialog/Divider/Eyebrow/Fab/
  FeatureBand/Pill/Progress/StatusDot/Switch/Tabs/Toast) — 후속 라운드(동일 패턴).
- 네이티브 다크 **테스트** — 네이티브 배선 코드는 동일 적용하되 단위 테스트는 web
  검증에 집중(후속). (web 테스트로 메커니즘이 증명되면 native는 동형.)
- OS 색 구성 자동 감지(`Appearance`/`prefers-color-scheme`) — Provider의
  `defaultColorScheme`/`setColorScheme`만 사용.
- 다크 전용 그림자/이미지 에셋 교체.

## 하위 호환 (필수 전제)

기존 사용처는 `ThemeProvider` 없이 컴포넌트를 쓰며 정적 light `colors`를 본다.
현재 `useColors()`는 Provider 없으면 throw하므로, 컴포넌트가 이를 그대로 쓰면 모든
기존 사용처가 깨진다. 따라서 **Provider 없으면 정적 light `colors`로 폴백**하는
비-throwing 접근자를 추가하고 컴포넌트는 이것을 쓴다. 결과: Provider 없음 = 지금과
100% 동일(light), Provider로 감쌈 = 테마 반응.

## 메커니즘

### 1. `useResolvedColors()` (신규)

`src/core/hooks/useTheme.ts`에 추가(기존 `useColors`(throw 버전)는 보존):

```ts
import {useContext} from 'react';
import {ThemeContext} from '../theme/ThemeContext';
import {colors as lightColors} from '../theme/tokens';
import type {Colors} from '../theme/types';

/**
 * 컴포넌트용 색 접근자. ThemeProvider가 있으면 현재 테마 색(light/dark)을,
 * 없으면 정적 light colors로 폴백한다(throw하지 않음 — 기존 무-Provider 사용처
 * 하위 호환). 컴포넌트 스타일은 이 hook이 반환한 colors로 만든다.
 */
export function useResolvedColors(): Colors {
  const ctx = useContext(ThemeContext);
  return ctx ? ctx.theme.colors : lightColors;
}
```

`hooks/index.ts`가 `export * from './useTheme'`이므로 자동으로 패키지 루트까지
노출된다. `ThemeProvider`는 이미 `export * from './core'` 경로로 노출됨(확인:
`src/core/index.ts` → `export * from './theme'`; 미노출이면 theme 배럴에 추가).

### 2. 스타일 팩토리화 (플래그십 5개)

각 플래그십 `X.styles.ts`에서 **색에 의존하는 export만** `get<Name>(colors: Colors)`
팩토리로 바꾼다. 색 무관 export(spacing/typography/opacity/transform만 쓰는 것)는
정적 그대로 둔다.

예 — Card.styles.ts:
```ts
// 색 의존 → 팩토리
export const getCardVariants = (c: Colors) => createVariants({
  base: {borderRadius: borderRadius.md, backgroundColor: c.card},
  variants: {variant: {
    default: {backgroundColor: c.card, ...shadows.card},
    outline: {backgroundColor: 'transparent', borderWidth: 1, borderColor: c.borderDefault},
    /* ... c.reward, c.section, c.inverse, c.actionForest ... */
  }},
  defaultVariants: {variant: 'default'},
});
export const getCardTitleStyle = (c: Colors) => ({ /* ...color: c.textBrand */ });
export const getCardDescriptionStyle = (c: Colors) => ({ /* ...color: c.textSecondary */ });

// 색 무관 → 정적 유지
export const cardHeaderStyle = {/* spacing only */};
export const cardContentStyle = {/* spacing only */};
export const cardFooterStyle = {/* spacing only */};
export const hoverStyle = {opacity: 0.95};
export const pressedStyle = {transform: [{scale: 0.99}]};
export const disabledStyle = {opacity: 0.5};
```

`Colors`는 `src/core/theme/types`에서 import. 팩토리 본문은 기존 정적 정의에서
`colors.` → `c.`로 치환한 것과 동일(로직 변경 없음).

### 3. 컴포넌트 배선 (web + native 둘 다)

각 플래그십 `X.web.tsx` / `X.native.tsx`:
```ts
import {useResolvedColors} from '../../core/hooks';
import {getCardVariants, getCardTitleStyle, /* ... */ cardHeaderStyle} from './Card.styles';
// ...
const colors = useResolvedColors();
const cardVariants = useMemo(() => getCardVariants(colors), [colors]);
const cardTitleStyle = useMemo(() => getCardTitleStyle(colors), [colors]);
```
색 무관 정적 스타일은 그대로 import해 쓴다. `useMemo` 의존성은 `[colors]`
(ThemeContext의 theme.colors는 colorScheme 바뀔 때만 새 참조라 안정적).

## Storybook 다크 토글

`.storybook/preview.tsx`는 이미 `<ThemeProvider>`로 스토리를 감싼다. 추가:
- `globalTypes`에 `colorScheme` 툴바 아이템(light/dark) 추가.
- 데코레이터에서 `context.globals.colorScheme`를 읽어
  `<ThemeProvider key={scheme} defaultColorScheme={scheme}>`로 전달.
  `key`로 remount해 토글 시 즉시 반영(ThemeProvider의 colorScheme은 내부 useState라
  prop 변경만으론 갱신 안 됨 → key remount 필요).
- 다크일 때 미리보기 배경도 어둡게(`parameters.backgrounds` 또는 데코레이터 래퍼
  배경을 `colors.background`로) — 데코레이터에서 `useResolvedColors()`로 배경 적용.

## 테스트 (web, jsdom)

플래그십별 기존 `X.web.test.tsx`에 다크 케이스를 추가(기존 테스트 무손상):

1. **다크 렌더**: 컴포넌트를 `<ThemeProvider defaultColorScheme="dark">`로 감싸 렌더
   → 대표 색이 `darkColors`의 값과 일치(`toHaveStyle`). 예: dark에서 Card default
   배경이 `darkColors.card`.
2. **light 폴백**: Provider 없이 렌더 → 기존 light 토큰 유지(`colors.card`) — 폴백
   회귀 방지. (기존 테스트가 이미 이걸 커버하면 별도 추가 불필요.)

`darkColors`/`colors`는 `../../core/theme/tokens`에서 import. 대표 색은 컴포넌트별로
가장 또렷한 토큰 1~2개만 검증(전 토큰 검증은 과함).

## 파일 영향 요약

```
src/core/hooks/useTheme.ts                  # MODIFY: useResolvedColors 추가
.storybook/preview.tsx                       # MODIFY: globalTypes 토글 + key remount
src/components/{Card,Button,Badge,Text,Input}/
  *.styles.ts                                # MODIFY: 색 의존 export → 팩토리
  *.web.tsx, *.native.tsx                     # MODIFY: useResolvedColors + useMemo
  *.web.test.tsx                              # MODIFY: 다크 케이스 추가
src/core/theme/index.ts (필요 시)            # MODIFY: ThemeProvider 미노출이면 export 추가
```

## 검증 (완료 기준)

- `pnpm test` — 플래그십 5개의 다크 테스트 포함 전체 그린(기존 테스트 무손상).
- `pnpm typecheck` 클린; `pnpm lint` 0 errors(스토리 제외, 테스트 포함 prettier 통과);
  `pnpm build` 성공.
- Provider 없는 기존 사용처는 light 그대로(폴백 테스트로 확인).
- `import {ThemeProvider, useResolvedColors} from 'woosign-system'`로 소비자가
  다크모드를 켤 수 있음(패키지 export 확인).
