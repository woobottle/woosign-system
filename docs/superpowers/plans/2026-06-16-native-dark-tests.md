# Native Dark Unit Tests Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add native (react-native preset jest) unit tests for the 15 theme-consuming components that currently have none — each gets a light-mode smoke render + a dark-mode themed-token assertion (Switch: smoke only).

**Architecture:** One new `X.native.test.tsx` per component. Each renders the `.native.tsx` impl, and under `<ThemeProvider defaultColorScheme="dark">` asserts the primary themed style property equals the `darkColors.<key>` token — verifying the native wiring of `useResolvedColors()` + the shared style factory (the factory itself is already web-tested). Pure test additions; no source changes.

**Tech Stack:** TypeScript, React Native, jest (native project = react-native preset, `*.native.test.tsx`), `@testing-library/react-native`, `StyleSheet.flatten`.

**Conventions:** The CI-scoped lint includes `*.test.tsx` — keep prettier-clean (2-space, single quotes, trailing commas); `pnpm eslint --fix <file>` if needed. These characterize existing correct code, so tests should pass on first run.

**Reference:** `src/components/Input/Input.native.test.tsx` and `src/components/BottomSheet/BottomSheet.native.test.tsx` (the exact pattern: `StyleSheet.flatten(node.props.style)` + `darkColors.card`). Tokens below were verified against each `X.styles.ts` factory.

**Global query note:** Each test passes a `testID` and queries `screen.getByTestId(...)`. If a component does NOT forward `testID` to its themed root node (the dark assertion then can't find the color), fall back to `screen.UNSAFE_getAllByType(View)[0]` (the first `View`/`Pressable` is the themed root) — import the type from `react-native`. `StyleSheet.flatten` merges style arrays, so Pressable's `[base, variant]` array flattens fine.

---

## File Structure

15 new files, one per component:

```
src/components/Badge/Badge.native.test.tsx
src/components/Button/Button.native.test.tsx
src/components/Card/Card.native.test.tsx
src/components/Chip/Chip.native.test.tsx
src/components/Divider/Divider.native.test.tsx
src/components/Eyebrow/Eyebrow.native.test.tsx
src/components/Fab/Fab.native.test.tsx
src/components/FeatureBand/FeatureBand.native.test.tsx
src/components/Pill/Pill.native.test.tsx
src/components/Progress/Progress.native.test.tsx
src/components/StatusDot/StatusDot.native.test.tsx
src/components/Switch/Switch.native.test.tsx
src/components/Tabs/Tabs.native.test.tsx
src/components/Text/Text.native.test.tsx
src/components/Toast/Toast.native.test.tsx
```

**Verified themed tokens** (default variant/tone, from `X.styles.ts`):

| Component | Themed property → `darkColors` key | Query |
|---|---|---|
| Badge | `backgroundColor` → `actionPrimary` | testID |
| Button | `backgroundColor` → `actionPrimary` | testID |
| Card | `backgroundColor` → `card` | testID |
| Chip | `backgroundColor` → `card` | testID |
| Divider | `backgroundColor` → `borderDefault` | testID |
| Eyebrow | `color` → `textSecondary` | testID |
| Fab | `backgroundColor` → `actionPrimary` | testID |
| FeatureBand | `backgroundColor` → `inverse` | testID |
| Pill | `backgroundColor` → `card` (inactive) | testID |
| Progress | fill `backgroundColor` → `gold` | `UNSAFE_getAllByType(View)[1]` |
| StatusDot | `backgroundColor` → `section` (tone neutral) | testID |
| Switch | — (smoke only) | — |
| Tabs | active `borderBottomColor` → `textBrand` | `UNSAFE_getAllByType(Pressable)[0]` |
| Text | `color` → `foreground` | testID |
| Toast | `backgroundColor` → `card` | testID |

---

## Task 1: All 15 native test files

Each test characterizes existing correct code → expected GREEN on first run. If a dark assertion fails, the rendered value reveals the right token: `console.log` the flattened property, find which `darkColors` key matches, and correct the assertion (or switch the query per the Global query note). Do not change source.

**Files:** the 15 listed above.

- [ ] **Step 1: Create `Badge.native.test.tsx`**

```tsx
/**
 * Native harness tests for Badge. 라이트 스모크 + 다크 테마 토큰 단언.
 */
import {StyleSheet} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {Badge} from './Badge.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Badge (native)', () => {
  it('renders its label (light smoke)', () => {
    render(<Badge testID="badge">라벨</Badge>);
    expect(screen.getByText('라벨')).toBeTruthy();
  });

  it('uses the dark actionPrimary background in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Badge testID="badge">라벨</Badge>
      </ThemeProvider>,
    );
    const flat = StyleSheet.flatten(screen.getByTestId('badge').props.style);
    expect(flat.backgroundColor).toBe(darkColors.actionPrimary);
  });
});
```

- [ ] **Step 2: Create `Button.native.test.tsx`**

```tsx
/**
 * Native harness tests for Button. 라이트 스모크 + 다크 테마 토큰 단언.
 */
import {StyleSheet} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {Button} from './Button.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Button (native)', () => {
  it('renders its label (light smoke)', () => {
    render(<Button testID="btn">눌러</Button>);
    expect(screen.getByText('눌러')).toBeTruthy();
  });

  it('uses the dark actionPrimary background in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Button testID="btn">눌러</Button>
      </ThemeProvider>,
    );
    const flat = StyleSheet.flatten(screen.getByTestId('btn').props.style);
    expect(flat.backgroundColor).toBe(darkColors.actionPrimary);
  });
});
```

- [ ] **Step 3: Create `Card.native.test.tsx`**

```tsx
/**
 * Native harness tests for Card. 라이트 스모크 + 다크 테마 토큰 단언.
 */
import {StyleSheet, Text} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {Card} from './Card.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Card (native)', () => {
  it('renders its children (light smoke)', () => {
    render(
      <Card testID="card">
        <Text>본문</Text>
      </Card>,
    );
    expect(screen.getByText('본문')).toBeTruthy();
  });

  it('uses the dark card surface in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Card testID="card">
          <Text>본문</Text>
        </Card>
      </ThemeProvider>,
    );
    const flat = StyleSheet.flatten(screen.getByTestId('card').props.style);
    expect(flat.backgroundColor).toBe(darkColors.card);
  });
});
```

- [ ] **Step 4: Create `Chip.native.test.tsx`**

```tsx
/**
 * Native harness tests for Chip. 라이트 스모크 + 다크 테마 토큰 단언.
 */
import {StyleSheet} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {Chip} from './Chip.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Chip (native)', () => {
  it('renders its label (light smoke)', () => {
    render(<Chip testID="chip">칩</Chip>);
    expect(screen.getByText('칩')).toBeTruthy();
  });

  it('uses the dark card surface (default tone) in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Chip testID="chip">칩</Chip>
      </ThemeProvider>,
    );
    const flat = StyleSheet.flatten(screen.getByTestId('chip').props.style);
    expect(flat.backgroundColor).toBe(darkColors.card);
  });
});
```

- [ ] **Step 5: Create `Divider.native.test.tsx`**

```tsx
/**
 * Native harness tests for Divider. 라이트 스모크 + 다크 테마 토큰 단언.
 */
import {StyleSheet} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {Divider} from './Divider.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Divider (native)', () => {
  it('renders (light smoke)', () => {
    render(<Divider testID="div" />);
    expect(screen.getByTestId('div')).toBeTruthy();
  });

  it('uses the dark borderDefault color (default tone) in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Divider testID="div" />
      </ThemeProvider>,
    );
    const flat = StyleSheet.flatten(screen.getByTestId('div').props.style);
    expect(flat.backgroundColor).toBe(darkColors.borderDefault);
  });
});
```

- [ ] **Step 6: Create `Eyebrow.native.test.tsx`**

```tsx
/**
 * Native harness tests for Eyebrow. 라이트 스모크 + 다크 테마 토큰 단언.
 */
import {StyleSheet} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {Eyebrow} from './Eyebrow.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Eyebrow (native)', () => {
  it('renders its text (light smoke)', () => {
    render(<Eyebrow testID="eb">THIS WEEK</Eyebrow>);
    expect(screen.getByText('THIS WEEK')).toBeTruthy();
  });

  it('uses the dark textSecondary color (default tone) in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Eyebrow testID="eb">THIS WEEK</Eyebrow>
      </ThemeProvider>,
    );
    const flat = StyleSheet.flatten(screen.getByTestId('eb').props.style);
    expect(flat.color).toBe(darkColors.textSecondary);
  });
});
```

- [ ] **Step 7: Create `Fab.native.test.tsx`**

```tsx
/**
 * Native harness tests for Fab. 라이트 스모크 + 다크 테마 토큰 단언.
 */
import {StyleSheet, Text} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {Fab} from './Fab.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Fab (native)', () => {
  it('renders its child glyph (light smoke)', () => {
    render(
      <Fab testID="fab" accessibilityLabel="추가">
        <Text>＋</Text>
      </Fab>,
    );
    expect(screen.getByText('＋')).toBeTruthy();
  });

  it('uses the dark actionPrimary background (ember tone) in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Fab testID="fab" accessibilityLabel="추가">
          <Text>＋</Text>
        </Fab>
      </ThemeProvider>,
    );
    const flat = StyleSheet.flatten(screen.getByTestId('fab').props.style);
    expect(flat.backgroundColor).toBe(darkColors.actionPrimary);
  });
});
```

- [ ] **Step 8: Create `FeatureBand.native.test.tsx`**

```tsx
/**
 * Native harness tests for FeatureBand. 라이트 스모크 + 다크 테마 토큰 단언.
 */
import {StyleSheet, Text} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {FeatureBand} from './FeatureBand.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('FeatureBand (native)', () => {
  it('renders its children (light smoke)', () => {
    render(
      <FeatureBand testID="band">
        <Text>본문</Text>
      </FeatureBand>,
    );
    expect(screen.getByText('본문')).toBeTruthy();
  });

  it('uses the dark inverse background (inverse tone) in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <FeatureBand testID="band">
          <Text>본문</Text>
        </FeatureBand>
      </ThemeProvider>,
    );
    const flat = StyleSheet.flatten(screen.getByTestId('band').props.style);
    expect(flat.backgroundColor).toBe(darkColors.inverse);
  });
});
```

- [ ] **Step 9: Create `Pill.native.test.tsx`**

```tsx
/**
 * Native harness tests for Pill. 라이트 스모크 + 다크 테마 토큰 단언.
 */
import {StyleSheet} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {Pill} from './Pill.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Pill (native)', () => {
  it('renders its label (light smoke)', () => {
    render(<Pill testID="pill">전체</Pill>);
    expect(screen.getByText('전체')).toBeTruthy();
  });

  it('uses the dark card surface (inactive) in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Pill testID="pill">전체</Pill>
      </ThemeProvider>,
    );
    const flat = StyleSheet.flatten(screen.getByTestId('pill').props.style);
    expect(flat.backgroundColor).toBe(darkColors.card);
  });
});
```

- [ ] **Step 10: Create `Progress.native.test.tsx`**

The Progress native renders an outer rail `View` and an inner fill `View` (`UNSAFE_getAllByType(View)[1]`). The fill `backgroundColor` is the static tone color (`gold` for the default tone); only the width is dynamic.

```tsx
/**
 * Native harness tests for Progress. 라이트 스모크 + 다크 테마 토큰 단언.
 * fill View(두 번째 View)의 backgroundColor가 다크 토큰을 쓰는지 본다(width만 동적).
 */
import {StyleSheet, View} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {Progress} from './Progress.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Progress (native)', () => {
  it('renders rail and fill (light smoke)', () => {
    render(<Progress value={50} />);
    expect(screen.UNSAFE_getAllByType(View).length).toBeGreaterThanOrEqual(2);
  });

  it('uses the dark gold fill (default tone) in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Progress value={50} />
      </ThemeProvider>,
    );
    const fill = screen.UNSAFE_getAllByType(View)[1];
    const flat = StyleSheet.flatten(fill.props.style);
    expect(flat.backgroundColor).toBe(darkColors.gold);
  });
});
```

- [ ] **Step 11: Create `StatusDot.native.test.tsx`**

```tsx
/**
 * Native harness tests for StatusDot. 라이트 스모크 + 다크 테마 토큰 단언.
 */
import {StyleSheet} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {StatusDot} from './StatusDot.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('StatusDot (native)', () => {
  it('renders its glyph (light smoke)', () => {
    render(
      <StatusDot testID="dot" tone="neutral">
        ·
      </StatusDot>,
    );
    expect(screen.getByTestId('dot')).toBeTruthy();
  });

  it('uses the dark section background (neutral tone) in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <StatusDot testID="dot" tone="neutral">
          ·
        </StatusDot>
      </ThemeProvider>,
    );
    const flat = StyleSheet.flatten(screen.getByTestId('dot').props.style);
    expect(flat.backgroundColor).toBe(darkColors.section);
  });
});
```

- [ ] **Step 12: Create `Switch.native.test.tsx` (smoke only — see note)**

Switch's track color is an `Animated.interpolate` object bound to `backgroundColor`, which `StyleSheet.flatten` cannot reduce to a comparable string — so a static dark-token assertion is infeasible. Its dark wiring is covered by the web Switch dark test and the shared `getTrackColors(colors)` factory. This file is smoke-render only by design.

```tsx
/**
 * Native harness tests for Switch. 스모크 렌더만.
 * track 색은 Animated.interpolate 객체라 StyleSheet.flatten으로 문자열 단언이
 * 불가능하다 — 다크 배선은 web Switch 다크 테스트 + 공유 getTrackColors(colors)
 * 팩토리로 커버된다. 여기서는 네이티브 렌더가 깨지지 않는지만 본다.
 */
import {render, screen} from '@testing-library/react-native';
import {Switch} from './Switch.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';

describe('Switch (native)', () => {
  it('renders with a label (light smoke)', () => {
    render(
      <Switch checked={false} onCheckedChange={() => {}} label="알림" />,
    );
    expect(screen.getByText('알림')).toBeTruthy();
  });

  it('renders inside a dark ThemeProvider without crashing', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Switch checked onCheckedChange={() => {}} label="알림" />
      </ThemeProvider>,
    );
    expect(screen.getByText('알림')).toBeTruthy();
  });
});
```

(If `Switch` has no `label` prop, render `<Switch testID="sw" checked={false} onCheckedChange={() => {}} />` and assert `screen.getByTestId('sw')` is truthy instead — verify against `src/components/Switch/types.ts`.)

- [ ] **Step 13: Create `Tabs.native.test.tsx`**

Tabs renders each item as a `Pressable`; the active item carries the themed `borderBottomColor` (`textBrand` when not inverse). Give the first item as `value` so `UNSAFE_getAllByType(Pressable)[0]` is the active tab.

```tsx
/**
 * Native harness tests for Tabs. 라이트 스모크 + 다크 테마 토큰 단언.
 * 첫 항목을 value로 줘 첫 Pressable이 active가 되고, 그 borderBottomColor가
 * 다크 textBrand 토큰을 쓰는지 본다.
 */
import {StyleSheet, Pressable} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {Tabs} from './Tabs.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

const ITEMS = [
  {key: 'a', label: '메뉴'},
  {key: 'b', label: '주문'},
];

describe('Tabs (native)', () => {
  it('renders its tab labels (light smoke)', () => {
    render(<Tabs items={ITEMS} value="a" onChange={() => {}} />);
    expect(screen.getByText('메뉴')).toBeTruthy();
    expect(screen.getByText('주문')).toBeTruthy();
  });

  it('uses the dark textBrand underline on the active tab in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Tabs items={ITEMS} value="a" onChange={() => {}} />
      </ThemeProvider>,
    );
    const activeTab = screen.UNSAFE_getAllByType(Pressable)[0];
    const flat = StyleSheet.flatten(activeTab.props.style);
    expect(flat.borderBottomColor).toBe(darkColors.textBrand);
  });
});
```

- [ ] **Step 14: Create `Text.native.test.tsx`**

```tsx
/**
 * Native harness tests for Text. 라이트 스모크 + 다크 테마 토큰 단언.
 */
import {StyleSheet} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {Text} from './Text.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Text (native)', () => {
  it('renders its content (light smoke)', () => {
    render(<Text testID="txt">안녕</Text>);
    expect(screen.getByText('안녕')).toBeTruthy();
  });

  it('uses the dark foreground color (default variant) in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Text testID="txt">안녕</Text>
      </ThemeProvider>,
    );
    const flat = StyleSheet.flatten(screen.getByTestId('txt').props.style);
    expect(flat.color).toBe(darkColors.foreground);
  });
});
```

- [ ] **Step 15: Create `Toast.native.test.tsx`**

```tsx
/**
 * Native harness tests for Toast. 라이트 스모크 + 다크 테마 토큰 단언.
 */
import {StyleSheet} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {Toast} from './Toast.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Toast (native)', () => {
  it('renders its title (light smoke)', () => {
    render(<Toast testID="toast" title="저장됨" />);
    expect(screen.getByText('저장됨')).toBeTruthy();
  });

  it('uses the dark card surface in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Toast testID="toast" title="저장됨" />
      </ThemeProvider>,
    );
    const flat = StyleSheet.flatten(screen.getByTestId('toast').props.style);
    expect(flat.backgroundColor).toBe(darkColors.card);
  });
});
```

- [ ] **Step 16: Run the native suite**

Run: `pnpm jest --selectProjects native`
Expected: PASS — existing native tests plus the new 29 (14 components × 2 + Switch 1). For any failing dark assertion, `console.log` the flattened property to see the actual rendered value, match it to the correct `darkColors` key (or switch the query per the Global query note), fix, re-run. Do not change source files.

- [ ] **Step 17: Typecheck + lint**

Run: `pnpm typecheck` → PASS.
If lint flags any test file: `pnpm eslint --fix src/components/<Name>/<Name>.native.test.tsx`.

- [ ] **Step 18: Commit**

```bash
git add src/components/{Badge,Button,Card,Chip,Divider,Eyebrow,Fab,FeatureBand,Pill,Progress,StatusDot,Switch,Tabs,Text,Toast}/*.native.test.tsx
git commit -m "test: native dark-mode unit tests for remaining 15 components"
```

---

## Final Verification

- [ ] **Full suite:** `pnpm test` → all 3 projects green.
- [ ] **Count:** `ls src/components/*/*.native.test.tsx | wc -l` → 20 (5 pre-existing + 15 new).
- [ ] **Update memory:** append to `/Users/logan/.claude/projects/-Users-logan-Repository-wooBottle-externalProjects-woosign/memory/bottomsheet-component.md` noting native dark tests for the remaining 15 done (14 with dark-token assertion + Switch smoke-only; now all theme-consuming components have native dark coverage), and that this clears the last backlog item.

---

## Self-Review Notes

- **Spec coverage:** all 15 components have a step (Steps 1-15); each is smoke + dark-token except Switch (smoke only, Step 12) per spec exception; Progress uses fill View[1] (Step 10), Tabs uses Pressable[0] (Step 13) per spec query notes; validation (Steps 16-17). All spec sections covered.
- **Token consistency:** every `darkColors.<key>` (`actionPrimary`, `card`, `borderDefault`, `textSecondary`, `inverse`, `gold`, `section`, `textBrand`, `foreground`) was read from the corresponding `X.styles.ts` default-variant/tone branch — they are valid `Colors` keys used by the light factory, so `darkColors` has them.
- **No placeholders:** every test file is complete. The two conditional fallbacks (Switch label vs testID; query fallback) are explicit, not vague.
```
