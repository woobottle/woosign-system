# 다크모드 컴포넌트 배선 Implementation Plan (라운드 1)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 플래그십 5개 컴포넌트(Card/Button/Badge/Text/Input)가 `ThemeProvider`의 light/dark 색을 실제로 소비하도록 배선하고, Storybook 다크 토글을 추가한다.

**Architecture:** 색 의존 스타일을 `colors`를 받는 팩토리 함수로 전환하고, 컴포넌트가 렌더 시 `useResolvedColors()`(Provider 없으면 정적 light 폴백)로 색을 읽어 `useMemo`로 스타일을 만든다. 정적 모듈-로드 시점 색 고정 → 렌더 시점 테마 반응으로 바꾸는 게 핵심.

**Tech Stack:** React(useContext/useMemo), `@testing-library/react` + jest(jsdom web), `@storybook/react` globalTypes/decorators.

**Spec:** `docs/superpowers/specs/2026-06-14-dark-mode-wiring-design.md`

검증된 사실:
- `Colors` 타입: `src/core/theme/types.ts`의 `export type Colors`.
- `ThemeProvider`는 `src/core/theme/index.ts`가 `export * from './ThemeContext'`로, 다시 `src/core/index.ts` → `src/index.ts`로 패키지 루트까지 노출됨(이미 public).
- `ThemeContext`도 `ThemeContext.tsx`에서 export됨(`export {ThemeContext}`).
- darkColors는 light의 모든 키를 가짐(파리티 완전).
- 다크 테스트용 **light≠dark 판별 토큰**(이게 깨지면 폴백/배선 버그를 잡음):
  - Card: `card` (light `#FFFFFF` / dark `ink[800]`)
  - Button: `card` via `secondary` variant (light `#FFFFFF` / dark `ink[800]`)
  - Badge: `borderDefault` via `outline` variant (light `blackAlpha[12]` / dark `whiteAlpha[10]`)
  - Text: `foreground` 기본 색 (light `blackAlpha[87]` / dark `#FFFFFF`)
  - Input: `card` 컨테이너 배경 (light `#FFFFFF` / dark `ink[800]`)

**전환 규칙 (모든 컴포넌트 태스크 공통):**
1. `X.styles.ts`에서 **색에 의존하는 export**를 `export const get<Name> = (c: Colors) => <원래 본문에서 colors. 를 c. 로 치환>` 팩토리로 바꾼다. 로직/구조 변경 없이 색 출처만 인자 `c`로. `import type {Colors} from '../../core/theme/types';` 추가. 색에 의존하지 않는 export(spacing/typography/opacity/transform만)는 정적 그대로 둔다.
2. `X.web.tsx`와 `X.native.tsx`: `import {useResolvedColors} from '../../core/hooks';` 추가, 컴포넌트 본문 상단에서 `const colors = useResolvedColors();`, 각 팩토리를 `const <name> = useMemo(() => get<Name>(colors), [colors]);`로 만들어 기존 정적 import 사용처를 대체한다. 정적(색무관) 스타일 import는 유지.
3. `X.web.test.tsx`에 다크 케이스 추가(기존 테스트 무손상).
4. 컴포넌트/스타일의 **로직은 바꾸지 않는다** — 색 출처만 정적→테마.

---

### Task 1: useResolvedColors hook (TDD)

**Files:**
- Modify: `src/core/hooks/useTheme.ts`
- Create: `src/core/hooks/useResolvedColors.web.test.tsx`

- [ ] **Step 1: 실패 테스트 작성** — `src/core/hooks/useResolvedColors.web.test.tsx`:

```tsx
/**
 * useResolvedColors(): Provider 있으면 테마 색, 없으면 정적 light 폴백.
 */
import {renderHook} from '@testing-library/react';
import React from 'react';
import {useResolvedColors} from './useTheme';
import {ThemeProvider} from '../theme/ThemeContext';
import {colors, darkColors} from '../theme/tokens';

describe('useResolvedColors', () => {
  it('falls back to static light colors when no ThemeProvider', () => {
    const {result} = renderHook(() => useResolvedColors());
    expect(result.current).toBe(colors);
  });

  it('returns light colors inside a light ThemeProvider', () => {
    const {result} = renderHook(() => useResolvedColors(), {
      wrapper: ({children}) => (
        <ThemeProvider defaultColorScheme="light">{children}</ThemeProvider>
      ),
    });
    expect(result.current.card).toBe(colors.card);
  });

  it('returns dark colors inside a dark ThemeProvider', () => {
    const {result} = renderHook(() => useResolvedColors(), {
      wrapper: ({children}) => (
        <ThemeProvider defaultColorScheme="dark">{children}</ThemeProvider>
      ),
    });
    expect(result.current.card).toBe(darkColors.card);
  });
});
```

- [ ] **Step 2: 실패 확인** — Run: `pnpm test -- --selectProjects web useResolvedColors.web.test`
Expected: FAIL — `useResolvedColors` is not exported.

- [ ] **Step 3: useResolvedColors 구현** — `src/core/hooks/useTheme.ts` 상단 import에 추가하고(파일 맨 위 import 블록), 함수를 추가:

```ts
import {useContext} from 'react';
import {ThemeContext} from '../theme/ThemeContext';
import {colors as lightColors} from '../theme/tokens';
import type {Colors} from '../theme/types';
```

(기존 `import {useThemeContext} ...`/`import type {Theme, ...}`은 유지. 위 4줄을 파일 상단에 추가.)

파일 끝에 함수 추가:

```ts
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

- [ ] **Step 4: 통과 확인 + typecheck** — Run: `pnpm test -- --selectProjects web useResolvedColors.web.test` (PASS 3). 그리고 `pnpm typecheck` (clean).

- [ ] **Step 5: 패키지 export 확인** — `useResolvedColors`가 패키지 루트로 노출되는지 확인: `src/core/hooks/index.ts`가 `export * from './useTheme'`인지 확인(맞으면 자동). `ThemeProvider` 노출도 확인(이미 노출). 누락 시에만 배럴에 추가.

- [ ] **Step 6: 커밋**

```bash
git add src/core/hooks/useTheme.ts src/core/hooks/useResolvedColors.web.test.tsx
git commit -m "feat(theme): add useResolvedColors (theme colors with light fallback)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Card 다크 배선

**Files:**
- Modify: `src/components/Card/Card.styles.ts`
- Modify: `src/components/Card/Card.web.tsx`, `src/components/Card/Card.native.tsx`
- Modify: `src/components/Card/Card.web.test.tsx`

색 의존 export(팩토리화): `cardVariants`→`getCardVariants`, `cardTitleStyle`→`getCardTitleStyle`(color `c.textBrand`), `cardDescriptionStyle`→`getCardDescriptionStyle`(color `c.textSecondary`). 색 무관(정적 유지): `cardHeaderStyle`, `cardContentStyle`, `cardFooterStyle`, `hoverStyle`, `pressedStyle`, `disabledStyle`.

- [ ] **Step 1: 다크 실패 테스트 추가** — `Card.web.test.tsx`의 describe 안에 추가(상단 import에 `ThemeProvider`, `darkColors` 추가: `import {ThemeProvider} from '../../core/theme/ThemeContext';` 그리고 기존 `colors` import를 `import {colors, darkColors} from '../../core/theme/tokens';`로):

```tsx
  it('uses dark surface token inside a dark ThemeProvider', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Card testID="card">
          <span>본문</span>
        </Card>
      </ThemeProvider>,
    );
    expect(screen.getByTestId('card')).toHaveStyle({
      backgroundColor: darkColors.card,
    });
  });
```

- [ ] **Step 2: 실패 확인** — Run: `pnpm test -- --selectProjects web Card.web.test`
Expected: FAIL — 현재 Card는 정적 light `colors.card`를 써서 dark에서도 `#FFFFFF` 렌더.

- [ ] **Step 3: Card.styles.ts 팩토리화** — 파일을 읽고 위 규칙대로 전환. `import type {Colors} from '../../core/theme/types';` 추가. 예(getCardVariants):

```ts
export const getCardVariants = (c: Colors) =>
  createVariants({
    base: {borderRadius: borderRadius.md, backgroundColor: c.card},
    variants: {
      variant: {
        default: {backgroundColor: c.card, ...shadows.card},
        outline: {backgroundColor: 'transparent', borderWidth: 1, borderColor: c.borderDefault},
        ghost: {backgroundColor: 'transparent'},
        warm: {backgroundColor: c.reward, ...shadows.card},
        ceramic: {backgroundColor: c.section},
        inverse: {backgroundColor: c.inverse, borderRadius: borderRadius.lg},
        forest: {backgroundColor: c.actionForest, borderRadius: borderRadius.lg},
      },
    },
    defaultVariants: {variant: 'default'},
  });

export const getCardTitleStyle = (c: Colors) => ({
  fontFamily: typography.fontFamily.sans,
  fontSize: typography.fontSize.headingMd.size,
  fontWeight: typography.fontWeight.semibold,
  lineHeight: typography.fontSize.headingMd.lineHeight,
  letterSpacing: typography.letterSpacing.tight,
  color: c.textBrand,
});

export const getCardDescriptionStyle = (c: Colors) => ({
  fontFamily: typography.fontFamily.sans,
  fontSize: typography.fontSize.bodySm.size,
  lineHeight: typography.fontSize.bodySm.lineHeight,
  letterSpacing: typography.letterSpacing.tight,
  color: c.textSecondary,
});
```

색 무관 export들(`cardHeaderStyle` 등)은 그대로 둔다. `colors` import는 더 이상 안 쓰이면 제거.

- [ ] **Step 4: Card.web.tsx / Card.native.tsx 배선** — 각 파일에서 `import {useResolvedColors} from '../../core/hooks';`, `import {useMemo} from 'react'`(이미 React import 있으면 useMemo만 추가), 그리고 `cardVariants`/`cardTitleStyle`/`cardDescriptionStyle` 정적 import를 `getCardVariants` 등 팩토리 import로 바꾸고 컴포넌트 본문에서:

```ts
const colors = useResolvedColors();
const cardVariants = useMemo(() => getCardVariants(colors), [colors]);
const cardTitleStyle = useMemo(() => getCardTitleStyle(colors), [colors]);
const cardDescriptionStyle = useMemo(() => getCardDescriptionStyle(colors), [colors]);
```

서브컴포넌트(CardTitle/CardDescription)가 별도 함수 컴포넌트라면 각자 `useResolvedColors()`+`useMemo`로 자기 스타일을 만든다(색 무관 헤더/콘텐츠/푸터는 정적 import 유지). 기존 사용 지점의 변수명을 그대로 유지해 본문 JSX는 최소 변경.

- [ ] **Step 5: 통과 확인** — Run: `pnpm test -- --selectProjects web Card.web.test` (PASS, 기존 + 다크 1). `pnpm typecheck` clean.

- [ ] **Step 6: 커밋**

```bash
git add src/components/Card/
git commit -m "feat(Card): consume theme colors via useResolvedColors (dark mode)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Button 다크 배선

**Files:**
- Modify: `src/components/Button/Button.styles.ts`
- Modify: `src/components/Button/Button.web.tsx`, `src/components/Button/Button.native.tsx`
- Modify: `src/components/Button/Button.web.test.tsx`

색 의존 export(팩토리화): `buttonVariants`→`getButtonVariants`, `buttonTextVariants`→`getButtonTextVariants`, `hoverStyles`→`getHoverStyles`. 색 무관 export(정적 유지): 나머지(예: pressed/disabled/size-only가 있으면 — 파일을 읽어 색 토큰(`colors.`)을 참조하지 않는 것은 정적으로 둔다).

- [ ] **Step 1: 다크 실패 테스트 추가** — `Button.web.test.tsx` 상단 import에 `import {ThemeProvider} from '../../core/theme/ThemeContext';`, 기존 토큰 import를 `import {colors, borderRadius, darkColors} from '../../core/theme/tokens';`로. describe 안에 추가:

```tsx
  it('uses the dark card surface for the secondary variant in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Button variant="secondary">See benefits</Button>
      </ThemeProvider>,
    );
    expect(screen.getByRole('button')).toHaveStyle({
      backgroundColor: darkColors.card,
    });
  });
```

(light에서 secondary 배경은 `colors.card`=`#FFFFFF`, dark에서는 `darkColors.card`=`ink[800]`이라 판별력이 있다.)

- [ ] **Step 2: 실패 확인** — Run: `pnpm test -- --selectProjects web Button.web.test`
Expected: FAIL — 정적 light라 dark에서도 `#FFFFFF`.

- [ ] **Step 3: Button.styles.ts 팩토리화** — 파일을 읽고 `getButtonVariants(c)`, `getButtonTextVariants(c)`, `getHoverStyles(c)`로 전환(본문의 `colors.`→`c.`). `import type {Colors} from '../../core/theme/types';` 추가. 색 무관 export는 정적 유지. 미사용 시 `colors` import 제거.

- [ ] **Step 4: Button.web.tsx / Button.native.tsx 배선** — `useResolvedColors` + `useMemo`로 `buttonVariants`/`buttonTextVariants`/`hoverStyles`를 만든다(변수명 유지). 패턴은 Task 2 Step 4와 동일.

- [ ] **Step 5: 통과 확인** — Run: `pnpm test -- --selectProjects web Button.web.test` (PASS). `pnpm typecheck` clean.

- [ ] **Step 6: 커밋**

```bash
git add src/components/Button/
git commit -m "feat(Button): consume theme colors via useResolvedColors (dark mode)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Badge 다크 배선

**Files:**
- Modify: `src/components/Badge/Badge.styles.ts`
- Modify: `src/components/Badge/Badge.web.tsx`, `src/components/Badge/Badge.native.tsx`
- Modify: `src/components/Badge/Badge.web.test.tsx`

색 의존 export(팩토리화): `badgeVariants`→`getBadgeVariants`, `badgeTextVariants`→`getBadgeTextVariants`, `hoverStyles`→`getHoverStyles`. 색 무관은 정적 유지.

- [ ] **Step 1: 다크 실패 테스트 추가** — `Badge.web.test.tsx` 상단 import에 `import {ThemeProvider} from '../../core/theme/ThemeContext';`, 기존 `import {colors} ...`를 `import {colors, darkColors} from '../../core/theme/tokens';`로. describe 안에 추가:

```tsx
  it('uses the dark default border for the outline variant in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Badge variant="outline">Beta</Badge>
      </ThemeProvider>,
    );
    expect(screen.getByText('Beta')).toHaveStyle({
      borderColor: darkColors.borderDefault,
    });
  });
```

(light outline 보더 `colors.borderDefault`=`blackAlpha[12]`, dark `whiteAlpha[10]` — 판별력 있음. 기존 light 테스트가 이미 outline 보더를 light로 검증.)

- [ ] **Step 2: 실패 확인** — Run: `pnpm test -- --selectProjects web Badge.web.test`
Expected: FAIL.

- [ ] **Step 3: Badge.styles.ts 팩토리화** — `getBadgeVariants(c)`, `getBadgeTextVariants(c)`, `getHoverStyles(c)`. `import type {Colors}` 추가. 색 무관 정적 유지. 미사용 `colors` 제거.

- [ ] **Step 4: Badge.web.tsx / Badge.native.tsx 배선** — `useResolvedColors` + `useMemo` (Task 2 패턴).

- [ ] **Step 5: 통과 확인** — `pnpm test -- --selectProjects web Badge.web.test` (PASS). `pnpm typecheck` clean.

- [ ] **Step 6: 커밋**

```bash
git add src/components/Badge/
git commit -m "feat(Badge): consume theme colors via useResolvedColors (dark mode)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Text 다크 배선

**Files:**
- Modify: `src/components/Text/Text.styles.ts`
- Modify: `src/components/Text/Text.web.tsx`, `src/components/Text/Text.native.tsx`
- Create: `src/components/Text/Text.web.test.tsx` (Text는 기존 web 테스트가 없음 — 신규)

색 의존 export(팩토리화): `textVariants`→`getTextVariants`. 색 무관은 정적 유지.

- [ ] **Step 1: 다크/라이트 테스트 작성(신규 파일)** — `src/components/Text/Text.web.test.tsx`:

```tsx
/**
 * Web harness tests for Text — theme color consumption.
 */
import {render, screen} from '@testing-library/react';
import {Text} from './Text';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {colors, darkColors} from '../../core/theme/tokens';

describe('Text (web)', () => {
  it('renders its children', () => {
    render(<Text>안녕하세요</Text>);
    expect(screen.getByText('안녕하세요')).toBeInTheDocument();
  });

  it('uses the light foreground color without a provider', () => {
    render(<Text>밝게</Text>);
    expect(screen.getByText('밝게')).toHaveStyle({color: colors.foreground});
  });

  it('uses the dark foreground color inside a dark ThemeProvider', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Text>어둡게</Text>
      </ThemeProvider>,
    );
    expect(screen.getByText('어둡게')).toHaveStyle({color: darkColors.foreground});
  });
});
```

(light `foreground`=`blackAlpha[87]`, dark `#FFFFFF` — 판별력 있음. Text 기본 variant가 base color `foreground`를 쓰는지 Text.styles에서 확인; 다른 기본 색이면 그 토큰으로 맞춘다.)

- [ ] **Step 2: 실패 확인** — Run: `pnpm test -- --selectProjects web Text.web.test`
Expected: dark 케이스 FAIL(정적 light).

- [ ] **Step 3: Text.styles.ts 팩토리화** — `getTextVariants(c)`. `import type {Colors}` 추가. 미사용 `colors` 제거.

- [ ] **Step 4: Text.web.tsx / Text.native.tsx 배선** — `useResolvedColors` + `useMemo`로 `textVariants` 생성(변수명 유지).

- [ ] **Step 5: 통과 확인** — `pnpm test -- --selectProjects web Text.web.test` (PASS 3). `pnpm typecheck` clean.

- [ ] **Step 6: 커밋**

```bash
git add src/components/Text/
git commit -m "feat(Text): consume theme colors via useResolvedColors (dark mode) + web tests

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Input 다크 배선

**Files:**
- Modify: `src/components/Input/Input.styles.ts`
- Modify: `src/components/Input/Input.web.tsx`, `src/components/Input/Input.native.tsx`
- Modify: `src/components/Input/Input.web.test.tsx`

색 의존 export(팩토리화): `inputContainerVariants`→`getInputContainerVariants`, `inputTextVariants`→`getInputTextVariants`, `placeholderColor`(= `colors.textTertiary` 값)→`getPlaceholderColor = (c) => c.textTertiary`, `focusContainerStyle`→`getFocusContainerStyle`(borderColor `c.borderFocus`), `disabledStyle`→`getDisabledStyle`(bg `c.section`). 색 무관(정적 유지): `iconContainerStyle` 등.

주의: `placeholderColor`/`focusContainerStyle`/`disabledStyle`는 값/객체이므로 팩토리로 바뀌면 컴포넌트에서 `useMemo`로 만들어 쓴다. Calendar.web 등 다른 파일이 이 export를 import하면 그쪽도 팩토리 호출로 맞춘다(있으면).

- [ ] **Step 1: 다크 실패 테스트 추가** — `Input.web.test.tsx` 상단 import에 `import {ThemeProvider} from '../../core/theme/ThemeContext';`, 기존 `import {colors} ...`를 `import {colors, darkColors} from '../../core/theme/tokens';`로. describe 안에 추가:

```tsx
  it('uses the dark card surface on the container in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Input testID="name" />
      </ThemeProvider>,
    );
    const container = screen.getByTestId('name').parentElement as HTMLElement;
    expect(container).toHaveStyle({backgroundColor: darkColors.card});
  });
```

(light 컨테이너 배경 `colors.card`=`#FFFFFF`, dark `ink[800]` — 판별력 있음.)

- [ ] **Step 2: 실패 확인** — Run: `pnpm test -- --selectProjects web Input.web.test`
Expected: FAIL.

- [ ] **Step 3: Input.styles.ts 팩토리화** — 위 export들을 `get...` 팩토리로. `placeholderColor`는 `getPlaceholderColor = (c: Colors) => c.textTertiary`. `import type {Colors}` 추가. 색 무관 정적 유지. 미사용 `colors` 제거. `Calendar.web.tsx`가 이 styles의 색 export를 쓰는지 grep으로 확인하고, 쓰면 그쪽도 `useResolvedColors`+팩토리로 맞춘다.

- [ ] **Step 4: Input.web.tsx / Input.native.tsx 배선** — `useResolvedColors` + `useMemo`로 `inputContainerVariants`/`inputTextVariants`/`placeholderColor`/`focusContainerStyle`/`disabledStyle` 생성(변수명 유지).

- [ ] **Step 5: 통과 확인** — `pnpm test -- --selectProjects web Input.web.test` (PASS). `pnpm typecheck` clean.

- [ ] **Step 6: 커밋**

```bash
git add src/components/Input/
git commit -m "feat(Input): consume theme colors via useResolvedColors (dark mode)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: Storybook 다크 토글 + 전체 검증

**Files:**
- Modify: `.storybook/preview.tsx`

- [ ] **Step 1: preview.tsx에 다크 토글 추가** — `.storybook/preview.tsx`를 아래로 교체(기존 데코레이터 래퍼/parameters 유지, globalTypes + global 읽는 데코레이터 추가). `ThemeProvider`에 `key`/`defaultColorScheme`를 globals에서 전달해 토글 시 remount:

```tsx
import type {Preview} from '@storybook/react';
import React from 'react';
import {ThemeProvider} from '../src/core/theme/ThemeContext';
import {useResolvedColors} from '../src/core/hooks';

function StoryFrame({children}: {children: React.ReactNode}) {
  const colors = useResolvedColors();
  return (
    <div
      style={{
        padding: 24,
        alignSelf: 'flex-start',
        display: 'block',
        backgroundColor: colors.background,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
      {children}
    </div>
  );
}

const preview: Preview = {
  globalTypes: {
    colorScheme: {
      description: 'Light / dark theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: [
          {value: 'light', title: 'Light'},
          {value: 'dark', title: 'Dark'},
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const scheme = context.globals.colorScheme as 'light' | 'dark';
      return (
        <ThemeProvider key={scheme} defaultColorScheme={scheme}>
          <StoryFrame>
            <Story />
          </StoryFrame>
        </ThemeProvider>
      );
    },
  ],
  parameters: {
    actions: {argTypesRegex: '^on[A-Z].*'},
    controls: {
      matchers: {color: /(background|color)$/i, date: /Date$/i},
    },
    backgrounds: {
      default: 'canvas',
      values: [
        {name: 'canvas', value: '#F4EFE6'},
        {name: 'section', value: '#EAE4D8'},
        {name: 'white', value: '#FFFFFF'},
        {name: 'inverse', value: '#171513'},
      ],
    },
  },
};

export default preview;
```

(`StoryFrame`이 `useResolvedColors()`로 배경을 테마에 맞춰 다크 시 어두운 캔버스가 된다. `ThemeProvider key={scheme}`로 토글 시 즉시 remount.)

- [ ] **Step 2: 전체 검증** — Run: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`
Expected: typecheck clean; lint 0 errors(스토리 제외, 테스트 포함 prettier 통과); web 프로젝트가 새 다크 테스트(useResolvedColors 3 + Card/Button/Badge/Input 각 1 + Text 3) 포함 전체 그린; build 성공. 기존 테스트 무손상.

lint에 prettier 에러가 나면 새로 만든/수정한 비-스토리 파일(특히 *.test, *.styles, *.tsx)에 `pnpm exec eslint --fix <files>` 적용 후 재검증.

- [ ] **Step 3: 커밋**

```bash
git add .storybook/preview.tsx
git commit -m "feat(storybook): add light/dark theme toolbar toggle

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
