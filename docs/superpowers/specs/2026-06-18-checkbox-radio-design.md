# Checkbox + Radio 설계

**날짜:** 2026-06-18
**범위:** 폼 선택 프리미티브 두 가지 — `Checkbox`(indeterminate 포함)와 `RadioGroup` + `Radio` — 를 cross-platform(web + native)으로 추가한다.

## 목표

라이브러리에 Switch/Input은 있으나 Checkbox·Radio가 없다. 가장 흔히 쓰이는 누락 폼 입력을 채운다. Switch와 동일한 controlled API·파사드 구조·다크모드 메커니즘·사이즈 세트를 공유하고, 접근성(role/aria/accessibilityState)을 갖춘다.

## 비목표 (YAGNI)

- uncontrolled 모드(`defaultChecked`/`defaultValue`) — controlled 전용(Switch와 동일).
- RadioGroup 화살표키 로빙 네비게이션 — Tab 이동만 지원(arrow-key는 향후 향상).
- 폼 검증/제출 시맨틱(에러 메시지, name 기반 폼 직렬화 이상).
- 사이즈 외 시각 variant.

## 아키텍처

Switch와 동일한 파사드 패턴(Metro는 `.native` 우선, web 번들러/jest는 `.web` 우선; tsc는 `.tsx` 파사드). 스타일은 `useResolvedColors()` + 팩토리(`getCheckboxStyles(c)`/`getRadioStyles(c)`)로 다크모드 1일차 대응.

| 파일 | 책임 |
|---|---|
| `src/components/Checkbox/types.ts` | Checkbox props |
| `src/components/Checkbox/Checkbox.styles.ts` | `getCheckboxStyles(c)` + 사이즈 치수 |
| `src/components/Checkbox/Checkbox.web.tsx` / `.native.tsx` | 구현 |
| `src/components/Checkbox/Checkbox.tsx` | web 파사드 |
| `src/components/Checkbox/index.ts` | 배럴 |
| `src/components/Radio/types.ts` | RadioGroup/Radio props + RadioContextValue |
| `src/components/Radio/RadioContext.ts` | 그룹 상태 context |
| `src/components/Radio/Radio.styles.ts` | `getRadioStyles(c)` + 사이즈 치수 |
| `src/components/Radio/RadioGroup.web.tsx` / `.native.tsx` | 그룹 컨테이너 |
| `src/components/Radio/Radio.web.tsx` / `.native.tsx` | 개별 라디오 |
| `src/components/Radio/RadioGroup.tsx` / `Radio.tsx` | web 파사드 |
| `src/components/Radio/index.ts` | 배럴(RadioGroup + Radio + 타입) |
| `src/components/index.ts` | Checkbox·Radio 등록 |

## Checkbox API

```ts
export type CheckboxSize = 'sm' | 'default' | 'lg';

export interface CheckboxBaseProps {
  /** 체크 여부 (controlled). */
  checked?: boolean;
  /** 중간 상태 — 체크 대신 대시(–) 표시. checked보다 우선해 시각/aria에 반영. */
  indeterminate?: boolean;
  /** 값 변경 콜백. 누르면 onCheckedChange(!checked) 호출. */
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** 우측 라벨 텍스트. */
  label?: string;
  size?: CheckboxSize;
  testID?: string;
}
// Web: + className, style?: React.CSSProperties
// Native: + style?: ViewStyle, pressableProps?: Omit<PressableProps,'onPress'|'disabled'|'style'>
```

동작:
- 누르면(`disabled`가 아니면) `onCheckedChange?.(!checked)`. indeterminate 상태에서도 누르면 `!checked`를 전달한다(HTML 체크박스 동작과 동일 — indeterminate는 시각/aria 표시일 뿐 토글 값은 checked 기준).
- 시각: 사각 박스(borderRadius sm). 미체크 = `c.border` 보더 + 표면 bg; 체크 또는 indeterminate = `c.actionPrimary` bg + 글리프(체크=✓ 계열, indeterminate=대시). 글리프 색 `c.textInverse`. disabled = 투명도 낮춤. 라벨은 박스 우측(Switch 레이아웃 미러).
- a11y: web `role="checkbox"`, `aria-checked={indeterminate ? 'mixed' : !!checked}`, `aria-disabled`. native `accessibilityRole="checkbox"`, `accessibilityState={{checked: indeterminate ? 'mixed' : !!checked, disabled}}`.

## RadioGroup + Radio API

```ts
export type RadioSize = 'sm' | 'default' | 'lg';

export interface RadioGroupBaseProps {
  /** 현재 선택된 값 (controlled). */
  value?: string;
  onValueChange?: (value: string) => void;
  /** 그룹 전체 비활성. */
  disabled?: boolean;
  /** web 라디오 name 그룹(선택). */
  name?: string;
  children?: ReactNode;
  testID?: string;
}
// Web: + className, style; Native: + style

export interface RadioBaseProps {
  /** 이 라디오의 값(필수). */
  value: string;
  label?: string;
  /** 개별 비활성(그룹 disabled와 OR). */
  disabled?: boolean;
  size?: RadioSize;
  testID?: string;
}
// Web/Native style 동일 패턴

export interface RadioContextValue {
  value: string | undefined;
  onValueChange: ((value: string) => void) | undefined;
  disabled: boolean;
  name: string | undefined;
}
```

동작:
- `RadioGroup`이 `RadioContext`로 `{value, onValueChange, disabled, name}` 제공. web은 `role="radiogroup"` 래퍼, native는 View 래퍼.
- `Radio`는 context를 읽어 `checked = ctx.value === value`. 누르면(비활성 아니면) `ctx.onValueChange?.(value)`. `disabled = props.disabled || ctx.disabled`.
- 시각: 원형 아웃라인(미선택 = `c.border` 보더) — 선택 시 내부 채운 점(`c.actionPrimary`). 라벨 우측.
- a11y: web `role="radio"`, `aria-checked`, `aria-disabled`; native `accessibilityRole="radio"`, `accessibilityState={{selected: checked, disabled}}`.
- `Radio`가 `RadioGroup` 밖에서 쓰이면 context가 null → 안전하게 비선택·no-op(throw 안 함)으로 처리하되, 일반 사용은 그룹 내부 전제.

## 테스트

**Checkbox web** (`Checkbox.web.test.tsx`, jsdom):
- 라벨 렌더 + `role="checkbox"`.
- 클릭 → `onCheckedChange`가 `!checked`로 호출(checked=false→true, true→false).
- `aria-checked`가 checked 반영; `indeterminate` → `aria-checked="mixed"` + 대시 글리프 렌더.
- `disabled` → 클릭해도 `onCheckedChange` 미호출.
- 다크 표면 토큰(체크 상태 bg = `darkColors.actionPrimary`).

**Checkbox native** (`Checkbox.native.test.tsx`): 스모크 렌더 + press→`onCheckedChange(!checked)` + `disabled` no-op + 다크 토큰(`StyleSheet.flatten`).

**Radio web** (`Radio.web.test.tsx`):
- RadioGroup이 자식 Radio들 렌더 + `role="radiogroup"`/`role="radio"`.
- 미선택 Radio 클릭 → `onValueChange`가 그 value로 호출.
- `aria-checked`가 그룹 value와 일치하는 Radio만 true.
- 그룹 `disabled` → 클릭해도 `onValueChange` 미호출.
- 다크 토큰(선택 점 = `darkColors.actionPrimary`).

**Radio native** (`Radio.native.test.tsx`): 스모크 + 선택 press→`onValueChange(value)` + 다크 토큰.

## 스토리 (web + native)

- **Checkbox**: Default, Checked, Indeterminate, Disabled, (사이즈 쇼케이스 1).
- **Radio**: 그룹 데모(`useState`로 value 보유, 3개 옵션), Disabled 그룹.

## 검증

- `pnpm jest --selectProjects web` / `--selectProjects native` 그린.
- `pnpm typecheck` PASS, `pnpm build` PASS.
- CI-스코프 lint prettier-clean.
