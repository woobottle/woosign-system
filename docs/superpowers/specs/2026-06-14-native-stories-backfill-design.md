# 네이티브 스토리 백필 설계

**날짜:** 2026-06-14
**범위:** 14개 컴포넌트에 `@storybook/react-native` 스토리(`X.native.stories.tsx`) 신규 추가 — 핵심 쇼케이스.

## 목표

웹 스토리는 20개 컴포넌트 전부 보유하나, 네이티브 스토리는 5개(Badge/Box/Button/Switch/Text)만 존재한다. 나머지 14개에 네이티브 스토리를 백필해 RN Storybook에서도 전 컴포넌트를 시연·문서화한다.

## 비목표 (YAGNI)

- 웹 스토리 전량 1:1 복제 — **핵심 쇼케이스(Default + 주요 variant 1~3개)** 만 미러.
- 컴포넌트 구현/로직 변경, 새 prop 추가.
- 스토리에 대한 자동화 테스트 — 스토리는 시각 산출물이며 `tsc`로 타입만 검증.
- date picker, SVG 아이콘 등 웹 전용 시연의 RN 정밀 재현 — RN 친화 대체(이모지 글리프 등)로 충분.

## 대상 컴포넌트 (14)

전부 `.native.tsx` 구현 보유(네이티브 스토리 작성 가능). Stateful 여부와 핵심 variant:

| 컴포넌트 | Stateful | 핵심 variant / prop |
|---|---|---|
| BottomSheet | open/close | `dragToClose`, `closeOnScrimClick` |
| Card | — | `variant`(7), `fullWidth`, `disabled`, `onPress` |
| Chip | — | `tone`(default/solid/outline), `disabled` |
| Dialog | open/close | `size`(sm/md/lg) |
| Divider | — | `tone`(default/inverse), `orientation` |
| Eyebrow | — | `tone`(default/brand/gold/inverse) |
| Fab | — | `tone`(ember/ink/gold), `size`(default/lg), `accessibilityLabel`(필수) |
| FeatureBand | — | `tone`(inverse/ember/reward/forest) |
| Input | — | `variant`(default/error), `size`(sm/default/lg), `type`, `multiline` |
| Pill | — | `active`, `disabled` |
| Progress | — | `value`(필수), `tone`(gold/ember/ink), `surface`(light/inverse), `size` |
| StatusDot | — | `tone`(success/danger/brand/neutral), `size` |
| Tabs | — | `items`/`value`/`onChange`(필수), `inverse` |
| Toast | — | `tone`(success/danger/brand/neutral), `description`, `glyph` |

## 규약 (기존 5개 네이티브 스토리와 동일)

```tsx
import type {Meta, StoryObj} from '@storybook/react-native';
import React, {useState} from 'react'; // useState는 stateful/controlled에만
import {X} from './X';
import {Box} from '../Box';
import {Text} from '../Text';

const meta: Meta<typeof X> = {
  title: 'Components/X',
  component: X,
  tags: ['autodocs'],
  argTypes: { /* control:'select'/'boolean'/'text' + options */ },
  args: { /* 기본값 */ },
};
export default meta;
type Story = StoryObj<typeof X>;

export const Default: Story = { args: {...} };
// 주요 variant 1~3개: args 기반이면 args, 복합 레이아웃이면 render
```

규칙:
- `title`은 `'Components/X'`, 항상 `tags: ['autodocs']`.
- 컴포넌트당 **Default + 주요 variant 1~3개** (총 2~4 스토리). variant 다수 보유 시 `AllVariants`/`AllTones` 같은 `render` 스토리 1개로 묶어도 됨.
- 레이아웃은 `Box`/`Text`로만 구성(웹 `div`/`<p>` 금지). 콜백은 `onPress`/`onChangeText`.
- 변형 목록 매핑 시 web 스토리처럼 `const tones: XTone[] = [...]` + `.map` 패턴 사용.

### 컴포넌트별 처리 노트

- **Stateful(BottomSheet, Dialog):** web과 동일하게 `useState(open)` + 트리거 `Button`(`onPress={() => setOpen(true)}`)로 여는 `render` 데모. 별도 named 컴포넌트(`const XDemo = () => {...}`)로 분리해 hook 규칙 준수(Switch.native의 `ControlledDemo` 패턴).
- **Controlled(Pill `CategoryFilter`, Input, Tabs):** `useState`로 값 보유하는 `render` 데모. Tabs는 `items`/`value`/`onChange` 필수 → `XDemo` 컴포넌트로.
- **Fab:** `accessibilityLabel` 필수 전달. 아이콘은 SVG 대신 `<Text>＋</Text>` 등 글리프.
- **Input `type='date'`:** 네이티브에 date picker 없음 → 해당 스토리 생략(핵심 쇼케이스 범위 밖).
- **Toast:** presentational 스토리(tone별). `ToastProvider`/`useToast` 임퍼러티브 데모는 범위 밖(웹 `DialogProvider.web.stories`처럼 별도 작업으로 보류).
- **inverse/dark surface(Divider, Progress, Tabs, FeatureBand):** 어두운 배경 시연은 `Box backgroundColor="#171513"` 래퍼로 web 의도 미러.

## 검증

- `pnpm typecheck` — tsc가 `src/**`(네이티브 스토리 포함) 타입 검증. 모든 스토리는 컴파일 통과해야 함.
- `pnpm build` — 스토리는 빌드/tarball 제외(`*.stories` glob). 빌드 그린 확인.
- CI lint(`eslint "src/components/**/!(*.stories).tsx"`)는 스토리 제외 — lint 대상 아님. 단 prettier 일관성 위해 작성 시 포맷 준수.
- 런타임 RN 스토리북 실제 렌더는 본 작업 범위 밖(별도 디바이스/시뮬 필요).

## 파일 구조

각 컴포넌트 디렉터리에 신규 파일 1개:

```
src/components/BottomSheet/BottomSheet.native.stories.tsx
src/components/Card/Card.native.stories.tsx
src/components/Chip/Chip.native.stories.tsx
src/components/Dialog/Dialog.native.stories.tsx
src/components/Divider/Divider.native.stories.tsx
src/components/Eyebrow/Eyebrow.native.stories.tsx
src/components/Fab/Fab.native.stories.tsx
src/components/FeatureBand/FeatureBand.native.stories.tsx
src/components/Input/Input.native.stories.tsx
src/components/Pill/Pill.native.stories.tsx
src/components/Progress/Progress.native.stories.tsx
src/components/StatusDot/StatusDot.native.stories.tsx
src/components/Tabs/Tabs.native.stories.tsx
src/components/Toast/Toast.native.stories.tsx
```

기존 파일 수정 없음(순수 신규 추가). import는 컴포넌트 디렉터리 로컬(`./X`) + `../Box`/`../Text`.
