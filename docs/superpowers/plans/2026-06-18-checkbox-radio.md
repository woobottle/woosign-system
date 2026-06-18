# Checkbox + Radio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add cross-platform `Checkbox` (with indeterminate) and `RadioGroup` + `Radio` form-selection components, mirroring the existing Switch facade/controlled/theming patterns.

**Architecture:** Facade pattern per Switch (`X.tsx` web facade + `X.web.tsx` + `X.native.tsx` + `X.styles.ts` + `types.ts` + `index.ts`). Controlled-only. Theme-aware via `useResolvedColors()` + `getCheckboxStyles(c)`/`getRadioStyles(c)` factories (plain size-keyed dimension maps + a color factory — simpler than createVariants, like Progress/StatusDot). Radio uses a `RadioContext` for group state; `Radio` reads it to compute `checked`.

**Tech Stack:** TypeScript, React, React Native, jest (web=jsdom, native=react-native preset), `@testing-library/react` + `@testing-library/react-native` + `@storybook/{react,react-native}`.

**Conventions:** TDD. Prettier-clean (CI lint includes `*.test.tsx`); `pnpm eslint --fix` if needed. Verified tokens (all used elsewhere): `c.actionPrimary`, `c.borderDefault`, `c.card`, `c.textInverse`, `c.foreground`; `borderRadius.sm/full`; `typography.fontWeight.medium/semibold`; `typography.fontSize.sm/base`; `spacing[2]`.

**Reference:** `src/components/Switch/Switch.web.tsx` / `.native.tsx` / `.styles.ts` (controlled `handlePress`/`handleClick`, `useResolvedColors` + `useMemo` factory, container+label layout, `accessibilityRole`/`role` + state).

---

## File Structure

```
src/components/Checkbox/types.ts
src/components/Checkbox/Checkbox.styles.ts
src/components/Checkbox/Checkbox.web.tsx
src/components/Checkbox/Checkbox.native.tsx
src/components/Checkbox/Checkbox.tsx          (web facade)
src/components/Checkbox/index.ts
src/components/Checkbox/Checkbox.web.test.tsx
src/components/Checkbox/Checkbox.native.test.tsx
src/components/Radio/types.ts
src/components/Radio/RadioContext.ts
src/components/Radio/Radio.styles.ts
src/components/Radio/RadioGroup.web.tsx
src/components/Radio/RadioGroup.native.tsx
src/components/Radio/RadioGroup.tsx           (web facade)
src/components/Radio/Radio.web.tsx
src/components/Radio/Radio.native.tsx
src/components/Radio/Radio.tsx                 (web facade)
src/components/Radio/index.ts
src/components/Radio/Radio.web.test.tsx
src/components/Radio/Radio.native.test.tsx
src/components/index.ts                         (register both — modify)
+ stories (Task 3)
```

---

## Task 1: Checkbox

**Files:** all `src/components/Checkbox/*` + tests.

- [ ] **Step 1: Create `src/components/Checkbox/types.ts`**

```ts
import type {ReactNode} from 'react';
import type {ViewStyle, PressableProps} from 'react-native';

export type CheckboxSize = 'sm' | 'default' | 'lg';

export interface CheckboxBaseProps {
  /** 체크 여부 (controlled). */
  checked?: boolean;
  /** 중간 상태 — 체크 대신 대시(–). checked보다 우선해 시각/aria에 반영. */
  indeterminate?: boolean;
  /** 누르면 onCheckedChange(!checked) 호출. */
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** 우측 라벨. */
  label?: ReactNode;
  size?: CheckboxSize;
  testID?: string;
}

export interface CheckboxWebProps extends CheckboxBaseProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface CheckboxNativeProps extends CheckboxBaseProps {
  style?: ViewStyle;
  pressableProps?: Omit<PressableProps, 'onPress' | 'disabled' | 'style'>;
}

export type CheckboxProps = CheckboxBaseProps & {
  style?: ViewStyle | React.CSSProperties;
  className?: string;
};
```

- [ ] **Step 2: Create `src/components/Checkbox/Checkbox.styles.ts`**

```ts
import {spacing, borderRadius, typography} from '../../core/theme/tokens';
import type {Colors} from '../../core/theme/types';

/** 사이즈별 박스/글리프 치수. */
export const checkboxDimensions = {
  sm: {box: 16, glyph: 11, fontSize: typography.fontSize.sm.size},
  default: {box: 20, glyph: 13, fontSize: typography.fontSize.sm.size},
  lg: {box: 24, glyph: 16, fontSize: typography.fontSize.base.size},
} as const;

export const containerGap = spacing[2];
export const disabledStyle = {opacity: 0.5};

/** web/native 공유 색 스타일(테마 의존). 치수는 컴포넌트가 인라인으로 합친다. */
export function getCheckboxStyles(c: Colors) {
  return {
    boxBase: {
      borderRadius: borderRadius.sm,
      borderWidth: 2,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    boxUnchecked: {
      backgroundColor: c.card,
      borderColor: c.borderDefault,
    },
    boxChecked: {
      backgroundColor: c.actionPrimary,
      borderColor: c.actionPrimary,
    },
    glyph: {
      color: c.textInverse,
      fontWeight: typography.fontWeight.semibold as '600',
    },
    label: {
      color: c.foreground,
      fontWeight: typography.fontWeight.medium as '500',
    },
  };
}
```

- [ ] **Step 3: Write failing web tests — `src/components/Checkbox/Checkbox.web.test.tsx`**

```tsx
/**
 * Web harness tests for Checkbox. jsdom.
 */
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Checkbox} from './Checkbox';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Checkbox (web)', () => {
  it('renders the label with role=checkbox', () => {
    render(<Checkbox label="동의" testID="cb" />);
    expect(screen.getByText('동의')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('calls onCheckedChange with the toggled value on click', async () => {
    const onChange = jest.fn();
    const {rerender} = render(
      <Checkbox checked={false} onCheckedChange={onChange} testID="cb" />,
    );
    await userEvent.click(screen.getByTestId('cb'));
    expect(onChange).toHaveBeenCalledWith(true);
    rerender(<Checkbox checked onCheckedChange={onChange} testID="cb" />);
    await userEvent.click(screen.getByTestId('cb'));
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it('reflects checked state in aria-checked', () => {
    const {rerender} = render(<Checkbox checked={false} testID="cb" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute(
      'aria-checked',
      'false',
    );
    rerender(<Checkbox checked testID="cb" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('renders indeterminate as aria-checked="mixed" with a dash glyph', () => {
    render(<Checkbox indeterminate testID="cb" />);
    const box = screen.getByRole('checkbox');
    expect(box).toHaveAttribute('aria-checked', 'mixed');
    expect(box).toHaveTextContent('–');
  });

  it('does not call onCheckedChange when disabled', async () => {
    const onChange = jest.fn();
    render(<Checkbox disabled onCheckedChange={onChange} testID="cb" />);
    await userEvent.click(screen.getByTestId('cb'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('uses the dark actionPrimary fill when checked in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Checkbox checked testID="cb" />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('cb')).toHaveStyle({
      backgroundColor: darkColors.actionPrimary,
    });
  });
});
```

- [ ] **Step 4: Run to confirm failure**

Run: `pnpm jest --selectProjects web src/components/Checkbox/Checkbox.web.test.tsx`
Expected: FAIL — `Cannot find module './Checkbox'`.

- [ ] **Step 5: Create `src/components/Checkbox/Checkbox.web.tsx`**

```tsx
/**
 * Checkbox component - Web implementation. controlled, role=checkbox.
 */
import React, {forwardRef, useCallback, useMemo} from 'react';
import type {CheckboxWebProps} from './types';
import {
  getCheckboxStyles,
  checkboxDimensions,
  containerGap,
  disabledStyle,
} from './Checkbox.styles';
import {mergeStyles} from '../../core/variants';
import {cssifyWebStyles} from '../../core/utils/cssifyWebStyles';
import {useResolvedColors} from '../../core/hooks';

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxWebProps>(
  function Checkbox(
    {
      checked = false,
      indeterminate = false,
      onCheckedChange,
      size = 'default',
      disabled = false,
      label,
      className,
      style,
      testID,
    },
    ref,
  ) {
    const handleClick = useCallback(() => {
      if (!disabled) onCheckedChange?.(!checked);
    }, [disabled, checked, onCheckedChange]);

    const colors = useResolvedColors();
    const s = useMemo(() => getCheckboxStyles(colors), [colors]);
    const dims = checkboxDimensions[size];
    const isOn = indeterminate || checked;

    const boxStyle = mergeStyles(
      s.boxBase,
      {width: dims.box, height: dims.box},
      isOn ? s.boxChecked : s.boxUnchecked,
      {
        display: 'inline-flex',
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding: 0,
        transition: 'background-color 150ms ease',
      },
      disabled && disabledStyle,
    ) as React.CSSProperties;

    const glyphStyle = cssifyWebStyles({
      ...s.glyph,
      fontSize: dims.glyph,
      lineHeight: 1,
      pointerEvents: 'none',
    }) as React.CSSProperties;

    const containerStyle = mergeStyles(
      {display: 'inline-flex', alignItems: 'center', gap: containerGap},
      style,
    ) as React.CSSProperties;

    const labelStyle = cssifyWebStyles({
      ...s.label,
      fontSize: dims.fontSize,
      cursor: disabled ? 'not-allowed' : 'pointer',
    }) as React.CSSProperties;

    return (
      <div style={containerStyle} className={className}>
        <button
          ref={ref}
          type="button"
          role="checkbox"
          aria-checked={indeterminate ? 'mixed' : checked}
          disabled={disabled}
          onClick={handleClick}
          style={boxStyle}
          data-testid={testID}>
          {isOn && (
            <span style={glyphStyle} aria-hidden>
              {indeterminate ? '–' : '✓'}
            </span>
          )}
        </button>
        {label != null && (
          <span style={labelStyle} onClick={disabled ? undefined : handleClick}>
            {label}
          </span>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
```

- [ ] **Step 6: Create `src/components/Checkbox/Checkbox.tsx` (web facade)**

```tsx
// Web-side facade fallback: Metro reads src/ directly and resolves .native via platform extensions.
export {Checkbox} from './Checkbox.web';
```

- [ ] **Step 7: Create `src/components/Checkbox/index.ts`**

```ts
export type {
  CheckboxProps,
  CheckboxBaseProps,
  CheckboxWebProps,
  CheckboxNativeProps,
  CheckboxSize,
} from './types';
export {Checkbox} from './Checkbox';
```

- [ ] **Step 8: Run web tests + typecheck**

Run: `pnpm jest --selectProjects web src/components/Checkbox/Checkbox.web.test.tsx`
Expected: PASS (6 tests).
Run: `pnpm typecheck` → PASS.

- [ ] **Step 9: Write failing native tests — `src/components/Checkbox/Checkbox.native.test.tsx`**

```tsx
/**
 * Native harness tests for Checkbox. react-native preset.
 */
import {StyleSheet, View} from 'react-native';
import {render, screen, fireEvent} from '@testing-library/react-native';
import {Checkbox} from './Checkbox.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Checkbox (native)', () => {
  it('renders its label (light smoke)', () => {
    render(<Checkbox label="동의" testID="cb" />);
    expect(screen.getByText('동의')).toBeTruthy();
  });

  it('calls onCheckedChange with the toggled value on press', () => {
    const onChange = jest.fn();
    render(<Checkbox checked={false} onCheckedChange={onChange} testID="cb" />);
    fireEvent.press(screen.getByTestId('cb'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('does not call onCheckedChange when disabled', () => {
    const onChange = jest.fn();
    render(<Checkbox disabled onCheckedChange={onChange} testID="cb" />);
    fireEvent.press(screen.getByTestId('cb'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('uses the dark actionPrimary fill when checked in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Checkbox checked testID="cb" />
      </ThemeProvider>,
    );
    // 박스는 Pressable 내부 첫 View. flatten 후 배경 확인.
    const box = screen.UNSAFE_getAllByType(View)[0];
    const flat = StyleSheet.flatten(box.props.style);
    expect(flat.backgroundColor).toBe(darkColors.actionPrimary);
  });
});
```

- [ ] **Step 10: Run to confirm failure**

Run: `pnpm jest --selectProjects native src/components/Checkbox/Checkbox.native.test.tsx`
Expected: FAIL — `Cannot find module './Checkbox.native'`.

- [ ] **Step 11: Create `src/components/Checkbox/Checkbox.native.tsx`**

```tsx
/**
 * Checkbox component - React Native implementation. controlled.
 */
import {forwardRef, useCallback, useMemo} from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import type {CheckboxNativeProps} from './types';
import {
  getCheckboxStyles,
  checkboxDimensions,
  containerGap,
  disabledStyle,
} from './Checkbox.styles';
import {useResolvedColors} from '../../core/hooks';

export const Checkbox = forwardRef<View, CheckboxNativeProps>(function Checkbox(
  {
    checked = false,
    indeterminate = false,
    onCheckedChange,
    size = 'default',
    disabled = false,
    label,
    style,
    pressableProps,
    testID,
  },
  ref,
) {
  const handlePress = useCallback(() => {
    if (!disabled) onCheckedChange?.(!checked);
  }, [disabled, checked, onCheckedChange]);

  const colors = useResolvedColors();
  const s = useMemo(() => getCheckboxStyles(colors), [colors]);
  const dims = checkboxDimensions[size];
  const isOn = indeterminate || checked;

  return (
    <Pressable
      ref={ref}
      onPress={handlePress}
      disabled={disabled}
      testID={testID}
      style={[styles.container, disabled && disabledStyle, style]}
      accessibilityRole="checkbox"
      accessibilityState={{
        checked: indeterminate ? 'mixed' : checked,
        disabled,
      }}
      {...pressableProps}>
      <View
        style={[
          s.boxBase as ViewStyle,
          {width: dims.box, height: dims.box},
          (isOn ? s.boxChecked : s.boxUnchecked) as ViewStyle,
        ]}>
        {isOn && (
          <Text style={[s.glyph as TextStyle, {fontSize: dims.glyph}]}>
            {indeterminate ? '–' : '✓'}
          </Text>
        )}
      </View>
      {label != null && (
        <Text style={[s.label as TextStyle, {fontSize: dims.fontSize}]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: containerGap,
  },
});

Checkbox.displayName = 'Checkbox';
```

- [ ] **Step 12: Run native tests + typecheck**

Run: `pnpm jest --selectProjects native src/components/Checkbox/Checkbox.native.test.tsx`
Expected: PASS (4 tests).
Run: `pnpm typecheck` → PASS.

- [ ] **Step 13: Commit**

```bash
git add src/components/Checkbox
git commit -m "feat(Checkbox): cross-platform checkbox with indeterminate"
```

---

## Task 2: RadioGroup + Radio

**Files:** all `src/components/Radio/*` + tests.

- [ ] **Step 1: Create `src/components/Radio/types.ts`**

```ts
import type {ReactNode} from 'react';
import type {ViewStyle} from 'react-native';

export type RadioSize = 'sm' | 'default' | 'lg';

export interface RadioGroupBaseProps {
  /** 현재 선택 값 (controlled). */
  value?: string;
  onValueChange?: (value: string) => void;
  /** 그룹 전체 비활성. */
  disabled?: boolean;
  /** web 라디오 name 그룹(선택). */
  name?: string;
  children?: ReactNode;
  testID?: string;
}

export interface RadioGroupWebProps extends RadioGroupBaseProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface RadioGroupNativeProps extends RadioGroupBaseProps {
  style?: ViewStyle;
}

export interface RadioBaseProps {
  /** 이 라디오의 값(필수). */
  value: string;
  label?: ReactNode;
  /** 개별 비활성(그룹 disabled와 OR). */
  disabled?: boolean;
  size?: RadioSize;
  testID?: string;
}

export interface RadioWebProps extends RadioBaseProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface RadioNativeProps extends RadioBaseProps {
  style?: ViewStyle;
}

export interface RadioContextValue {
  value: string | undefined;
  onValueChange: ((value: string) => void) | undefined;
  disabled: boolean;
  name: string | undefined;
}

export type RadioGroupProps = RadioGroupBaseProps & {
  style?: ViewStyle | React.CSSProperties;
  className?: string;
};
export type RadioProps = RadioBaseProps & {
  style?: ViewStyle | React.CSSProperties;
  className?: string;
};
```

- [ ] **Step 2: Create `src/components/Radio/RadioContext.ts`**

```ts
import {createContext} from 'react';
import type {RadioContextValue} from './types';

/** RadioGroup이 선택 값/콜백/disabled를 자식 Radio에 전달한다. */
export const RadioContext = createContext<RadioContextValue | null>(null);
RadioContext.displayName = 'RadioContext';
```

- [ ] **Step 3: Create `src/components/Radio/Radio.styles.ts`**

```ts
import {spacing, borderRadius, typography} from '../../core/theme/tokens';
import type {Colors} from '../../core/theme/types';

/** 사이즈별 외곽/점 치수. */
export const radioDimensions = {
  sm: {outer: 16, dot: 6, fontSize: typography.fontSize.sm.size},
  default: {outer: 20, dot: 8, fontSize: typography.fontSize.sm.size},
  lg: {outer: 24, dot: 10, fontSize: typography.fontSize.base.size},
} as const;

export const containerGap = spacing[2];
export const disabledStyle = {opacity: 0.5};

export function getRadioStyles(c: Colors) {
  return {
    outerBase: {
      borderRadius: borderRadius.full,
      borderWidth: 2,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    outerUnchecked: {
      backgroundColor: c.card,
      borderColor: c.borderDefault,
    },
    outerChecked: {
      backgroundColor: c.card,
      borderColor: c.actionPrimary,
    },
    dot: {
      borderRadius: borderRadius.full,
      backgroundColor: c.actionPrimary,
    },
    label: {
      color: c.foreground,
      fontWeight: typography.fontWeight.medium as '500',
    },
  };
}
```

- [ ] **Step 4: Write failing web tests — `src/components/Radio/Radio.web.test.tsx`**

```tsx
/**
 * Web harness tests for RadioGroup + Radio. jsdom.
 */
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {RadioGroup, Radio} from './index';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Radio (web)', () => {
  it('renders a radiogroup with radio options', () => {
    render(
      <RadioGroup value="a" onValueChange={() => {}}>
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('calls onValueChange with the clicked option value', async () => {
    const onChange = jest.fn();
    render(
      <RadioGroup value="a" onValueChange={onChange}>
        <Radio value="a" label="A" testID="ra" />
        <Radio value="b" label="B" testID="rb" />
      </RadioGroup>,
    );
    await userEvent.click(screen.getByTestId('rb'));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('marks only the selected option aria-checked', () => {
    render(
      <RadioGroup value="b" onValueChange={() => {}}>
        <Radio value="a" label="A" testID="ra" />
        <Radio value="b" label="B" testID="rb" />
      </RadioGroup>,
    );
    expect(screen.getByTestId('ra')).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByTestId('rb')).toHaveAttribute('aria-checked', 'true');
  });

  it('does not call onValueChange when the group is disabled', async () => {
    const onChange = jest.fn();
    render(
      <RadioGroup value="a" onValueChange={onChange} disabled>
        <Radio value="a" label="A" testID="ra" />
        <Radio value="b" label="B" testID="rb" />
      </RadioGroup>,
    );
    await userEvent.click(screen.getByTestId('rb'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('uses the dark actionPrimary dot on the selected option in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <RadioGroup value="a" onValueChange={() => {}}>
          <Radio value="a" label="A" testID="ra" />
        </RadioGroup>
      </ThemeProvider>,
    );
    // 선택된 라디오 버튼 내부의 점(span)의 backgroundColor.
    const dot = screen.getByTestId('ra').querySelector('span');
    expect(dot).toHaveStyle({backgroundColor: darkColors.actionPrimary});
  });
});
```

- [ ] **Step 5: Run to confirm failure**

Run: `pnpm jest --selectProjects web src/components/Radio/Radio.web.test.tsx`
Expected: FAIL — `Cannot find module './index'` / RadioGroup undefined.

- [ ] **Step 6: Create `src/components/Radio/RadioGroup.web.tsx`**

```tsx
/**
 * RadioGroup - Web. role=radiogroup wrapper that provides RadioContext.
 */
import React, {useMemo} from 'react';
import type {RadioGroupWebProps, RadioContextValue} from './types';
import {RadioContext} from './RadioContext';

export function RadioGroup({
  value,
  onValueChange,
  disabled = false,
  name,
  children,
  className,
  style,
  testID,
}: RadioGroupWebProps) {
  const ctx = useMemo<RadioContextValue>(
    () => ({value, onValueChange, disabled, name}),
    [value, onValueChange, disabled, name],
  );
  return (
    <RadioContext.Provider value={ctx}>
      <div role="radiogroup" className={className} style={style} data-testid={testID}>
        {children}
      </div>
    </RadioContext.Provider>
  );
}

RadioGroup.displayName = 'RadioGroup';
```

- [ ] **Step 7: Create `src/components/Radio/Radio.web.tsx`**

```tsx
/**
 * Radio - Web. role=radio; reads RadioContext for checked/onChange/disabled.
 */
import React, {forwardRef, useCallback, useContext, useMemo} from 'react';
import type {RadioWebProps} from './types';
import {RadioContext} from './RadioContext';
import {
  getRadioStyles,
  radioDimensions,
  containerGap,
  disabledStyle,
} from './Radio.styles';
import {mergeStyles} from '../../core/variants';
import {cssifyWebStyles} from '../../core/utils/cssifyWebStyles';
import {useResolvedColors} from '../../core/hooks';

export const Radio = forwardRef<HTMLButtonElement, RadioWebProps>(function Radio(
  {value, label, disabled: itemDisabled = false, size = 'default', className, style, testID},
  ref,
) {
  const ctx = useContext(RadioContext);
  const checked = ctx?.value === value;
  const disabled = itemDisabled || !!ctx?.disabled;

  const handleClick = useCallback(() => {
    if (!disabled) ctx?.onValueChange?.(value);
  }, [disabled, ctx, value]);

  const colors = useResolvedColors();
  const s = useMemo(() => getRadioStyles(colors), [colors]);
  const dims = radioDimensions[size];

  const outerStyle = mergeStyles(
    s.outerBase,
    {width: dims.outer, height: dims.outer},
    checked ? s.outerChecked : s.outerUnchecked,
    {
      display: 'inline-flex',
      cursor: disabled ? 'not-allowed' : 'pointer',
      padding: 0,
    },
    disabled && disabledStyle,
  ) as React.CSSProperties;

  const dotStyle = cssifyWebStyles({
    ...s.dot,
    width: dims.dot,
    height: dims.dot,
    pointerEvents: 'none',
  }) as React.CSSProperties;

  const containerStyle = mergeStyles(
    {display: 'inline-flex', alignItems: 'center', gap: containerGap},
    style,
  ) as React.CSSProperties;

  const labelStyle = cssifyWebStyles({
    ...s.label,
    fontSize: dims.fontSize,
    cursor: disabled ? 'not-allowed' : 'pointer',
  }) as React.CSSProperties;

  return (
    <div style={containerStyle} className={className}>
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleClick}
        style={outerStyle}
        data-testid={testID}>
        {checked && <span style={dotStyle} />}
      </button>
      {label != null && (
        <span style={labelStyle} onClick={disabled ? undefined : handleClick}>
          {label}
        </span>
      )}
    </div>
  );
});

Radio.displayName = 'Radio';
```

- [ ] **Step 8: Create `src/components/Radio/RadioGroup.tsx` and `Radio.tsx` (web facades)**

`RadioGroup.tsx`:
```tsx
// Web-side facade fallback: Metro reads src/ directly and resolves .native via platform extensions.
export {RadioGroup} from './RadioGroup.web';
```

`Radio.tsx`:
```tsx
// Web-side facade fallback: Metro reads src/ directly and resolves .native via platform extensions.
export {Radio} from './Radio.web';
```

- [ ] **Step 9: Create `src/components/Radio/index.ts`**

```ts
export type {
  RadioGroupProps,
  RadioGroupBaseProps,
  RadioGroupWebProps,
  RadioGroupNativeProps,
  RadioProps,
  RadioBaseProps,
  RadioWebProps,
  RadioNativeProps,
  RadioSize,
} from './types';
export {RadioGroup} from './RadioGroup';
export {Radio} from './Radio';
```

- [ ] **Step 10: Run web tests + typecheck**

Run: `pnpm jest --selectProjects web src/components/Radio/Radio.web.test.tsx`
Expected: PASS (5 tests).
Run: `pnpm typecheck` → PASS.

- [ ] **Step 11: Write failing native tests — `src/components/Radio/Radio.native.test.tsx`**

```tsx
/**
 * Native harness tests for RadioGroup + Radio. react-native preset.
 */
import {StyleSheet, View} from 'react-native';
import {render, screen, fireEvent} from '@testing-library/react-native';
import {RadioGroup} from './RadioGroup.native';
import {Radio} from './Radio.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Radio (native)', () => {
  it('renders its options (light smoke)', () => {
    render(
      <RadioGroup value="a" onValueChange={() => {}}>
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    expect(screen.getByText('A')).toBeTruthy();
    expect(screen.getByText('B')).toBeTruthy();
  });

  it('calls onValueChange with the pressed option value', () => {
    const onChange = jest.fn();
    render(
      <RadioGroup value="a" onValueChange={onChange}>
        <Radio value="a" label="A" testID="ra" />
        <Radio value="b" label="B" testID="rb" />
      </RadioGroup>,
    );
    fireEvent.press(screen.getByTestId('rb'));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('does not call onValueChange when the group is disabled', () => {
    const onChange = jest.fn();
    render(
      <RadioGroup value="a" onValueChange={onChange} disabled>
        <Radio value="a" label="A" testID="ra" />
        <Radio value="b" label="B" testID="rb" />
      </RadioGroup>,
    );
    fireEvent.press(screen.getByTestId('rb'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('uses the dark actionPrimary dot on the selected option in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <RadioGroup value="a" onValueChange={() => {}}>
          <Radio value="a" label="A" testID="ra" />
        </RadioGroup>
      </ThemeProvider>,
    );
    // 선택된 라디오의 내부 점 View(외곽 View의 자식). 두 번째 View가 점.
    const views = screen.UNSAFE_getAllByType(View);
    const dot = views[views.length - 1];
    const flat = StyleSheet.flatten(dot.props.style);
    expect(flat.backgroundColor).toBe(darkColors.actionPrimary);
  });
});
```

- [ ] **Step 12: Run to confirm failure**

Run: `pnpm jest --selectProjects native src/components/Radio/Radio.native.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 13: Create `src/components/Radio/RadioGroup.native.tsx`**

```tsx
/**
 * RadioGroup - React Native. View wrapper that provides RadioContext.
 */
import {useMemo} from 'react';
import {View} from 'react-native';
import type {RadioGroupNativeProps, RadioContextValue} from './types';
import {RadioContext} from './RadioContext';

export function RadioGroup({
  value,
  onValueChange,
  disabled = false,
  name,
  children,
  style,
  testID,
}: RadioGroupNativeProps) {
  const ctx = useMemo<RadioContextValue>(
    () => ({value, onValueChange, disabled, name}),
    [value, onValueChange, disabled, name],
  );
  return (
    <RadioContext.Provider value={ctx}>
      <View style={style} testID={testID}>
        {children}
      </View>
    </RadioContext.Provider>
  );
}

RadioGroup.displayName = 'RadioGroup';
```

- [ ] **Step 14: Create `src/components/Radio/Radio.native.tsx`**

```tsx
/**
 * Radio - React Native. accessibilityRole=radio; reads RadioContext.
 */
import {forwardRef, useCallback, useContext, useMemo} from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import type {RadioNativeProps} from './types';
import {RadioContext} from './RadioContext';
import {
  getRadioStyles,
  radioDimensions,
  containerGap,
  disabledStyle,
} from './Radio.styles';
import {useResolvedColors} from '../../core/hooks';

export const Radio = forwardRef<View, RadioNativeProps>(function Radio(
  {value, label, disabled: itemDisabled = false, size = 'default', style, testID},
  ref,
) {
  const ctx = useContext(RadioContext);
  const checked = ctx?.value === value;
  const disabled = itemDisabled || !!ctx?.disabled;

  const handlePress = useCallback(() => {
    if (!disabled) ctx?.onValueChange?.(value);
  }, [disabled, ctx, value]);

  const colors = useResolvedColors();
  const s = useMemo(() => getRadioStyles(colors), [colors]);
  const dims = radioDimensions[size];

  return (
    <Pressable
      ref={ref}
      onPress={handlePress}
      disabled={disabled}
      testID={testID}
      style={[styles.container, disabled && disabledStyle, style]}
      accessibilityRole="radio"
      accessibilityState={{selected: checked, disabled}}>
      <View
        style={[
          s.outerBase as ViewStyle,
          {width: dims.outer, height: dims.outer},
          (checked ? s.outerChecked : s.outerUnchecked) as ViewStyle,
        ]}>
        {checked && (
          <View
            style={[s.dot as ViewStyle, {width: dims.dot, height: dims.dot}]}
          />
        )}
      </View>
      {label != null && (
        <Text style={[s.label as TextStyle, {fontSize: dims.fontSize}]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: containerGap,
  },
});

Radio.displayName = 'Radio';
```

- [ ] **Step 15: Run native tests + typecheck**

Run: `pnpm jest --selectProjects native src/components/Radio/Radio.native.test.tsx`
Expected: PASS (4 tests).
Run: `pnpm typecheck` → PASS.

- [ ] **Step 16: Commit**

```bash
git add src/components/Radio
git commit -m "feat(Radio): cross-platform RadioGroup + Radio"
```

---

## Task 3: Register + stories + final verification

**Files:** `src/components/index.ts` + 4 story files.

- [ ] **Step 1: Register in `src/components/index.ts`**

Add `export * from './Checkbox';` (alphabetical: after `./Card`, before `./Chip`) and `export * from './Radio';` (after `./Progress`, before `./StatusDot`):

```ts
export * from './Card';
export * from './Checkbox';
export * from './Chip';
...
export * from './Progress';
export * from './Radio';
export * from './StatusDot';
```

- [ ] **Step 2: Create `src/components/Checkbox/Checkbox.web.stories.tsx`**

```tsx
import type {Meta, StoryObj} from '@storybook/react';
import React, {useState} from 'react';
import {Checkbox} from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  argTypes: {size: {control: 'select', options: ['sm', 'default', 'lg']}},
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

const ControlledDemo = () => {
  const [checked, setChecked] = useState(false);
  return <Checkbox checked={checked} onCheckedChange={setChecked} label="이용약관에 동의합니다" />;
};

export const Default: Story = {render: () => <ControlledDemo />};
export const Checked: Story = {args: {checked: true, label: '체크됨'}};
export const Indeterminate: Story = {args: {indeterminate: true, label: '일부 선택'}};
export const Disabled: Story = {args: {disabled: true, label: '비활성', checked: true}};
```

- [ ] **Step 3: Create `src/components/Checkbox/Checkbox.native.stories.tsx`**

```tsx
import type {Meta, StoryObj} from '@storybook/react-native';
import React, {useState} from 'react';
import {Checkbox} from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {size: {control: 'select', options: ['sm', 'default', 'lg']}},
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

const ControlledDemo = () => {
  const [checked, setChecked] = useState(false);
  return <Checkbox checked={checked} onCheckedChange={setChecked} label="이용약관에 동의합니다" />;
};

export const Default: Story = {render: () => <ControlledDemo />};
export const Checked: Story = {args: {checked: true, label: '체크됨'}};
export const Indeterminate: Story = {args: {indeterminate: true, label: '일부 선택'}};
export const Disabled: Story = {args: {disabled: true, label: '비활성', checked: true}};
```

- [ ] **Step 4: Create `src/components/Radio/Radio.web.stories.tsx`**

```tsx
import type {Meta, StoryObj} from '@storybook/react';
import React, {useState} from 'react';
import {RadioGroup, Radio} from './index';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Radio',
  component: RadioGroup,
  parameters: {layout: 'centered'},
};
export default meta;
type Story = StoryObj<typeof RadioGroup>;

function GroupDemo({disabled}: {disabled?: boolean}) {
  const [value, setValue] = useState('standard');
  return (
    <RadioGroup
      value={value}
      onValueChange={setValue}
      disabled={disabled}
      style={{display: 'flex', flexDirection: 'column', gap: 12}}>
      <Radio value="standard" label="일반 배송" />
      <Radio value="express" label="빠른 배송" />
      <Radio value="pickup" label="매장 픽업" />
    </RadioGroup>
  );
}

export const Default: Story = {render: () => <GroupDemo />};
export const Disabled: Story = {render: () => <GroupDemo disabled />};
```

- [ ] **Step 5: Create `src/components/Radio/Radio.native.stories.tsx`**

```tsx
import type {Meta, StoryObj} from '@storybook/react-native';
import React, {useState} from 'react';
import {RadioGroup, Radio} from './index';
import {Box} from '../Box';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof RadioGroup>;

function GroupDemo({disabled}: {disabled?: boolean}) {
  const [value, setValue] = useState('standard');
  return (
    <Box flexDirection="column" gap={12}>
      <RadioGroup value={value} onValueChange={setValue} disabled={disabled}>
        <Box flexDirection="column" gap={12}>
          <Radio value="standard" label="일반 배송" />
          <Radio value="express" label="빠른 배송" />
          <Radio value="pickup" label="매장 픽업" />
        </Box>
      </RadioGroup>
    </Box>
  );
}

export const Default: Story = {render: () => <GroupDemo />};
export const Disabled: Story = {render: () => <GroupDemo disabled />};
```

- [ ] **Step 6: Final verification**

Run: `pnpm typecheck` → PASS.
Run: `pnpm test` → all 3 projects green (existing + Checkbox web 6/native 4 + Radio web 5/native 4).
Run: `pnpm build` → PASS (commonjs/module/typescript).

- [ ] **Step 7: Commit**

```bash
git add src/components/index.ts src/components/Checkbox/*.stories.tsx src/components/Radio/*.stories.tsx
git commit -m "feat(Checkbox,Radio): register in components index + stories"
```

---

## Final (after all tasks)

- [ ] **Update memory:** append to `/Users/logan/.claude/projects/-Users-logan-Repository-wooBottle-externalProjects-woosign/memory/bottomsheet-component.md` noting Checkbox + Radio shipped (cross-platform, controlled, indeterminate checkbox, RadioGroup context + standalone Radio, dark-mode, tests + stories) and that this fills the form-primitives gap.

---

## Self-Review Notes

- **Spec coverage:** Checkbox API + behavior + a11y (Task 1); RadioGroup/Radio context + a11y (Task 2); tests web+native for both (Tasks 1-2); stories web+native (Task 3); registration (Task 3 Step 1); validation (Task 3 Step 6). Indeterminate (Task 1 Steps covering aria mixed + dash). controlled-only (no defaultChecked). All spec sections covered.
- **Type consistency:** `CheckboxSize`/`RadioSize` ('sm'|'default'|'lg') consistent; `getCheckboxStyles`/`getRadioStyles` return shapes (`boxBase`/`outerBase`, `glyph`/`dot`, `label`) used identically in web/native; `RadioContextValue` fields (`value`,`onValueChange`,`disabled`,`name`) set by both RadioGroup impls and read by both Radio impls; facades export the same names as index barrels.
- **Token check:** `actionPrimary`/`borderDefault`/`card`/`textInverse`/`foreground`, `borderRadius.sm/full`, `typography.fontWeight.medium/semibold`, `typography.fontSize.sm/base`, `spacing[2]` — all already used by existing components/styles.
- **No placeholders:** every file is complete.
```
