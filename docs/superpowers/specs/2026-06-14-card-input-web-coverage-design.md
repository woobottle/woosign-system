# Card / Input 웹 커버리지 설계

> @woosign/ui — 현재 스토리·테스트가 전무한 두 컴포넌트(Card, Input)에 웹 Storybook
> 스토리와 jsdom 웹 테스트를 추가한다. 컴포넌트/스타일 구현은 무손상으로 둔다.

## 목표

디자인 시스템에서 스토리·테스트가 0개인 유일한 두 컴포넌트(Card, Input)의 웹
커버리지를 채워, 시각 회귀 확인(Storybook)과 동작 회귀 방지(jest web 프로젝트)를
가능하게 한다. 기존 Badge(토큰 `toHaveStyle` 검증) + Dialog(동작 검증) 웹 테스트
규약을 그대로 따른다.

## 비목표 (이번 범위 제외)

- 네이티브 스토리/테스트 — audit에서 별도 백필 항목으로 분리됨.
- Input의 date picker(`Calendar.web` 팝오버) **동작 테스트** — 스토리로만 시연하고
  테스트는 제외(YAGNI; Calendar는 별도 컴포넌트라 자체 커버리지 작업으로 분리).
- 컴포넌트/스타일 코드 변경 — 순수 테스트·스토리 추가 작업.

## 파일 (4개 신규)

```
src/components/Card/Card.web.stories.tsx
src/components/Card/Card.web.test.tsx
src/components/Input/Input.web.stories.tsx
src/components/Input/Input.web.test.tsx
```

## 검증된 토큰/배선 (테스트 단언 근거)

**Card** (`Card.styles.ts` variant → 배경):
- `default` → `colors.card`
- `inverse` → `colors.inverse`
- `forest` → `colors.actionForest`
- `outline` → 배경 transparent, border `colors.borderDefault`
- (warm `colors.reward`, ceramic `colors.section`, ghost transparent — 스토리에서 시연)

`Card.web.tsx` 배선: `data-testid={testID}`; `onPress` 지정 시 `role="button"` +
`onClick` 연결 + `tabIndex=0`; `disabled && onPress`면 클릭해도 onPress 미호출;
`onPress` 없으면 `role`/`onClick` 모두 없음(비인터랙티브).

**Input** (`Input.styles.ts`):
- 컨테이너 variant: `default` border `colors.borderDefault`; `error` border
  `colors.actionDanger` + 배경 `colors.errorTint`.
- 컨테이너 size 높이: `sm` 36 / `default` 44 / `lg` 52.
- **중요:** variant·size 스타일은 **컨테이너 div**에 적용되고, `data-testid`와
  `placeholder`는 내부 `<input>`에 있다. 따라서 컨테이너 스타일을 단언할 때는
  `screen.getByTestId(id)` 또는 `screen.getByPlaceholderText(...)`로 input을 잡은 뒤
  `.parentElement`(컨테이너 div)에 `toHaveStyle`을 적용한다.
- `<input>`은 `disabled`, `readOnly`, `placeholder`, `onChange`(→ `onChangeText`)를
  받는다. `leftIcon`/`rightIcon`은 컨테이너 안 `<span>`으로 렌더된다.

## Card 테스트 (`Card.web.test.tsx`, jsdom)

1. children을 렌더한다.
2. `default` variant 배경이 `colors.card`.
3. `inverse` variant 배경이 `colors.inverse`.
4. `forest` variant 배경이 `colors.actionForest`.
5. `onPress` 지정 시 `role="button"`이고, 클릭하면 `onPress`가 1회 호출된다.
6. `disabled`(+`onPress`)면 클릭해도 `onPress`가 호출되지 않는다.
7. `onPress`가 없으면 `role`이 없다(비인터랙티브 — `screen.queryByRole('button')`가 null).

## Card 스토리 (`Card.web.stories.tsx`)

`title: 'Components/Card'`, `layout: 'centered'`. 스토리: 각 variant 7종(또는
대표 묶음 + AllVariants 갤러리), Interactive(`onPress` 지정), Disabled, FullWidth.
기존 Badge/Switch 스토리의 데모 함수 구성을 따른다.

## Input 테스트 (`Input.web.test.tsx`, jsdom — date 제외)

1. `placeholder`를 렌더한다(`getByPlaceholderText`).
2. 타이핑하면 `onChangeText`가 입력 텍스트로 호출된다(`userEvent.type` 또는
   `fireEvent.change`로 값 변경 → 콜백 인자 확인).
3. `disabled`면 `<input>`에 `disabled` 속성이 있다.
4. `readOnly`면 `<input>`에 `readOnly` 속성이 있다.
5. `variant="error"`면 컨테이너(input의 `parentElement`) border가 `colors.actionDanger`.
6. `size="sm"` 컨테이너 높이 36이 `size="default"`(44)와 다르다 — `sm` 높이 36 단언.
7. `leftIcon`/`rightIcon`을 렌더한다(아이콘 노드 텍스트/testID로 확인).

## Input 스토리 (`Input.web.stories.tsx`)

`title: 'Components/Input'`, `layout: 'centered'`. 스토리: Default, Error(variant),
Sizes(sm/default/lg), Disabled, ReadOnly, WithIcons(left/right), Multiline,
**Date**(`type="date"` — Calendar 팝오버 시연, 스토리 전용). 제어형 데모는
`useState`로 value/onChangeText를 묶는다(Dialog 스토리의 `useState` 패턴과 동일).

## 검증 (완료 기준)

- `pnpm test` — web 프로젝트가 새 `*.web.test.tsx` 2개를 자동 픽업, 전체 그린.
- `pnpm typecheck` — 스토리 포함 클린.
- `pnpm lint` — 0 errors(CI lint는 `*.stories` 제외, 테스트 파일 포함).
- `pnpm build` — 영향 없음(스토리·테스트는 빌드/tarball 제외).
