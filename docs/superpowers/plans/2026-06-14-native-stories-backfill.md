# Native Stories Backfill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `@storybook/react-native` stories (`X.native.stories.tsx`) for the 14 components that have web stories but no native story, scoped to a core showcase (Default + key variants).

**Architecture:** Pure additive — one new `X.native.stories.tsx` per component, no source changes. Each file follows the existing native-story convention (Badge/Box/Button/Switch/Text): `Meta<typeof X>` with `title: 'Components/X'`, `tags: ['autodocs']`, `argTypes`/`args`, then `Default` + 1-3 representative stories built from `Box`/`Text` (never web `div`/`<p>`). Stateful/controlled components use a named `XDemo` component holding `useState` to satisfy hook rules.

**Tech Stack:** TypeScript, React Native, `@storybook/react-native`, the local `@woosign/ui` components.

**Validation per task:** Stories are visual artifacts with no automated tests. The cycle is **write → `pnpm typecheck` → commit** (no TDD). `pnpm typecheck` runs `tsc` over `src/**` including native stories, so every story must compile. Stories are excluded from CI lint (`eslint "src/components/**/!(*.stories).tsx"`) and from the build/tarball (`*.stories` glob), but author them prettier-clean (2-space indent, single quotes, trailing commas, no semicolon-less lines) to match the repo.

**Reference before starting:** Read `src/components/Switch/Switch.native.stories.tsx` (the canonical pattern: `ControlledDemo` named component, `argTypes`, `AllSizes` map-render story). When in doubt about a component's exact prop names/values, read that component's `types.ts` — it is the source of truth; fix any typecheck error against it.

---

## File Structure

One new file per component (14 total), each self-contained:

```
src/components/BottomSheet/BottomSheet.native.stories.tsx   — stateful (useState + Button trigger)
src/components/Card/Card.native.stories.tsx                 — variant showcase + interactive
src/components/Chip/Chip.native.stories.tsx                 — tone showcase
src/components/Dialog/Dialog.native.stories.tsx             — stateful, size showcase
src/components/Divider/Divider.native.stories.tsx           — orientation + inverse
src/components/Eyebrow/Eyebrow.native.stories.tsx           — tone showcase
src/components/Fab/Fab.native.stories.tsx                   — tone showcase (glyph child)
src/components/FeatureBand/FeatureBand.native.stories.tsx   — hero composition
src/components/Input/Input.native.stories.tsx               — controlled + variants/sizes
src/components/Pill/Pill.native.stories.tsx                 — active + controlled filter
src/components/Progress/Progress.native.stories.tsx         — tone + inverse surface
src/components/StatusDot/StatusDot.native.stories.tsx       — tone showcase
src/components/Tabs/Tabs.native.stories.tsx                 — controlled + inverse
src/components/Toast/Toast.native.stories.tsx               — tone showcase + stack
```

Each task is independent. The per-task commit command is the same shape:

```bash
git add src/components/<Name>/<Name>.native.stories.tsx
git commit -m "feat(<Name>): native storybook stories"
```

And each task's typecheck step is identical:

Run: `pnpm typecheck`
Expected: PASS (exit 0, no errors). If errors mention the new file, fix prop names against `src/components/<Name>/types.ts` and re-run until clean.

---

### Task 1: BottomSheet native stories

**Files:**
- Create: `src/components/BottomSheet/BottomSheet.native.stories.tsx`

- [ ] **Step 1: Write the story file**

```tsx
import type {Meta, StoryObj} from '@storybook/react-native';
import React, {useState} from 'react';
import {Text} from 'react-native';
import {BottomSheet} from './BottomSheet';
import {Button} from '../Button';

const meta: Meta<typeof BottomSheet> = {
  title: 'Components/BottomSheet',
  component: BottomSheet,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof BottomSheet>;

function SheetDemo({
  dragToClose,
  closeOnScrimClick,
}: {
  dragToClose?: boolean;
  closeOnScrimClick?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onPress={() => setOpen(true)}>BottomSheet 열기</Button>
      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        dragToClose={dragToClose}
        closeOnScrimClick={closeOnScrimClick}>
        <BottomSheet.Header>
          <BottomSheet.Title>옵션 선택</BottomSheet.Title>
          <BottomSheet.Description>하나를 골라주세요.</BottomSheet.Description>
        </BottomSheet.Header>
        <BottomSheet.Body>
          <Text>본문 콘텐츠</Text>
        </BottomSheet.Body>
        <BottomSheet.Footer>
          <Button variant="secondary" onPress={() => setOpen(false)}>
            닫기
          </Button>
          <Button onPress={() => setOpen(false)}>확인</Button>
        </BottomSheet.Footer>
      </BottomSheet>
    </>
  );
}

export const Default: Story = {render: () => <SheetDemo />};
export const NoDrag: Story = {render: () => <SheetDemo dragToClose={false} />};
export const NoScrimClose: Story = {
  render: () => <SheetDemo closeOnScrimClick={false} />,
};
```

- [ ] **Step 2: Typecheck** — Run `pnpm typecheck`. Expected: PASS.
- [ ] **Step 3: Commit** — `git add src/components/BottomSheet/BottomSheet.native.stories.tsx && git commit -m "feat(BottomSheet): native storybook stories"`

---

### Task 2: Card native stories

**Files:**
- Create: `src/components/Card/Card.native.stories.tsx`

Card variants: `'default' | 'outline' | 'ghost' | 'warm' | 'ceramic' | 'inverse' | 'forest'`. Subcomponents: `Card.Header`, `Card.Title`, `Card.Description`, `Card.Content`, `Card.Footer`. Interactive via `onPress`.

- [ ] **Step 1: Write the story file**

```tsx
import type {Meta, StoryObj} from '@storybook/react-native';
import React from 'react';
import {Card} from './Card';
import {Box} from '../Box';
import {Text} from '../Text';
import {Button} from '../Button';
import type {CardVariant} from './types';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost', 'warm', 'ceramic', 'inverse', 'forest'],
    },
    fullWidth: {control: 'boolean'},
    disabled: {control: 'boolean'},
  },
  args: {variant: 'default'},
};
export default meta;
type Story = StoryObj<typeof Card>;

const SampleCard = ({variant}: {variant?: CardVariant}) => (
  <Card variant={variant}>
    <Card.Header>
      <Card.Title>오늘의 추천</Card.Title>
      <Card.Description>따뜻한 한 잔으로 시작하세요.</Card.Description>
    </Card.Header>
    <Card.Content>
      <Text>아메리카노, 라떼, 콜드브루를 준비했어요.</Text>
    </Card.Content>
    <Card.Footer>
      <Button>주문하기</Button>
    </Card.Footer>
  </Card>
);

export const Default: Story = {
  render: () => <SampleCard />,
};

export const AllVariants: Story = {
  render: () => {
    const variants: CardVariant[] = [
      'default',
      'outline',
      'ghost',
      'warm',
      'ceramic',
      'inverse',
      'forest',
    ];
    return (
      <Box flexDirection="column" gap={16}>
        {variants.map(variant => (
          <SampleCard key={variant} variant={variant} />
        ))}
      </Box>
    );
  },
};

export const Interactive: Story = {
  render: () => (
    <Card onPress={() => {}}>
      <Card.Header>
        <Card.Title>눌러보세요</Card.Title>
        <Card.Description>onPress가 있는 인터랙티브 카드입니다.</Card.Description>
      </Card.Header>
    </Card>
  ),
};
```

- [ ] **Step 2: Typecheck** — Run `pnpm typecheck`. Expected: PASS.
- [ ] **Step 3: Commit** — `git add src/components/Card/Card.native.stories.tsx && git commit -m "feat(Card): native storybook stories"`

---

### Task 3: Chip native stories

**Files:**
- Create: `src/components/Chip/Chip.native.stories.tsx`

Chip tones: `'default' | 'solid' | 'outline'`. Props: `onPress`, `disabled`, `leftAdornment`, `rightAdornment`.

- [ ] **Step 1: Write the story file**

```tsx
import type {Meta, StoryObj} from '@storybook/react-native';
import React from 'react';
import {Chip} from './Chip';
import {Box} from '../Box';
import type {ChipTone} from './types';

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    tone: {control: 'select', options: ['default', 'solid', 'outline']},
    disabled: {control: 'boolean'},
  },
  args: {tone: 'default', children: 'Chip'},
};
export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  args: {children: 'Default'},
};

export const AllTones: Story = {
  render: () => {
    const tones: ChipTone[] = ['default', 'solid', 'outline'];
    return (
      <Box flexDirection="row" flexWrap="wrap" gap={8}>
        {tones.map(tone => (
          <Chip key={tone} tone={tone}>
            {tone.charAt(0).toUpperCase() + tone.slice(1)}
          </Chip>
        ))}
      </Box>
    );
  },
};

export const Disabled: Story = {
  args: {disabled: true, children: 'Disabled'},
};
```

- [ ] **Step 2: Typecheck** — Run `pnpm typecheck`. Expected: PASS.
- [ ] **Step 3: Commit** — `git add src/components/Chip/Chip.native.stories.tsx && git commit -m "feat(Chip): native storybook stories"`

---

### Task 4: Dialog native stories

**Files:**
- Create: `src/components/Dialog/Dialog.native.stories.tsx`

Dialog sizes: `'sm' | 'md' | 'lg'`. Subcomponents: `Dialog.Header`, `Dialog.Title`, `Dialog.Description`, `Dialog.Body`, `Dialog.Footer`. Stateful (`open`/`onClose`).

- [ ] **Step 1: Write the story file**

```tsx
import type {Meta, StoryObj} from '@storybook/react-native';
import React, {useState} from 'react';
import {Text} from 'react-native';
import {Dialog} from './Dialog';
import {Button} from '../Button';
import type {DialogSize} from './types';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Dialog>;

function DialogDemo({size}: {size?: DialogSize}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onPress={() => setOpen(true)}>Dialog 열기</Button>
      <Dialog open={open} onClose={() => setOpen(false)} size={size}>
        <Dialog.Header>
          <Dialog.Title>주문을 취소할까요?</Dialog.Title>
          <Dialog.Description>이 작업은 되돌릴 수 없습니다.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <Text>취소하면 적립된 스타가 사라집니다.</Text>
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="secondary" onPress={() => setOpen(false)}>
            유지
          </Button>
          <Button onPress={() => setOpen(false)}>취소하기</Button>
        </Dialog.Footer>
      </Dialog>
    </>
  );
}

export const Default: Story = {render: () => <DialogDemo />};
export const Small: Story = {render: () => <DialogDemo size="sm" />};
export const Large: Story = {render: () => <DialogDemo size="lg" />};
```

- [ ] **Step 2: Typecheck** — Run `pnpm typecheck`. Expected: PASS.
- [ ] **Step 3: Commit** — `git add src/components/Dialog/Dialog.native.stories.tsx && git commit -m "feat(Dialog): native storybook stories"`

---

### Task 5: Divider native stories

**Files:**
- Create: `src/components/Divider/Divider.native.stories.tsx`

Divider: `tone: 'default' | 'inverse'`, `orientation: 'horizontal' | 'vertical'`.

- [ ] **Step 1: Write the story file**

```tsx
import type {Meta, StoryObj} from '@storybook/react-native';
import React from 'react';
import {Divider} from './Divider';
import {Box} from '../Box';
import {Text} from '../Text';

const meta: Meta<typeof Divider> = {
  title: 'Components/Divider',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    tone: {control: 'select', options: ['default', 'inverse']},
    orientation: {control: 'select', options: ['horizontal', 'vertical']},
  },
};
export default meta;
type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {
  render: () => (
    <Box width={320} gap={12}>
      <Text>위 콘텐츠</Text>
      <Divider />
      <Text>아래 콘텐츠</Text>
    </Box>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Box flexDirection="row" alignItems="center" gap={12} height={24}>
      <Text>메뉴</Text>
      <Divider orientation="vertical" />
      <Text>주문</Text>
      <Divider orientation="vertical" />
      <Text>즐겨찾기</Text>
    </Box>
  ),
};

export const Inverse: Story = {
  render: () => (
    <Box backgroundColor="#171513" padding={24} borderRadius="md" gap={12}>
      <Text color="#FFFFFF">위 콘텐츠</Text>
      <Divider tone="inverse" />
      <Text color="#FFFFFF">아래 콘텐츠</Text>
    </Box>
  ),
};
```

- [ ] **Step 2: Typecheck** — Run `pnpm typecheck`. Expected: PASS.
- [ ] **Step 3: Commit** — `git add src/components/Divider/Divider.native.stories.tsx && git commit -m "feat(Divider): native storybook stories"`

---

### Task 6: Eyebrow native stories

**Files:**
- Create: `src/components/Eyebrow/Eyebrow.native.stories.tsx`

Eyebrow tones: `'default' | 'brand' | 'gold' | 'inverse'`. (The web-only `as` prop is omitted in native.)

- [ ] **Step 1: Write the story file**

```tsx
import type {Meta, StoryObj} from '@storybook/react-native';
import React from 'react';
import {Eyebrow} from './Eyebrow';
import {Box} from '../Box';
import type {EyebrowTone} from './types';

const meta: Meta<typeof Eyebrow> = {
  title: 'Components/Eyebrow',
  component: Eyebrow,
  tags: ['autodocs'],
  argTypes: {
    tone: {control: 'select', options: ['default', 'brand', 'gold', 'inverse']},
  },
  args: {tone: 'default', children: 'This week'},
};
export default meta;
type Story = StoryObj<typeof Eyebrow>;

export const Default: Story = {
  args: {children: 'This week'},
};

export const AllTones: Story = {
  render: () => {
    const tones: EyebrowTone[] = ['default', 'brand', 'gold', 'inverse'];
    return (
      <Box backgroundColor="#171513" padding={24} borderRadius="md" gap={12}>
        {tones.map(tone => (
          <Eyebrow key={tone} tone={tone}>
            {tone.toUpperCase()}
          </Eyebrow>
        ))}
      </Box>
    );
  },
};
```

Note: `AllTones` uses a dark background so the `inverse` tone is visible alongside the others.

- [ ] **Step 2: Typecheck** — Run `pnpm typecheck`. Expected: PASS.
- [ ] **Step 3: Commit** — `git add src/components/Eyebrow/Eyebrow.native.stories.tsx && git commit -m "feat(Eyebrow): native storybook stories"`

---

### Task 7: Fab native stories

**Files:**
- Create: `src/components/Fab/Fab.native.stories.tsx`

Fab: `tone: 'ember' | 'ink' | 'gold'`, `size: 'default' | 'lg'`, `accessibilityLabel` (required), `onPress`. Icon child is a `<Text>＋</Text>` glyph (no SVG).

- [ ] **Step 1: Write the story file**

```tsx
import type {Meta, StoryObj} from '@storybook/react-native';
import React from 'react';
import {Text} from 'react-native';
import {Fab} from './Fab';
import {Box} from '../Box';
import type {FabTone} from './types';

const meta: Meta<typeof Fab> = {
  title: 'Components/Fab',
  component: Fab,
  tags: ['autodocs'],
  argTypes: {
    tone: {control: 'select', options: ['ember', 'ink', 'gold']},
    size: {control: 'select', options: ['default', 'lg']},
  },
  args: {tone: 'ember', size: 'default', accessibilityLabel: 'Add'},
};
export default meta;
type Story = StoryObj<typeof Fab>;

export const Default: Story = {
  render: args => (
    <Fab {...args}>
      <Text style={{color: '#FFFFFF', fontSize: 24}}>＋</Text>
    </Fab>
  ),
};

export const AllTones: Story = {
  render: () => {
    const tones: FabTone[] = ['ember', 'ink', 'gold'];
    return (
      <Box flexDirection="row" gap={16}>
        {tones.map(tone => (
          <Fab key={tone} tone={tone} accessibilityLabel={`Add (${tone})`}>
            <Text style={{color: '#FFFFFF', fontSize: 24}}>＋</Text>
          </Fab>
        ))}
      </Box>
    );
  },
};
```

- [ ] **Step 2: Typecheck** — Run `pnpm typecheck`. Expected: PASS.
- [ ] **Step 3: Commit** — `git add src/components/Fab/Fab.native.stories.tsx && git commit -m "feat(Fab): native storybook stories"`

---

### Task 8: FeatureBand native stories

**Files:**
- Create: `src/components/FeatureBand/FeatureBand.native.stories.tsx`

FeatureBand: `tone: 'inverse' | 'ember' | 'reward' | 'forest'`, `rounded`. Composes Eyebrow + Text headings + Progress + Buttons. Web used `<div>` with fontSize/fontWeight — translate to `<Text>` with `style`.

- [ ] **Step 1: Write the story file**

```tsx
import type {Meta, StoryObj} from '@storybook/react-native';
import React from 'react';
import {Text} from 'react-native';
import {FeatureBand} from './FeatureBand';
import {Eyebrow} from '../Eyebrow';
import {Button} from '../Button';
import {Progress} from '../Progress';
import {Box} from '../Box';

const meta: Meta<typeof FeatureBand> = {
  title: 'Components/FeatureBand',
  component: FeatureBand,
  tags: ['autodocs'],
  argTypes: {
    tone: {control: 'select', options: ['inverse', 'ember', 'reward', 'forest']},
    rounded: {control: 'boolean'},
  },
  args: {tone: 'inverse', rounded: true},
};
export default meta;
type Story = StoryObj<typeof FeatureBand>;

export const Members: Story = {
  render: args => (
    <FeatureBand {...args}>
      <Eyebrow tone="gold">Members</Eyebrow>
      <Text style={{fontSize: 28, fontWeight: '600', color: '#FFFFFF', marginTop: 8}}>
        Warmer mornings, on us.
      </Text>
      <Text style={{fontSize: 14, color: 'rgba(255,255,255,0.70)', marginTop: 8}}>
        Earn stars on every order. Unlock your next drink before the week is out.
      </Text>
      <Box marginTop={16}>
        <Progress value={0.5} tone="gold" surface="inverse" />
      </Box>
      <Box flexDirection="row" gap={10} marginTop={16}>
        <Button>Join rewards</Button>
        <Button variant="inverse">See benefits</Button>
      </Box>
    </FeatureBand>
  ),
};

export const Ember: Story = {
  args: {tone: 'ember'},
  render: args => (
    <FeatureBand {...args}>
      <Eyebrow tone="gold">Today only</Eyebrow>
      <Text style={{fontSize: 28, fontWeight: '600', color: '#FFFFFF', marginTop: 8}}>
        Double stars on breakfast.
      </Text>
    </FeatureBand>
  ),
};
```

- [ ] **Step 2: Typecheck** — Run `pnpm typecheck`. Expected: PASS.
- [ ] **Step 3: Commit** — `git add src/components/FeatureBand/FeatureBand.native.stories.tsx && git commit -m "feat(FeatureBand): native storybook stories"`

---

### Task 9: Input native stories

**Files:**
- Create: `src/components/Input/Input.native.stories.tsx`

Input: `variant: 'default' | 'error'`, `size: 'sm' | 'default' | 'lg'`, `onChangeText`, `disabled`, `readOnly`, `multiline`, `numberOfLines`. `type='date'` is out of scope (no native date picker).

- [ ] **Step 1: Write the story file**

```tsx
import type {Meta, StoryObj} from '@storybook/react-native';
import React, {useState} from 'react';
import {Input} from './Input';
import {Box} from '../Box';
import {Text} from '../Text';
import type {InputSize} from './types';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    variant: {control: 'select', options: ['default', 'error']},
    size: {control: 'select', options: ['sm', 'default', 'lg']},
    disabled: {control: 'boolean'},
    readOnly: {control: 'boolean'},
  },
};
export default meta;
type Story = StoryObj<typeof Input>;

const ControlledDemo = () => {
  const [value, setValue] = useState('');
  return (
    <Input
      placeholder="이름을 입력하세요"
      value={value}
      onChangeText={setValue}
      fullWidth
    />
  );
};

export const Default: Story = {
  render: () => <ControlledDemo />,
};

export const Error: Story = {
  args: {variant: 'error', placeholder: '오류 상태', fullWidth: true},
};

export const Sizes: Story = {
  render: () => {
    const sizes: InputSize[] = ['sm', 'default', 'lg'];
    return (
      <Box flexDirection="column" gap={12}>
        {sizes.map(size => (
          <Box key={size} gap={4}>
            <Text variant="small" muted>
              {size}
            </Text>
            <Input size={size} placeholder={size} fullWidth />
          </Box>
        ))}
      </Box>
    );
  },
};

export const Disabled: Story = {
  args: {disabled: true, placeholder: '비활성', fullWidth: true},
};

export const Multiline: Story = {
  args: {
    multiline: true,
    numberOfLines: 4,
    placeholder: '여러 줄 입력',
    fullWidth: true,
  },
};
```

- [ ] **Step 2: Typecheck** — Run `pnpm typecheck`. Expected: PASS.
- [ ] **Step 3: Commit** — `git add src/components/Input/Input.native.stories.tsx && git commit -m "feat(Input): native storybook stories"`

---

### Task 10: Pill native stories

**Files:**
- Create: `src/components/Pill/Pill.native.stories.tsx`

Pill: `active`, `disabled`, `onPress`. Controlled filter demo holds the selected key in `useState`.

- [ ] **Step 1: Write the story file**

```tsx
import type {Meta, StoryObj} from '@storybook/react-native';
import React, {useState} from 'react';
import {Pill} from './Pill';
import {Box} from '../Box';

const meta: Meta<typeof Pill> = {
  title: 'Components/Pill',
  component: Pill,
  tags: ['autodocs'],
  argTypes: {
    active: {control: 'boolean'},
    disabled: {control: 'boolean'},
  },
  args: {active: false, children: 'All'},
};
export default meta;
type Story = StoryObj<typeof Pill>;

export const Default: Story = {
  args: {children: 'All'},
};

export const Active: Story = {
  args: {active: true, children: 'Coffee'},
};

const CATEGORIES = ['All', 'Coffee', 'Tea', 'Bakery'];

const CategoryFilterDemo = () => {
  const [selected, setSelected] = useState('All');
  return (
    <Box flexDirection="row" flexWrap="wrap" gap={8}>
      {CATEGORIES.map(category => (
        <Pill
          key={category}
          active={selected === category}
          onPress={() => setSelected(category)}>
          {category}
        </Pill>
      ))}
    </Box>
  );
};

export const CategoryFilter: Story = {
  render: () => <CategoryFilterDemo />,
};
```

- [ ] **Step 2: Typecheck** — Run `pnpm typecheck`. Expected: PASS.
- [ ] **Step 3: Commit** — `git add src/components/Pill/Pill.native.stories.tsx && git commit -m "feat(Pill): native storybook stories"`

---

### Task 11: Progress native stories

**Files:**
- Create: `src/components/Progress/Progress.native.stories.tsx`

Progress: `value` (required, 0-1 or 0-100), `tone: 'gold' | 'ember' | 'ink'`, `surface: 'light' | 'inverse'`, `size: 'sm' | 'default' | 'lg'`.

- [ ] **Step 1: Write the story file**

```tsx
import type {Meta, StoryObj} from '@storybook/react-native';
import React from 'react';
import {Progress} from './Progress';
import {Box} from '../Box';

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
  argTypes: {
    value: {control: {type: 'range', min: 0, max: 1, step: 0.05}},
    tone: {control: 'select', options: ['gold', 'ember', 'ink']},
    surface: {control: 'select', options: ['light', 'inverse']},
    size: {control: 'select', options: ['sm', 'default', 'lg']},
  },
  args: {value: 0.5, tone: 'gold', surface: 'light', size: 'default'},
};
export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  render: args => (
    <Box width={320}>
      <Progress {...args} />
    </Box>
  ),
};

export const OnInverse: Story = {
  args: {value: 0.75, surface: 'inverse'},
  render: args => (
    <Box backgroundColor="#171513" padding={24} borderRadius="md" width={320}>
      <Progress {...args} />
    </Box>
  ),
};
```

- [ ] **Step 2: Typecheck** — Run `pnpm typecheck`. Expected: PASS.
- [ ] **Step 3: Commit** — `git add src/components/Progress/Progress.native.stories.tsx && git commit -m "feat(Progress): native storybook stories"`

---

### Task 12: StatusDot native stories

**Files:**
- Create: `src/components/StatusDot/StatusDot.native.stories.tsx`

StatusDot: `tone: 'success' | 'danger' | 'brand' | 'neutral'`, `size: 'sm' | 'default' | 'lg'`, `children` is a glyph.

- [ ] **Step 1: Write the story file**

```tsx
import type {Meta, StoryObj} from '@storybook/react-native';
import React from 'react';
import {StatusDot} from './StatusDot';
import {Box} from '../Box';

const meta: Meta<typeof StatusDot> = {
  title: 'Components/StatusDot',
  component: StatusDot,
  tags: ['autodocs'],
  argTypes: {
    tone: {control: 'select', options: ['success', 'danger', 'brand', 'neutral']},
    size: {control: 'select', options: ['sm', 'default', 'lg']},
  },
  args: {tone: 'success', children: '✓'},
};
export default meta;
type Story = StoryObj<typeof StatusDot>;

export const Default: Story = {
  args: {tone: 'success', children: '✓'},
};

export const AllTones: Story = {
  render: () => (
    <Box flexDirection="row" gap={12}>
      <StatusDot tone="success">✓</StatusDot>
      <StatusDot tone="danger">!</StatusDot>
      <StatusDot tone="brand">★</StatusDot>
      <StatusDot tone="neutral">·</StatusDot>
    </Box>
  ),
};
```

- [ ] **Step 2: Typecheck** — Run `pnpm typecheck`. Expected: PASS.
- [ ] **Step 3: Commit** — `git add src/components/StatusDot/StatusDot.native.stories.tsx && git commit -m "feat(StatusDot): native storybook stories"`

---

### Task 13: Tabs native stories

**Files:**
- Create: `src/components/Tabs/Tabs.native.stories.tsx`

Tabs: `items: {key, label, disabled?}[]` (required), `value` (required), `onChange` (required), `inverse`. Controlled via `useState`.

- [ ] **Step 1: Write the story file**

```tsx
import type {Meta, StoryObj} from '@storybook/react-native';
import React, {useState} from 'react';
import {Tabs} from './Tabs';
import {Box} from '../Box';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Tabs>;

const ITEMS = [
  {key: 'menu', label: 'Menu'},
  {key: 'orders', label: 'Previous orders'},
  {key: 'favorites', label: 'Favorites'},
  {key: 'featured', label: 'Featured'},
];

const DefaultDemo = () => {
  const [active, setActive] = useState('menu');
  return <Tabs items={ITEMS} value={active} onChange={setActive} />;
};

export const Default: Story = {
  render: () => <DefaultDemo />,
};

const InverseDemo = () => {
  const [active, setActive] = useState('menu');
  return (
    <Box backgroundColor="#171513" padding={24} borderRadius="md">
      <Tabs items={ITEMS} value={active} onChange={setActive} inverse />
    </Box>
  );
};

export const Inverse: Story = {
  render: () => <InverseDemo />,
};
```

- [ ] **Step 2: Typecheck** — Run `pnpm typecheck`. Expected: PASS.
- [ ] **Step 3: Commit** — `git add src/components/Tabs/Tabs.native.stories.tsx && git commit -m "feat(Tabs): native storybook stories"`

---

### Task 14: Toast native stories

**Files:**
- Create: `src/components/Toast/Toast.native.stories.tsx`

Toast (presentational): `tone: 'success' | 'danger' | 'brand' | 'neutral'`, `title` (required), `description`, `glyph`, `hideIcon`. The `ToastProvider`/`useToast` imperative demo is out of scope.

- [ ] **Step 1: Write the story file**

```tsx
import type {Meta, StoryObj} from '@storybook/react-native';
import React from 'react';
import {Toast} from './Toast';
import {Box} from '../Box';

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
  argTypes: {
    tone: {control: 'select', options: ['success', 'danger', 'brand', 'neutral']},
    hideIcon: {control: 'boolean'},
  },
  args: {tone: 'success', title: 'Order placed'},
};
export default meta;
type Story = StoryObj<typeof Toast>;

export const Success: Story = {
  args: {
    tone: 'success',
    title: 'Order placed',
    description: 'Ready in 5 min at Hongdae.',
  },
};

export const Danger: Story = {
  args: {
    tone: 'danger',
    title: 'Payment declined',
    description: 'Try a different card.',
  },
};

export const Stack: Story = {
  render: () => (
    <Box flexDirection="column" gap={12}>
      <Toast tone="success" title="Order placed" description="Ready in 5 min." />
      <Toast tone="danger" title="Payment declined" description="Try another card." />
      <Toast tone="brand" title="Stars earned" description="+12 stars added." />
    </Box>
  ),
};
```

- [ ] **Step 2: Typecheck** — Run `pnpm typecheck`. Expected: PASS.
- [ ] **Step 3: Commit** — `git add src/components/Toast/Toast.native.stories.tsx && git commit -m "feat(Toast): native storybook stories"`

---

## Final Verification (after all 14 tasks)

- [ ] **Run full typecheck:** `pnpm typecheck` → PASS (exit 0).
- [ ] **Run build:** `pnpm build` → PASS. Confirm stories are not in the tarball/build output (they match the `*.stories` exclusion glob).
- [ ] **Confirm count:** `ls src/components/*/*.native.stories.tsx | wc -l` → 19 (5 pre-existing + 14 new).
- [ ] **Update memory:** append a line to `/Users/logan/.claude/projects/-Users-logan-Repository-wooBottle-externalProjects-woosign/memory/bottomsheet-component.md` noting native stories backfill complete (14 added, 19/20 components now have native stories; Toast Provider/useToast imperative demo still pending).

---

## Self-Review Notes

- **Spec coverage:** All 14 components in the spec table have a task (Tasks 1-14). Stateful (BottomSheet/Dialog) use `useState` + Button trigger ✓. Controlled (Input/Tabs/Pill) use named demo components ✓. Fab passes `accessibilityLabel` + glyph child ✓. Input `type='date'` excluded ✓. Toast Provider demo excluded ✓. inverse/dark-surface (Divider/Progress/Tabs/Eyebrow/FeatureBand) use `#171513` Box wrapper ✓. Validation = `pnpm typecheck && pnpm build` ✓.
- **Prop-name risk:** Type imports (`CardVariant`, `ChipTone`, `EyebrowTone`, `FabTone`, `InputSize`) and prop values come from the component survey; if any typecheck error surfaces, the engineer fixes against that component's `types.ts` (instructed at top). `Text` props used (`variant`, `muted`, `color`) match existing Box/Switch native stories.
- **No placeholders:** every task has complete file contents.
