# Box Web Tests Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add jsdom unit tests for the existing `Box.web.tsx`, covering the logic-bearing props→style behaviors (shorthand expansion, override precedence, borderRadius preset mapping, borderStyle gating, `as` element, style merge, size).

**Architecture:** One new `Box.web.test.tsx` mirroring the Card/Input web-test convention (`@testing-library/react`, `toHaveStyle`). The implementation already exists and is correct, so the tests are characterization tests — they should pass on first run (green). If any fails, investigate whether it's a test bug or a real `Box.web` regression before changing anything.

**Tech Stack:** TypeScript, React, jest (web project = jsdom/ts-jest, `*.web.test.tsx`), `@testing-library/react`.

**Conventions:** The CI-scoped lint (`eslint "src/components/**/!(*.stories).tsx"`) includes `*.test.tsx`, so keep the file prettier-clean (2-space, single quotes, trailing commas); run `pnpm eslint --fix` if needed.

**Reference:** `src/components/Box/Box.web.tsx` (the code under test — defaults `display:flex`/`flexDirection:column`, padding/margin shorthand via `?? `, `resolveBorderRadius` preset→token, `borderStyle:solid` when `borderWidth` set, `as` element, `...style` merge, undefined cleanup), `src/components/Box/types.ts` (`BoxWebProps`), `src/components/Card/Card.web.test.tsx` (test style).

---

## File Structure

| File | Responsibility |
|---|---|
| `src/components/Box/Box.web.test.tsx` | jsdom unit tests for `Box.web.tsx` |

Pure additive — no source changes.

---

## Task 1: Box web tests

**Files:**
- Create/Test: `src/components/Box/Box.web.test.tsx`

- [ ] **Step 1: Write the test file**

```tsx
/**
 * Web harness tests for Box. jsdom 환경, .web.tsx 구현을 사용한다.
 * props → CSS 스타일 변환의 분기/정밀 로직(shorthand 확장, 우선순위, 프리셋
 * 매핑, borderStyle 게이팅, as 엘리먼트, style 병합)을 검증한다.
 */
import {render, screen} from '@testing-library/react';
import {Box} from './Box';
import {borderRadius as radiusTokens} from '../../core/theme/tokens';

describe('Box (web)', () => {
  it('renders children with a data-testid and defaults to a flex column', () => {
    render(<Box testID="box">본문</Box>);
    const box = screen.getByTestId('box');
    expect(box).toHaveTextContent('본문');
    expect(box).toHaveStyle({display: 'flex', flexDirection: 'column'});
  });

  it('uses the provided flexDirection', () => {
    render(<Box testID="box" flexDirection="row" />);
    expect(screen.getByTestId('box')).toHaveStyle({flexDirection: 'row'});
  });

  it('expands paddingX to left and right', () => {
    render(<Box testID="box" paddingX={16} />);
    expect(screen.getByTestId('box')).toHaveStyle({
      paddingLeft: '16px',
      paddingRight: '16px',
    });
  });

  it('expands paddingY to top and bottom', () => {
    render(<Box testID="box" paddingY={8} />);
    expect(screen.getByTestId('box')).toHaveStyle({
      paddingTop: '8px',
      paddingBottom: '8px',
    });
  });

  it('lets an explicit side padding override the shorthand', () => {
    render(<Box testID="box" paddingX={16} paddingLeft={4} />);
    expect(screen.getByTestId('box')).toHaveStyle({
      paddingLeft: '4px',
      paddingRight: '16px',
    });
  });

  it('expands marginX to left and right', () => {
    render(<Box testID="box" marginX={12} />);
    expect(screen.getByTestId('box')).toHaveStyle({
      marginLeft: '12px',
      marginRight: '12px',
    });
  });

  it('resolves a borderRadius preset to its token value', () => {
    render(<Box testID="box" borderRadius="md" />);
    expect(screen.getByTestId('box')).toHaveStyle({
      borderRadius: `${radiusTokens.md}px`,
    });
  });

  it('passes a numeric borderRadius through', () => {
    render(<Box testID="box" borderRadius={20} />);
    expect(screen.getByTestId('box')).toHaveStyle({borderRadius: '20px'});
  });

  it('sets borderStyle solid only when borderWidth is provided', () => {
    const {rerender} = render(<Box testID="box" />);
    expect(screen.getByTestId('box').style.borderStyle).toBe('');
    rerender(<Box testID="box" borderWidth={2} />);
    expect(screen.getByTestId('box')).toHaveStyle({
      borderWidth: '2px',
      borderStyle: 'solid',
    });
  });

  it('renders the element given by the `as` prop (default div)', () => {
    const {rerender} = render(<Box testID="box" />);
    expect(screen.getByTestId('box').tagName).toBe('DIV');
    rerender(<Box testID="box" as="section" />);
    expect(screen.getByTestId('box').tagName).toBe('SECTION');
  });

  it('merges custom style and applies a numeric size', () => {
    render(
      <Box
        testID="box"
        width={200}
        style={{backgroundColor: 'rgb(255, 0, 0)'}}
      />,
    );
    const box = screen.getByTestId('box');
    expect(box).toHaveStyle({
      width: '200px',
      backgroundColor: 'rgb(255, 0, 0)',
    });
  });

  it('accepts a string width', () => {
    render(<Box testID="box" width="50%" />);
    expect(screen.getByTestId('box')).toHaveStyle({width: '50%'});
  });
});
```

- [ ] **Step 2: Run the tests (expect green against the existing implementation)**

Run: `pnpm jest --selectProjects web src/components/Box/Box.web.test.tsx`
Expected: PASS (12 tests). These characterize the existing correct `Box.web.tsx`. If any test fails, investigate: most likely a test-expectation bug (fix the test); only if the failure reveals a genuine `Box.web` defect should the implementation change — and that would be a separate, surfaced decision, not a silent edit.

- [ ] **Step 3: Typecheck + lint**

Run: `pnpm typecheck`
Expected: PASS.

If lint flags the test file: `pnpm eslint --fix src/components/Box/Box.web.test.tsx`.

- [ ] **Step 4: Commit**

```bash
git add src/components/Box/Box.web.test.tsx
git commit -m "test(Box): web unit tests for props-to-style logic"
```

---

## Final Verification

- [ ] **Full web suite still green:** `pnpm jest --selectProjects web` → all pass (existing + new Box 12).
- [ ] **Update memory:** append to `/Users/logan/.claude/projects/-Users-logan-Repository-wooBottle-externalProjects-woosign/memory/bottomsheet-component.md` noting Box web tests added (12 tests for padding/margin shorthand + precedence, borderRadius preset/number, borderStyle gating, `as`, style merge, size).

---

## Self-Review Notes

- **Spec coverage:** spec behaviors → tests: defaults+children (test 1), flexDirection (2), paddingX/Y (3-4), explicit override (5), marginX (6), borderRadius preset (7) + number (8), borderStyle gating (9), `as` (10), style merge + numeric size (11), string size (12). All covered.
- **Assertion soundness:** `toHaveStyle` with `'16px'` matches React's numeric→px serialization; `radiusTokens.md` imported from the same token source the implementation uses (no magic number); `borderStyle === ''` is jsdom's empty value for an unset property; `tagName` is uppercase (`'DIV'`/`'SECTION'`).
- **No placeholders:** the test file is complete.
```
