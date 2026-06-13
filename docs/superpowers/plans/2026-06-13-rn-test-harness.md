# React Native 테스트 하니스 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** @woosign/ui에 네이티브(`.native.tsx`) 컴포넌트 동작을 검증하는 세 번째 jest 프로젝트(`native`)를 추가하고, 오버레이 2종(BottomSheet, Dialog)의 동작 테스트를 작성한다.

**Architecture:** 기존 `jest.config.js`의 두 프로젝트(`tokens`=node/ts-jest, `web`=jsdom/ts-jest)는 무손상으로 두고, RN jest 프리셋(babel-jest + Modal/ScrollView 목 + transformIgnore)을 쓰는 `native` 프로젝트를 추가한다. 테스트는 `@testing-library/react-native`로 작성하되, 매처 확장 의존을 피하기 위해 **plain jest 단언 + `StyleSheet.flatten`**만 사용한다(setup 파일 불필요).

**Tech Stack:** jest 29 (projects 멀티프로젝트), `react-native` jest preset(babel-jest), `@testing-library/react-native@13.3.3`, `react-test-renderer@19`(이미 설치), TypeScript.

**Spec:** `docs/superpowers/specs/2026-06-13-rn-test-harness-design.md`

**스펙 대비 의도적 단순화:** 스펙은 `jest.native.setup.ts`(매처 확장)를 두라고 했으나, TLRN v13은 라이브러리 import 시 jest 매처를 자동 등록한다. 본 플랜은 매처 확장 자체에 의존하지 않고 plain jest 단언 + `StyleSheet.flatten`만 쓰므로 setup 파일과 `files` 배열 수정이 모두 불필요하다 — 더 적은 변경면적으로 동일한 검증을 달성한다.

---

## File Structure

```
package.json                                  # MODIFY: devDep @testing-library/react-native@13.3.3 추가
jest.config.js                                # MODIFY: 세 번째 프로젝트 'native' 추가 (기존 두 개 무손상)
src/components/BottomSheet/BottomSheet.native.test.tsx   # CREATE: BottomSheet 네이티브 동작 테스트
src/components/Dialog/Dialog.native.test.tsx            # CREATE: Dialog 네이티브 동작 테스트
```

각 파일 책임: `jest.config.js`는 멀티프로젝트 구성, 두 테스트 파일은 각 컴포넌트의 네이티브 동작 검증. 테스트는 `./BottomSheet.native` / `./Dialog.native`에서 컴포넌트를 직접 import해 플랫폼을 명시한다(facade 해석 의존 제거).

---

### Task 1: 하니스 구성 + BottomSheet 스모크 테스트

`native` 프로젝트를 jest에 추가하고, RN 컴포넌트가 실제로 렌더되는지 스모크 테스트(닫힘/열림 2케이스)로 하니스 전체를 end-to-end 검증한다.

**Files:**
- Modify: `package.json` (devDependencies)
- Modify: `jest.config.js`
- Create: `src/components/BottomSheet/BottomSheet.native.test.tsx`

- [ ] **Step 1: @testing-library/react-native 설치**

Run:
```bash
pnpm add -D @testing-library/react-native@13.3.3
```
Expected: 설치 성공. `react-test-renderer@19.0.0`는 이미 있어 peer 경고 없음(있어도 무시 가능).

- [ ] **Step 2: jest.config.js에 native 프로젝트 추가**

`jest.config.js` 전체를 아래로 교체한다(기존 tokens/web 프로젝트 정의는 그대로 유지, native 추가):

```js
/**
 * Jest harness — three projects.
 *
 * - "tokens" : node env (ts-jest), covers the shared core (tokens, variants,
 *              resolveFontFamily). Fast, no DOM.
 * - "web"    : jsdom env (ts-jest), resolves .web.tsx ahead of .tsx so web
 *              components render with @testing-library/react + jest-dom.
 * - "native" : react-native preset (babel-jest), resolves .native.tsx ahead
 *              of .tsx so RN components render with
 *              @testing-library/react-native. Modal/ScrollView are mocked by
 *              the preset (children render through), so these tests cover
 *              behavior — not real scroll/layout.
 */
const tsJest = [
  'ts-jest',
  {tsconfig: {jsx: 'react-jsx', esModuleInterop: true}},
];

module.exports = {
  projects: [
    {
      displayName: 'tokens',
      testEnvironment: 'node',
      roots: ['<rootDir>/src'],
      testMatch: ['<rootDir>/src/__tests__/**/*.test.ts'],
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
      transform: {'^.+\\.tsx?$': tsJest},
    },
    {
      displayName: 'web',
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/src'],
      testMatch: ['<rootDir>/src/**/*.web.test.tsx'],
      moduleFileExtensions: [
        'web.tsx',
        'web.ts',
        'tsx',
        'ts',
        'jsx',
        'js',
        'json',
      ],
      transform: {'^.+\\.tsx?$': tsJest},
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    },
    {
      displayName: 'native',
      preset: 'react-native',
      roots: ['<rootDir>/src'],
      testMatch: ['<rootDir>/src/**/*.native.test.tsx'],
      moduleFileExtensions: [
        'native.tsx',
        'native.ts',
        'tsx',
        'ts',
        'jsx',
        'js',
        'json',
      ],
    },
  ],
};
```

참고: `native` 프로젝트는 `transform`을 직접 지정하지 않는다 — `preset: 'react-native'`가 babel-jest 변환, transformIgnorePatterns, RN 환경 setupFiles, haste를 모두 제공한다. babel 변환은 루트 `babel.config.js`(이미 `@react-native/babel-preset` + reanimated plugin 포함)를 사용한다.

- [ ] **Step 3: BottomSheet 스모크 테스트 작성**

`src/components/BottomSheet/BottomSheet.native.test.tsx`:

```tsx
/**
 * Native harness tests for BottomSheet. react-native preset(jest), .native.tsx
 * 구현을 사용한다. Modal/ScrollView는 프리셋이 목킹하므로 이 테스트는 동작
 * (콜백/조건부 렌더/props 배선)만 검증한다 — 실제 스크롤/레이아웃은 범위 밖.
 */
import {Text} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {BottomSheet} from './BottomSheet.native';

describe('BottomSheet (native)', () => {
  it('does not render content when closed', () => {
    render(
      <BottomSheet open={false} onClose={() => {}}>
        <Text>본문</Text>
      </BottomSheet>,
    );
    expect(screen.queryByText('본문')).toBeNull();
  });

  it('renders content when open', () => {
    render(
      <BottomSheet open onClose={() => {}}>
        <Text>본문</Text>
      </BottomSheet>,
    );
    expect(screen.queryByText('본문')).not.toBeNull();
  });
});
```

- [ ] **Step 4: native 프로젝트만 실행해 통과 확인**

Run:
```bash
pnpm test -- --selectProjects native
```
Expected: PASS (2 tests). 이로써 RN 프리셋 + TLRN + babel 변환 + `.native.tsx` 해석이 모두 동작함이 증명된다.

만약 transformIgnorePatterns로 인해 `react-native` 내부 모듈 변환 에러가 나면, 프리셋이 이미 정답을 제공하므로 config의 `preset: 'react-native'` 철자와 import 경로만 점검한다(추가 transformIgnore 작성 금지).

- [ ] **Step 5: 전체 테스트 + typecheck**

Run:
```bash
pnpm test && pnpm typecheck
```
Expected: 세 프로젝트 모두 그린(tokens/web 기존 + native 2). typecheck 클린.

- [ ] **Step 6: 커밋**

```bash
git add package.json pnpm-lock.yaml jest.config.js src/components/BottomSheet/BottomSheet.native.test.tsx
git commit -m "test(native): add react-native jest project + BottomSheet smoke tests

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: BottomSheet 네이티브 동작 테스트 전체

스모크 2케이스에 동작 케이스(scrim/back/handle/전파차단/서브컴포넌트+Body 스크롤 prop)를 추가한다.

**Files:**
- Modify: `src/components/BottomSheet/BottomSheet.native.test.tsx`

- [ ] **Step 1: import 확장**

`BottomSheet.native.test.tsx` 상단 import를 아래로 교체한다(Modal/ScrollView/StyleSheet, fireEvent 추가):

```tsx
import {Modal, ScrollView, StyleSheet, Text} from 'react-native';
import {render, screen, fireEvent} from '@testing-library/react-native';
import {BottomSheet} from './BottomSheet.native';
```

- [ ] **Step 2: 동작 테스트 6종 추가**

`describe` 블록 안, 스모크 2케이스 뒤에 추가한다:

```tsx
  it('calls onClose when the scrim is pressed', () => {
    const onClose = jest.fn();
    render(
      <BottomSheet open onClose={onClose} testID="sheet">
        <Text>본문</Text>
      </BottomSheet>,
    );
    fireEvent.press(screen.getByTestId('sheet-scrim'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on scrim press when closeOnScrimClick=false', () => {
    const onClose = jest.fn();
    render(
      <BottomSheet open onClose={onClose} closeOnScrimClick={false} testID="sheet">
        <Text>본문</Text>
      </BottomSheet>,
    );
    fireEvent.press(screen.getByTestId('sheet-scrim'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose on Android back (Modal onRequestClose)', () => {
    const onClose = jest.fn();
    render(
      <BottomSheet open onClose={onClose}>
        <Text>본문</Text>
      </BottomSheet>,
    );
    screen.UNSAFE_getByType(Modal).props.onRequestClose();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on back when closeOnEsc=false', () => {
    const onClose = jest.fn();
    render(
      <BottomSheet open onClose={onClose} closeOnEsc={false}>
        <Text>본문</Text>
      </BottomSheet>,
    );
    screen.UNSAFE_getByType(Modal).props.onRequestClose();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders the grab handle by default and hides it when dragToClose=false', () => {
    const {rerender} = render(
      <BottomSheet open onClose={() => {}} testID="sheet">
        <Text>본문</Text>
      </BottomSheet>,
    );
    expect(screen.queryByTestId('sheet-handle')).not.toBeNull();
    rerender(
      <BottomSheet open onClose={() => {}} dragToClose={false} testID="sheet">
        <Text>본문</Text>
      </BottomSheet>,
    );
    expect(screen.queryByTestId('sheet-handle')).toBeNull();
  });

  it('does not call onClose when the surface is pressed (no propagation)', () => {
    const onClose = jest.fn();
    render(
      <BottomSheet open onClose={onClose} testID="sheet">
        <Text>본문</Text>
      </BottomSheet>,
    );
    fireEvent.press(screen.getByTestId('sheet'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders subcomponents and gives the Body a shrinkable ScrollView', () => {
    render(
      <BottomSheet open onClose={() => {}}>
        <BottomSheet.Header>
          <BottomSheet.Title>제목</BottomSheet.Title>
          <BottomSheet.Description>설명</BottomSheet.Description>
        </BottomSheet.Header>
        <BottomSheet.Body>
          <Text>본문</Text>
        </BottomSheet.Body>
        <BottomSheet.Footer>
          <Text>확인</Text>
        </BottomSheet.Footer>
      </BottomSheet>,
    );
    expect(screen.getByText('제목')).toBeTruthy();
    expect(screen.getByText('설명')).toBeTruthy();
    expect(screen.getByText('본문')).toBeTruthy();
    expect(screen.getByText('확인')).toBeTruthy();
    // 스크롤 회귀 방지: Body의 ScrollView가 flexShrink:1을 받는지 prop 레벨로 확인
    const flat = StyleSheet.flatten(
      screen.UNSAFE_getByType(ScrollView).props.style,
    );
    expect(flat.flexShrink).toBe(1);
  });
```

구현 노트(분기 아님, 안전망):
- `UNSAFE_getByType(Modal)`이 인스턴스를 2개 이상 보고한다면(목 내부 BaseComponent 중첩 가능성) `screen.UNSAFE_getAllByType(Modal)[0].props.onRequestClose()`로 바꾼다. mockModal은 외부 1개만 노출하는 게 일반적이라 단수형이 기본이다.
- `UNSAFE_getByType(ScrollView)`도 동일하게, 다중이면 `UNSAFE_getAllByType(ScrollView)[0]`.

- [ ] **Step 3: native 프로젝트 실행**

Run:
```bash
pnpm test -- --selectProjects native
```
Expected: PASS (9 tests: 스모크 2 + 동작 7).

- [ ] **Step 4: typecheck**

Run: `pnpm typecheck`
Expected: 클린.

- [ ] **Step 5: 커밋**

```bash
git add src/components/BottomSheet/BottomSheet.native.test.tsx
git commit -m "test(native): full BottomSheet behavior coverage (scrim/back/handle/scroll prop)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Dialog 네이티브 동작 테스트

Dialog 웹 테스트를 네이티브로 미러링한다. Dialog는 핸들/ScrollView/dragToClose가 없으므로 그 케이스는 제외하고, aria는 web 전용이라 제외한다.

**Files:**
- Create: `src/components/Dialog/Dialog.native.test.tsx`

- [ ] **Step 1: Dialog 네이티브 테스트 작성**

`src/components/Dialog/Dialog.native.test.tsx`:

```tsx
/**
 * Native harness tests for Dialog. react-native preset(jest), .native.tsx
 * 구현을 사용한다. Modal은 프리셋이 목킹하므로 이 테스트는 동작만 검증한다.
 * (aria 관련은 web 전용이라 제외 — native는 aria 미사용.)
 */
import {Modal, Text} from 'react-native';
import {render, screen, fireEvent} from '@testing-library/react-native';
import {Dialog} from './Dialog.native';

describe('Dialog (native)', () => {
  it('does not render content when closed', () => {
    render(
      <Dialog open={false} onClose={() => {}}>
        <Text>본문</Text>
      </Dialog>,
    );
    expect(screen.queryByText('본문')).toBeNull();
  });

  it('renders content when open', () => {
    render(
      <Dialog open onClose={() => {}}>
        <Text>본문</Text>
      </Dialog>,
    );
    expect(screen.queryByText('본문')).not.toBeNull();
  });

  it('calls onClose when the scrim is pressed', () => {
    const onClose = jest.fn();
    render(
      <Dialog open onClose={onClose} testID="dlg">
        <Text>본문</Text>
      </Dialog>,
    );
    fireEvent.press(screen.getByTestId('dlg-scrim'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on scrim press when closeOnScrimClick=false', () => {
    const onClose = jest.fn();
    render(
      <Dialog open onClose={onClose} closeOnScrimClick={false} testID="dlg">
        <Text>본문</Text>
      </Dialog>,
    );
    fireEvent.press(screen.getByTestId('dlg-scrim'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose on Android back (Modal onRequestClose)', () => {
    const onClose = jest.fn();
    render(
      <Dialog open onClose={onClose}>
        <Text>본문</Text>
      </Dialog>,
    );
    screen.UNSAFE_getByType(Modal).props.onRequestClose();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on back when closeOnEsc=false', () => {
    const onClose = jest.fn();
    render(
      <Dialog open onClose={onClose} closeOnEsc={false}>
        <Text>본문</Text>
      </Dialog>,
    );
    screen.UNSAFE_getByType(Modal).props.onRequestClose();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not call onClose when the surface is pressed (no propagation)', () => {
    const onClose = jest.fn();
    render(
      <Dialog open onClose={onClose} testID="dlg">
        <Text>본문</Text>
      </Dialog>,
    );
    fireEvent.press(screen.getByTestId('dlg'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders subcomponents', () => {
    render(
      <Dialog open onClose={() => {}}>
        <Dialog.Header>
          <Dialog.Title>제목</Dialog.Title>
          <Dialog.Description>설명</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <Text>본문</Text>
        </Dialog.Body>
        <Dialog.Footer>
          <Text>확인</Text>
        </Dialog.Footer>
      </Dialog>,
    );
    expect(screen.getByText('제목')).toBeTruthy();
    expect(screen.getByText('설명')).toBeTruthy();
    expect(screen.getByText('본문')).toBeTruthy();
    expect(screen.getByText('확인')).toBeTruthy();
  });

  it('exposes subcomponents as standalone named exports', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('./Dialog.native');
    expect(typeof mod.DialogHeader).toBe('function');
    expect(typeof mod.DialogTitle).toBe('function');
    expect(typeof mod.DialogDescription).toBe('function');
    expect(typeof mod.DialogBody).toBe('function');
    expect(typeof mod.DialogFooter).toBe('function');
  });
});
```

- [ ] **Step 2: native 프로젝트 실행**

Run:
```bash
pnpm test -- --selectProjects native
```
Expected: PASS (BottomSheet 9 + Dialog 9 = 18 tests).

- [ ] **Step 3: 전체 검증**

Run:
```bash
pnpm typecheck && pnpm test && pnpm build
```
Expected: typecheck 클린, 세 프로젝트 모두 그린(기존 web/tokens + native 18), build 성공(테스트 파일은 빌드 제외).

- [ ] **Step 4: 커밋**

```bash
git add src/components/Dialog/Dialog.native.test.tsx
git commit -m "test(native): mirror Dialog behavior coverage on native

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
