# Card / Input 웹 커버리지 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 스토리·테스트가 전무한 Card, Input 두 컴포넌트에 웹 Storybook 스토리와 jsdom 웹 테스트를 추가한다.

**Architecture:** 컴포넌트/스타일 코드는 무손상. 각 컴포넌트마다 `*.web.stories.tsx`(시각 시연) + `*.web.test.tsx`(동작/토큰 회귀)를 추가한다. 테스트는 기존 Badge(토큰 `toHaveStyle`) + Button(`userEvent`/`onPress`) 웹 테스트 규약을, 스토리는 Switch/Dialog 스토리(`useState` 제어형 데모) 규약을 따른다.

**Tech Stack:** `@testing-library/react` + `@testing-library/user-event` + jest(jsdom `web` 프로젝트, testMatch `*.web.test.tsx`), `@storybook/react`.

**Spec:** `docs/superpowers/specs/2026-06-14-card-input-web-coverage-design.md`

---

## File Structure

```
src/components/Card/Card.web.test.tsx      # CREATE: Card 동작/토큰 테스트
src/components/Card/Card.web.stories.tsx   # CREATE: Card 시각 시연
src/components/Input/Input.web.test.tsx    # CREATE: Input 동작/토큰 테스트
src/components/Input/Input.web.stories.tsx # CREATE: Input 시각 시연 (date 포함)
```

테스트/스토리는 facade(`./Card`, `./Input`)에서 import한다 — web 프로젝트의 `moduleFileExtensions`가 `.web.tsx`를 우선 해석한다(Button.web.test가 `'./Button'`을 쓰는 것과 동일).

검증된 토큰 (Card.styles.ts / Input.styles.ts에서 확인):
- Card 배경: default `colors.card`, inverse `colors.inverse`, forest `colors.actionForest`.
- Input 컨테이너: error border `colors.actionDanger`; size 높이 sm 36 / default 44 / lg 52.
- Input의 variant·size 스타일은 **컨테이너 div**에 있고 `data-testid`/`placeholder`는 내부 `<input>`에 있다 → 컨테이너 단언 시 `input.parentElement` 사용.

---

### Task 1: Card 웹 테스트 + 스토리

**Files:**
- Create: `src/components/Card/Card.web.test.tsx`
- Create: `src/components/Card/Card.web.stories.tsx`

- [ ] **Step 1: 실패 테스트 작성**

`src/components/Card/Card.web.test.tsx`:

```tsx
/**
 * Web harness tests for Card. jsdom 환경, .web.tsx 구현을 사용한다.
 */
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Card} from './Card';
import {colors} from '../../core/theme/tokens';

describe('Card (web)', () => {
  it('renders its children', () => {
    render(<Card>섬 콘텐츠</Card>);
    expect(screen.getByText('섬 콘텐츠')).toBeInTheDocument();
  });

  it('default variant uses the card surface token', () => {
    render(
      <Card testID="card">
        <span>본문</span>
      </Card>,
    );
    expect(screen.getByTestId('card')).toHaveStyle({
      backgroundColor: colors.card,
    });
  });

  it('inverse variant uses the ink feature-band surface', () => {
    render(
      <Card variant="inverse" testID="card">
        <span>본문</span>
      </Card>,
    );
    expect(screen.getByTestId('card')).toHaveStyle({
      backgroundColor: colors.inverse,
    });
  });

  it('forest variant uses the evergreen surface', () => {
    render(
      <Card variant="forest" testID="card">
        <span>본문</span>
      </Card>,
    );
    expect(screen.getByTestId('card')).toHaveStyle({
      backgroundColor: colors.actionForest,
    });
  });

  it('becomes a button and calls onPress when interactive', async () => {
    const onPress = jest.fn();
    render(
      <Card onPress={onPress} testID="card">
        <span>본문</span>
      </Card>,
    );
    const card = screen.getByRole('button');
    expect(card).toBeInTheDocument();
    await userEvent.click(card);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', async () => {
    const onPress = jest.fn();
    render(
      <Card onPress={onPress} disabled testID="card">
        <span>본문</span>
      </Card>,
    );
    await userEvent.click(screen.getByTestId('card'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('is not a button when no onPress is given', () => {
    render(
      <Card testID="card">
        <span>본문</span>
      </Card>,
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `pnpm test -- --selectProjects web Card.web.test`
Expected: FAIL — `Cannot find module './Card.web.test'`는 아니고, 파일은 있으나 아직 스토리 미작성. 실제로는 이 시점에 7개 테스트가 모두 PASS여야 한다(Card 구현은 이미 존재). 만약 어떤 테스트가 FAIL이면 그 단언이 실제 구현과 다른 것이므로, 구현(`Card.web.tsx`/`Card.styles.ts`)을 읽어 실제 토큰/배선에 맞게 그 테스트만 수정한다(구현 코드는 바꾸지 않는다).

- [ ] **Step 3: 테스트 통과 확인**

Run: `pnpm test -- --selectProjects web Card.web.test`
Expected: PASS (7 tests).

- [ ] **Step 4: 스토리 작성**

`src/components/Card/Card.web.stories.tsx`:

```tsx
import type {Meta, StoryObj} from '@storybook/react';
import React from 'react';
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from './Card';
import {Button} from '../Button';
import {Text} from '../Text';
import type {CardVariant} from './types';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {layout: 'centered'},
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost', 'warm', 'ceramic', 'inverse', 'forest'],
    },
    fullWidth: {control: 'boolean'},
    disabled: {control: 'boolean'},
  },
};
export default meta;

type Story = StoryObj<typeof Card>;

const VARIANTS: CardVariant[] = [
  'default',
  'outline',
  'ghost',
  'warm',
  'ceramic',
  'inverse',
  'forest',
];

export const Default: Story = {
  render: () => (
    <Card variant="default" style={{width: 320}}>
      <CardHeader>
        <CardTitle>멤버십 카드</CardTitle>
        <CardDescription>cream 캔버스 위 흰 섬.</CardDescription>
      </CardHeader>
      <CardContent>
        <Text>본문 콘텐츠 영역입니다.</Text>
      </CardContent>
      <CardFooter>
        <Button>확인</Button>
      </CardFooter>
    </Card>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{display: 'flex', flexDirection: 'column', gap: 16, width: 320}}>
      {VARIANTS.map(v => (
        <Card key={v} variant={v} style={{padding: 16}}>
          <Text>{v}</Text>
        </Card>
      ))}
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Card variant="default" onPress={() => undefined} style={{width: 320, padding: 16}}>
      <Text>탭 가능한 카드 (role=button)</Text>
    </Card>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Card variant="default" onPress={() => undefined} disabled style={{width: 320, padding: 16}}>
      <Text>비활성 카드</Text>
    </Card>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <Card variant="ceramic" fullWidth style={{padding: 16}}>
      <Text>fullWidth 카드</Text>
    </Card>
  ),
};
```

작성 전 `src/components/Card/Card.web.tsx`를 확인해 `CardHeader/CardTitle/CardDescription/CardContent/CardFooter`가 실제 export되는지, `style` prop을 받는지 검증한다. 시그니처가 다르면 실제에 맞춰 조정한다(스토리는 typecheck로 검증된다).

- [ ] **Step 5: typecheck + 커밋**

Run: `pnpm typecheck`
Expected: 클린.

```bash
git add src/components/Card/Card.web.test.tsx src/components/Card/Card.web.stories.tsx
git commit -m "test(Card): add web tests + storybook stories

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Input 웹 테스트 + 스토리

**Files:**
- Create: `src/components/Input/Input.web.test.tsx`
- Create: `src/components/Input/Input.web.stories.tsx`

- [ ] **Step 1: 실패 테스트 작성**

`src/components/Input/Input.web.test.tsx`:

```tsx
/**
 * Web harness tests for Input. jsdom 환경, .web.tsx 구현을 사용한다.
 * date picker(Calendar) 동작은 범위 밖 — 스토리에서만 시연한다.
 */
import {render, screen, fireEvent} from '@testing-library/react';
import {Input} from './Input';
import {colors} from '../../core/theme/tokens';

describe('Input (web)', () => {
  it('renders the placeholder', () => {
    render(<Input placeholder="이름을 입력하세요" testID="name" />);
    expect(screen.getByPlaceholderText('이름을 입력하세요')).toBeInTheDocument();
  });

  it('calls onChangeText with the typed value', () => {
    const onChangeText = jest.fn();
    render(<Input testID="name" onChangeText={onChangeText} />);
    fireEvent.change(screen.getByTestId('name'), {target: {value: '우병'}});
    expect(onChangeText).toHaveBeenCalledWith('우병');
  });

  it('reflects the disabled attribute on the input', () => {
    render(<Input testID="name" disabled />);
    expect(screen.getByTestId('name')).toBeDisabled();
  });

  it('reflects the readOnly attribute on the input', () => {
    render(<Input testID="name" readOnly />);
    expect(screen.getByTestId('name')).toHaveAttribute('readonly');
  });

  it('error variant uses the danger border on the container', () => {
    render(<Input testID="name" variant="error" />);
    const container = screen.getByTestId('name').parentElement as HTMLElement;
    expect(container).toHaveStyle({borderColor: colors.actionDanger});
  });

  it('sm size applies the smaller container height', () => {
    render(<Input testID="name" size="sm" />);
    const container = screen.getByTestId('name').parentElement as HTMLElement;
    expect(container).toHaveStyle({height: '36px'});
  });

  it('renders left and right icons', () => {
    render(
      <Input
        testID="name"
        leftIcon={<span>L</span>}
        rightIcon={<span>R</span>}
      />,
    );
    expect(screen.getByText('L')).toBeInTheDocument();
    expect(screen.getByText('R')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 테스트 실패/통과 확인**

Run: `pnpm test -- --selectProjects web Input.web.test`
Expected: PASS (7 tests) — Input 구현은 이미 존재한다. 어떤 단언이 FAIL이면 실제 구현(`Input.web.tsx`/`Input.styles.ts`)을 읽어 그 테스트만 실제 배선에 맞게 고친다. 특히 확인할 것:
- 컨테이너가 `getByTestId(id).parentElement`가 맞는지(아이콘이 있으면 input의 형제가 span, 부모가 컨테이너 div — 부모 div가 맞다).
- `error` border가 컨테이너에 적용되는지, size 높이가 컨테이너에 `36px`로 렌더되는지. 만약 height가 숫자가 아닌 다른 단위/위치면 실제 값에 맞춘다(구현 변경 금지).

- [ ] **Step 3: 테스트 통과 확인**

Run: `pnpm test -- --selectProjects web Input.web.test`
Expected: PASS (7 tests).

- [ ] **Step 4: 스토리 작성**

`src/components/Input/Input.web.stories.tsx`:

```tsx
import type {Meta, StoryObj} from '@storybook/react';
import React, {useState} from 'react';
import {Input} from './Input';
import {Box} from '../Box';
import {Text} from '../Text';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {layout: 'centered'},
  argTypes: {
    variant: {control: 'select', options: ['default', 'error']},
    size: {control: 'select', options: ['sm', 'default', 'lg']},
    disabled: {control: 'boolean'},
    readOnly: {control: 'boolean'},
  },
};
export default meta;

type Story = StoryObj<typeof Input>;

function ControlledInput(props: React.ComponentProps<typeof Input>) {
  const [value, setValue] = useState('');
  return <Input {...props} value={value} onChangeText={setValue} />;
}

export const Default: Story = {
  render: () => <ControlledInput placeholder="이름을 입력하세요" />,
};

export const Error: Story = {
  render: () => (
    <ControlledInput variant="error" placeholder="잘못된 입력" />
  ),
};

export const Sizes: Story = {
  render: () => (
    <Box style={{display: 'flex', flexDirection: 'column', gap: 12, width: 280}}>
      <ControlledInput size="sm" placeholder="sm" />
      <ControlledInput size="default" placeholder="default" />
      <ControlledInput size="lg" placeholder="lg" />
    </Box>
  ),
};

export const Disabled: Story = {
  render: () => <ControlledInput disabled placeholder="비활성" />,
};

export const ReadOnly: Story = {
  render: () => <Input value="읽기 전용" readOnly />,
};

export const WithIcons: Story = {
  render: () => (
    <ControlledInput
      leftIcon={<Text>🔍</Text>}
      rightIcon={<Text>✕</Text>}
      placeholder="검색"
    />
  ),
};

export const Multiline: Story = {
  render: () => (
    <ControlledInput multiline numberOfLines={4} placeholder="여러 줄 입력" />
  ),
};

export const Date: Story = {
  render: () => <ControlledInput type="date" placeholder="날짜 선택" />,
};
```

작성 전 `src/components/Input/Input.web.tsx`에서 `multiline`/`numberOfLines`/`type="date"`/`leftIcon`/`rightIcon` prop이 실제 존재하는지 확인한다(types.ts에서 이미 확인됨 — 모두 존재). `ControlledInput`의 props 타입이 typecheck를 통과하는지 확인한다.

- [ ] **Step 5: 전체 검증 + 커밋**

Run: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`
Expected: typecheck 클린; lint 0 errors(스토리 제외); web 프로젝트가 새 테스트 2개 픽업해 전체 그린; build 성공(스토리·테스트 제외).

```bash
git add src/components/Input/Input.web.test.tsx src/components/Input/Input.web.stories.tsx
git commit -m "test(Input): add web tests + storybook stories (date picker demo)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
