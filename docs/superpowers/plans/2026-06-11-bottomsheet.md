# BottomSheet Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** @woosign/ui에 크로스 플랫폼(RN + Web) Controlled BottomSheet 컴포넌트를 추가한다.

**Architecture:** Dialog 컴포넌트의 파일/스타일/테스트 규약을 그대로 따른다. Web은 `createPortal(document.body)`로 scrim+표면을 하단 정렬 렌더하고 Esc/scrim 클릭/핸들 Pointer 드래그로 닫는다. Native는 RN 내장 `<Modal animationType="slide">` + 핸들 `PanResponder` 드래그. 드래그 디스미스 판정은 공유 순수 함수 `shouldDismiss(dy, vy, sheetHeight)`로 web/native가 동일 기준을 쓴다. 외부 의존성 0 (제로 의존성 원칙).

**Tech Stack:** React, React Native(Modal/Animated/PanResponder/ScrollView/SafeAreaView), TypeScript, react-dom `createPortal`, `@testing-library/react` + jest (jsdom `web` project + node `tokens` project).

**Spec:** `docs/superpowers/specs/2026-06-11-bottomsheet-design.md`

---

## File Structure

```
src/components/BottomSheet/
  types.ts                      # BottomSheetProps(base/web/native), 서브컴포넌트 props, ContextValue
  BottomSheetContext.ts         # aria id 전달용 React Context (web에서 사용)
  BottomSheet.styles.ts         # SCRIM_COLOR, HANDLE_*, DEFAULT_MAX_HEIGHT_RATIO, getBottomSheetStyles()
  dismiss.ts                    # shouldDismiss 순수 함수 + 임계값 상수 (shared)
  BottomSheet.web.tsx           # BottomSheet + Header/Title/Description/Body/Footer (web), attach
  BottomSheet.native.tsx        # 동일 구성 (RN <Modal> + PanResponder)
  BottomSheet.tsx               # web facade fallback → export from './BottomSheet.web'
  BottomSheet.web.test.tsx      # jsdom 동작 테스트
  BottomSheet.web.stories.tsx   # Storybook
  index.ts                      # 타입 + 컴포넌트 re-export
src/__tests__/
  bottomsheet-dismiss.test.ts   # shouldDismiss 단위 테스트 (node "tokens" 프로젝트)
```

Modify: `src/components/index.ts` — `export * from './BottomSheet';` 추가 (알파벳 순서상 `./Badge`~`./Box` 사이).

---

### Task 1: dismiss 판정 함수 (TDD) + 타입/컨텍스트/스타일 스캐폴드

**Files:**
- Create: `src/__tests__/bottomsheet-dismiss.test.ts`
- Create: `src/components/BottomSheet/dismiss.ts`
- Create: `src/components/BottomSheet/types.ts`
- Create: `src/components/BottomSheet/BottomSheetContext.ts`
- Create: `src/components/BottomSheet/BottomSheet.styles.ts`

- [x] **Step 1: shouldDismiss 실패 테스트 작성**

`src/__tests__/bottomsheet-dismiss.test.ts`:

```ts
import {shouldDismiss} from '../components/BottomSheet/dismiss';

describe('shouldDismiss', () => {
  it('closes when drag exceeds 25% of sheet height', () => {
    expect(shouldDismiss(101, 0, 400)).toBe(true);
  });

  it('stays open when drag is at or under 25%', () => {
    expect(shouldDismiss(100, 0, 400)).toBe(false);
    expect(shouldDismiss(99, 0, 400)).toBe(false);
  });

  it('closes on fast flick past the minimum distance', () => {
    expect(shouldDismiss(30, 0.6, 400)).toBe(true);
  });

  it('ignores a fast flick under the minimum distance', () => {
    expect(shouldDismiss(10, 2, 400)).toBe(false);
  });

  it('stays open on a slow release under both thresholds', () => {
    expect(shouldDismiss(30, 0.3, 400)).toBe(false);
  });

  it('falls back to an absolute distance when height is unmeasured', () => {
    expect(shouldDismiss(121, 0, 0)).toBe(true);
    expect(shouldDismiss(119, 0, 0)).toBe(false);
  });
});
```

- [x] **Step 2: 테스트 실패 확인**

Run: `pnpm test -- --selectProjects tokens -t shouldDismiss`
Expected: FAIL — `Cannot find module '../components/BottomSheet/dismiss'`

- [x] **Step 3: dismiss.ts 구현**

`src/components/BottomSheet/dismiss.ts`:

```ts
/**
 * 드래그 릴리스 시 시트를 닫을지 판정하는 공유 순수 함수.
 * web(Pointer Events)과 native(PanResponder)가 동일 기준을 쓴다.
 */

/** 시트 높이 대비 닫힘 거리 비율. */
export const DISMISS_DISTANCE_RATIO = 0.25;
/** 시트 높이를 측정할 수 없을 때(jsdom 등) 쓰는 절대 거리 임계값(px). */
export const DISMISS_FALLBACK_DISTANCE = 120;
/** 플릭 판정 속도 임계값(px/ms). */
export const DISMISS_VELOCITY = 0.5;
/** 플릭으로 닫히기 위한 최소 하강 거리(px) — 미세한 빠른 떨림 오판 방지. */
export const FLICK_MIN_DISTANCE = 24;

/**
 * @param dy 누적 하강 거리(px, 0 이상)
 * @param vy 릴리스 시점 하강 속도(px/ms, 0 이상)
 * @param sheetHeight 시트 표면 높이(px). 0 이하면 fallback 절대 거리 사용.
 */
export function shouldDismiss(
  dy: number,
  vy: number,
  sheetHeight: number,
): boolean {
  const distanceThreshold =
    sheetHeight > 0
      ? sheetHeight * DISMISS_DISTANCE_RATIO
      : DISMISS_FALLBACK_DISTANCE;
  if (dy > distanceThreshold) return true;
  return vy > DISMISS_VELOCITY && dy >= FLICK_MIN_DISTANCE;
}
```

- [x] **Step 4: 테스트 통과 확인**

Run: `pnpm test -- --selectProjects tokens -t shouldDismiss`
Expected: PASS (6 tests)

- [x] **Step 5: types.ts 작성**

`src/components/BottomSheet/types.ts`:

```ts
import type {ReactNode} from 'react';
import type {ViewStyle} from 'react-native';

/** web/native 공통 컨테이너 props. */
export interface BottomSheetBaseProps {
  /** 표시 여부 (controlled). */
  open: boolean;
  /** scrim 클릭 / Esc / Android back / 드래그 디스미스 시 호출. */
  onClose: () => void;
  /** scrim 클릭으로 닫을지. 기본 true. */
  closeOnScrimClick?: boolean;
  /** Esc(web) / Android back(native)로 닫을지. 기본 true. */
  closeOnEsc?: boolean;
  /** 핸들 드래그로 닫을지. true면 grabber 핸들을 자동 렌더. 기본 true. */
  dragToClose?: boolean;
  /** 화면 높이 대비 시트 최대 높이 비율(0~1). 기본 0.9. */
  maxHeightRatio?: number;
  children?: ReactNode;
  testID?: string;
}

export interface BottomSheetWebProps extends BottomSheetBaseProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface BottomSheetNativeProps extends BottomSheetBaseProps {
  style?: ViewStyle;
}

export type BottomSheetProps = BottomSheetBaseProps & {
  className?: string;
  style?: ViewStyle | React.CSSProperties;
};

/** 서브컴포넌트 공통 props. */
export interface BottomSheetSectionProps {
  children?: ReactNode;
  style?: ViewStyle | React.CSSProperties;
  className?: string;
}

export type BottomSheetHeaderProps = BottomSheetSectionProps;
export type BottomSheetTitleProps = BottomSheetSectionProps;
export type BottomSheetDescriptionProps = BottomSheetSectionProps;
export type BottomSheetBodyProps = BottomSheetSectionProps;
export type BottomSheetFooterProps = BottomSheetSectionProps;

/** aria id 전달용 context 값 (web 한정 의미). */
export interface BottomSheetContextValue {
  titleId: string;
  descriptionId: string;
  /** BottomSheetTitle이 마운트되면 true로 등록 (aria-labelledby 연결용). */
  registerTitle: (present: boolean) => void;
  /** BottomSheetDescription이 마운트되면 true로 등록 (aria-describedby 연결용). */
  registerDescription: (present: boolean) => void;
}
```

- [x] **Step 6: BottomSheetContext.ts 작성**

`src/components/BottomSheet/BottomSheetContext.ts`:

```ts
import {createContext} from 'react';
import type {BottomSheetContextValue} from './types';

/**
 * BottomSheet 표면이 생성한 aria id(titleId/descriptionId)를 서브컴포넌트
 * (BottomSheetTitle/BottomSheetDescription)로 전달한다. web에서만 의미가 있다.
 */
export const BottomSheetContext =
  createContext<BottomSheetContextValue | null>(null);
BottomSheetContext.displayName = 'BottomSheetContext';
```

- [x] **Step 7: BottomSheet.styles.ts 작성**

`src/components/BottomSheet/BottomSheet.styles.ts` — 섹션 패딩/타이포 값은
Dialog.styles와 동일하게 유지해 시각 일관성 확보:

```ts
import {
  colors,
  borderRadius,
  typography,
  spacing,
  blackAlpha,
} from '../../core/theme/tokens';

/** scrim(배경 dimmer) 색 — Dialog와 동일 값. */
export const SCRIM_COLOR = 'rgba(0, 0, 0, 0.5)';
/** grabber 핸들 크기(px). */
export const HANDLE_WIDTH = 36;
export const HANDLE_HEIGHT = 4;
/** 화면 높이 대비 시트 최대 높이 기본 비율. */
export const DEFAULT_MAX_HEIGHT_RATIO = 0.9;

/**
 * web/native가 공유하는 표면·핸들·섹션 스타일. 숫자/문자 값만 담아
 * web(cssify)·native(StyleSheet) 양쪽에서 그대로 쓴다.
 */
export function getBottomSheetStyles() {
  return {
    surface: {
      backgroundColor: colors.card,
      borderTopLeftRadius: borderRadius.lg,
      borderTopRightRadius: borderRadius.lg,
      overflow: 'hidden' as const,
      width: '100%' as const,
    },
    handleArea: {
      alignItems: 'center' as const,
      paddingTop: spacing[3],
      paddingBottom: 0,
    },
    handle: {
      width: HANDLE_WIDTH,
      height: HANDLE_HEIGHT,
      borderRadius: borderRadius.pill,
      backgroundColor: blackAlpha['24'],
    },
    header: {
      paddingTop: spacing[4],
      paddingLeft: spacing[6],
      paddingRight: spacing[6],
      paddingBottom: spacing[2],
    },
    title: {
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.xl.size,
      lineHeight: typography.fontSize.xl.lineHeight,
      fontWeight: typography.fontWeight.semibold as '600',
      letterSpacing: typography.letterSpacing.tight,
      color: colors.textPrimary,
    },
    description: {
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.bodySm.size,
      lineHeight: typography.fontSize.bodySm.lineHeight,
      color: colors.textSecondary,
      letterSpacing: typography.letterSpacing.tight,
      marginTop: spacing[2],
    },
    body: {
      paddingTop: spacing[2],
      paddingLeft: spacing[6],
      paddingRight: spacing[6],
      paddingBottom: spacing[2],
    },
    footer: {
      paddingTop: spacing[4],
      paddingLeft: spacing[6],
      paddingRight: spacing[6],
      paddingBottom: spacing[6],
      flexDirection: 'row' as const,
      justifyContent: 'flex-end' as const,
      gap: spacing[3],
    },
  };
}
```

- [x] **Step 8: typecheck + 커밋**

Run: `pnpm typecheck`
Expected: 에러 없음

```bash
git add src/__tests__/bottomsheet-dismiss.test.ts src/components/BottomSheet/
git commit -m "feat(BottomSheet): scaffold dismiss logic, types, context, shared styles"
```

---

### Task 2: Web 컨테이너 — portal, scrim, Esc, 핸들 드래그

**Files:**
- Create: `src/components/BottomSheet/BottomSheet.web.tsx` (컨테이너 부분)
- Create: `src/components/BottomSheet/BottomSheet.web.test.tsx` (컨테이너 테스트)

- [x] **Step 1: 컨테이너 실패 테스트 작성**

`src/components/BottomSheet/BottomSheet.web.test.tsx`:

```tsx
/**
 * Web harness tests for BottomSheet. jsdom 환경, .web.tsx 구현을 사용한다.
 */
import {render, screen, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {BottomSheet} from './BottomSheet.web';

describe('BottomSheet (web)', () => {
  it('does not render content when closed', () => {
    render(
      <BottomSheet open={false} onClose={() => {}}>
        <div>본문</div>
      </BottomSheet>,
    );
    expect(screen.queryByText('본문')).not.toBeInTheDocument();
  });

  it('renders content when open with role=dialog and aria-modal', () => {
    render(
      <BottomSheet open onClose={() => {}}>
        <div>본문</div>
      </BottomSheet>,
    );
    expect(screen.getByText('본문')).toBeInTheDocument();
    const surface = screen.getByRole('dialog');
    expect(surface).toHaveAttribute('aria-modal', 'true');
  });

  it('calls onClose when scrim is clicked', async () => {
    const onClose = jest.fn();
    render(
      <BottomSheet open onClose={onClose} testID="sheet">
        <div>본문</div>
      </BottomSheet>,
    );
    await userEvent.click(screen.getByTestId('sheet-scrim'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on scrim click when closeOnScrimClick=false', async () => {
    const onClose = jest.fn();
    render(
      <BottomSheet
        open
        onClose={onClose}
        closeOnScrimClick={false}
        testID="sheet">
        <div>본문</div>
      </BottomSheet>,
    );
    await userEvent.click(screen.getByTestId('sheet-scrim'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not call onClose when the surface is clicked (no propagation)', async () => {
    const onClose = jest.fn();
    render(
      <BottomSheet open onClose={onClose}>
        <div>본문</div>
      </BottomSheet>,
    );
    await userEvent.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose on Escape key', async () => {
    const onClose = jest.fn();
    render(
      <BottomSheet open onClose={onClose}>
        <div>본문</div>
      </BottomSheet>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on Escape when closeOnEsc=false', async () => {
    const onClose = jest.fn();
    render(
      <BottomSheet open onClose={onClose} closeOnEsc={false}>
        <div>본문</div>
      </BottomSheet>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders the grab handle by default and hides it when dragToClose=false', () => {
    const {rerender} = render(
      <BottomSheet open onClose={() => {}} testID="sheet">
        <div>본문</div>
      </BottomSheet>,
    );
    expect(screen.getByTestId('sheet-handle')).toBeInTheDocument();
    rerender(
      <BottomSheet open onClose={() => {}} dragToClose={false} testID="sheet">
        <div>본문</div>
      </BottomSheet>,
    );
    expect(screen.queryByTestId('sheet-handle')).not.toBeInTheDocument();
  });

  it('calls onClose after a long downward handle drag', () => {
    const onClose = jest.fn();
    render(
      <BottomSheet open onClose={onClose} testID="sheet">
        <div>본문</div>
      </BottomSheet>,
    );
    const handle = screen.getByTestId('sheet-handle');
    // jsdom은 offsetHeight=0 → shouldDismiss가 fallback 거리(120px) 기준으로 판정
    fireEvent.pointerDown(handle, {pointerId: 1, clientY: 300});
    fireEvent.pointerMove(handle, {pointerId: 1, clientY: 500});
    fireEvent.pointerUp(handle, {pointerId: 1, clientY: 500});
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose after a short slow handle drag', () => {
    const onClose = jest.fn();
    render(
      <BottomSheet open onClose={onClose} testID="sheet">
        <div>본문</div>
      </BottomSheet>,
    );
    const handle = screen.getByTestId('sheet-handle');
    fireEvent.pointerDown(handle, {pointerId: 1, clientY: 300});
    fireEvent.pointerMove(handle, {pointerId: 1, clientY: 310});
    fireEvent.pointerUp(handle, {pointerId: 1, clientY: 310});
    // dy=10 → 거리 임계 미달, 플릭 최소 거리(24px)도 미달
    expect(onClose).not.toHaveBeenCalled();
  });
});
```

(서브컴포넌트/aria 연결 테스트는 Task 3에서 추가한다.)

- [x] **Step 2: 테스트 실패 확인**

Run: `pnpm test -- --selectProjects web BottomSheet`
Expected: FAIL — `Cannot find module './BottomSheet.web'`

- [x] **Step 3: BottomSheet.web.tsx 컨테이너 구현**

`src/components/BottomSheet/BottomSheet.web.tsx`:

```tsx
/**
 * BottomSheet — Web implementation.
 *
 * createPortal(document.body)로 scrim+표면을 하단 정렬(flex-end) 렌더해 부모
 * overflow/stacking context를 탈출한다. scrim 클릭/Esc로 onClose를 호출하고,
 * 핸들 영역 Pointer Events 드래그로 디스미스한다(판정: shouldDismiss 공유 함수).
 * 표면 클릭은 stopPropagation으로 scrim까지 전파되지 않는다.
 */
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import type {BottomSheetWebProps} from './types';
import {BottomSheetContext} from './BottomSheetContext';
import {
  getBottomSheetStyles,
  SCRIM_COLOR,
  DEFAULT_MAX_HEIGHT_RATIO,
} from './BottomSheet.styles';
import {shouldDismiss} from './dismiss';
import {zIndex, shadowsCss, duration, easing} from '../../core/theme/tokens';
import {cssifyWebStyles} from '../../core/utils/cssifyWebStyles';

const sheetStyles = getBottomSheetStyles();

// Per-instance id source. `useId`는 React 18+라 peer range(react >=17)에서 금지.
// 표면은 client-only `mounted` 게이트 뒤에서만 렌더되므로 SSR 불일치 없음.
let sheetIdCounter = 0;

function BottomSheetBase({
  open,
  onClose,
  closeOnScrimClick = true,
  closeOnEsc = true,
  dragToClose = true,
  maxHeightRatio = DEFAULT_MAX_HEIGHT_RATIO,
  children,
  className,
  style,
  testID,
}: BottomSheetWebProps) {
  const [{titleId, descriptionId}] = useState(() => {
    sheetIdCounter += 1;
    return {
      titleId: `wb-bottomsheet-title-${sheetIdCounter}`,
      descriptionId: `wb-bottomsheet-desc-${sheetIdCounter}`,
    };
  });

  const [hasTitle, setHasTitle] = useState(false);
  const [hasDescription, setHasDescription] = useState(false);

  const contextValue = useMemo(
    () => ({
      titleId,
      descriptionId,
      registerTitle: setHasTitle,
      registerDescription: setHasDescription,
    }),
    [titleId, descriptionId],
  );

  // onClose ref — Esc 리스너/드래그 핸들러가 항상 최신 콜백을 보도록
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // SSR / hydration 게이트 — createPortal은 document.body 필요
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Esc 리스너는 열려 있고 closeOnEsc일 때만 등록
  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, closeOnEsc]);

  // 핸들 드래그 상태. dragY는 렌더에 반영되므로 state, 나머지는 ref.
  const surfaceRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({active: false, startY: 0, startTime: 0});
  const [dragY, setDragY] = useState(0);
  const [snapping, setSnapping] = useState(false);

  if (!open || !mounted || typeof document === 'undefined') return null;

  const onHandlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = {active: true, startY: e.clientY, startTime: Date.now()};
    setSnapping(false);
    // jsdom에는 setPointerCapture가 없으므로 optional 호출
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onHandlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    setDragY(Math.max(0, e.clientY - dragRef.current.startY));
  };

  const onHandlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    const dy = Math.max(0, e.clientY - dragRef.current.startY);
    const elapsed = Math.max(1, Date.now() - dragRef.current.startTime);
    const sheetHeight = surfaceRef.current?.offsetHeight ?? 0;
    if (shouldDismiss(dy, dy / elapsed, sheetHeight)) {
      setDragY(0);
      onCloseRef.current();
    } else {
      setSnapping(true);
      setDragY(0);
    }
  };

  const handleAreaCss = {
    ...(cssifyWebStyles(sheetStyles.handleArea) as React.CSSProperties),
    display: 'flex',
    flexDirection: 'column' as const,
    touchAction: 'none' as const,
    cursor: 'grab',
  };

  return createPortal(
    <BottomSheetContext.Provider value={contextValue}>
      <div
        data-testid={testID ? `${testID}-scrim` : 'bottomsheet-scrim'}
        onClick={closeOnScrimClick ? onClose : undefined}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: SCRIM_COLOR,
          display: 'flex',
          alignItems: 'flex-end',
          zIndex: zIndex.modal,
          animation: `wbSheetScrimIn ${duration.normal}ms ease-out`,
        }}>
        <div
          ref={surfaceRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={hasTitle ? titleId : undefined}
          aria-describedby={hasDescription ? descriptionId : undefined}
          className={className}
          data-testid={testID}
          onClick={e => e.stopPropagation()}
          style={{
            ...sheetStyles.surface,
            display: 'flex',
            flexDirection: 'column',
            maxHeight: `${maxHeightRatio * 100}vh`,
            boxShadow: shadowsCss.modal,
            transform: `translateY(${dragY}px)`,
            transition: snapping
              ? `transform ${duration.normal}ms ${easing.out}`
              : undefined,
            animation: `wbSheetSurfaceIn 220ms ${easing.out}`,
            ...style,
          }}>
          {dragToClose && (
            <div
              data-testid={testID ? `${testID}-handle` : 'bottomsheet-handle'}
              onPointerDown={onHandlePointerDown}
              onPointerMove={onHandlePointerMove}
              onPointerUp={onHandlePointerUp}
              style={handleAreaCss}>
              <div
                style={cssifyWebStyles(sheetStyles.handle) as React.CSSProperties}
              />
            </div>
          )}
          {children}
        </div>
        <style>
          {`@keyframes wbSheetScrimIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes wbSheetSurfaceIn {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }`}
        </style>
      </div>
    </BottomSheetContext.Provider>,
    document.body,
  );
}

export {BottomSheetBase as BottomSheet};
```

참고: 마지막 줄 export는 Task 3에서 서브컴포넌트 attach 형태로 교체된다.
`cssifyWebStyles` 시그니처가 Dialog.web.tsx와 다르게 동작하면(예: `mergeStyles`
필요) Dialog.web.tsx의 사용 방식을 그대로 따른다.

- [x] **Step 4: 테스트 통과 확인**

Run: `pnpm test -- --selectProjects web BottomSheet`
Expected: PASS (10 tests)

- [x] **Step 5: 커밋**

```bash
git add src/components/BottomSheet/BottomSheet.web.tsx src/components/BottomSheet/BottomSheet.web.test.tsx
git commit -m "feat(BottomSheet): web container with portal, scrim, Esc, handle drag"
```

---

### Task 3: Web 서브컴포넌트 + aria 배선 + facade

**Files:**
- Modify: `src/components/BottomSheet/BottomSheet.web.tsx` (서브컴포넌트 + attach 추가)
- Create: `src/components/BottomSheet/BottomSheet.tsx`
- Modify: `src/components/BottomSheet/BottomSheet.web.test.tsx` (테스트 추가)

- [x] **Step 1: 서브컴포넌트/aria 실패 테스트 추가**

`BottomSheet.web.test.tsx`의 describe 블록 안에 추가:

```tsx
  it('renders subcomponents and wires aria-labelledby to the title', () => {
    render(
      <BottomSheet open onClose={() => {}}>
        <BottomSheet.Header>
          <BottomSheet.Title>제목</BottomSheet.Title>
          <BottomSheet.Description>설명</BottomSheet.Description>
        </BottomSheet.Header>
        <BottomSheet.Body>본문</BottomSheet.Body>
        <BottomSheet.Footer>
          <button>확인</button>
        </BottomSheet.Footer>
      </BottomSheet>,
    );
    const surface = screen.getByRole('dialog');
    const labelledBy = surface.getAttribute('aria-labelledby');
    const title = screen.getByText('제목');
    expect(title).toHaveAttribute('id', labelledBy);
    const describedBy = surface.getAttribute('aria-describedby');
    const description = screen.getByText('설명');
    expect(description).toHaveAttribute('id', describedBy);
    expect(screen.getByText('본문')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: '확인'})).toBeInTheDocument();
  });

  it('omits aria-describedby when no Description is rendered', () => {
    render(
      <BottomSheet open onClose={() => {}}>
        <BottomSheet.Header>
          <BottomSheet.Title>제목만</BottomSheet.Title>
        </BottomSheet.Header>
        <BottomSheet.Body>본문</BottomSheet.Body>
      </BottomSheet>,
    );
    const surface = screen.getByRole('dialog');
    expect(surface).not.toHaveAttribute('aria-describedby');
    expect(surface).toHaveAttribute('aria-labelledby');
  });

  it('exposes subcomponents as standalone named exports', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('./BottomSheet');
    expect(typeof mod.BottomSheetHeader).toBe('function');
    expect(typeof mod.BottomSheetTitle).toBe('function');
    expect(typeof mod.BottomSheetDescription).toBe('function');
    expect(typeof mod.BottomSheetBody).toBe('function');
    expect(typeof mod.BottomSheetFooter).toBe('function');
  });
```

동시에 파일 상단 import를 facade 기준으로 변경: `import {BottomSheet} from './BottomSheet';`

- [x] **Step 2: 테스트 실패 확인**

Run: `pnpm test -- --selectProjects web BottomSheet`
Expected: FAIL — `BottomSheet.Header is not a function` 또는 module not found

- [x] **Step 3: 서브컴포넌트 + attach 구현**

`BottomSheet.web.tsx`에서 임시 export(`export {BottomSheetBase as BottomSheet}`)를
제거하고 아래를 추가. import에 `useContext`와 `mergeStyles`, 서브컴포넌트 props
타입들을 추가한다:

```tsx
export function BottomSheetHeader({
  children,
  style,
  className,
}: BottomSheetHeaderProps) {
  const css = cssifyWebStyles(
    mergeStyles(sheetStyles.header, style),
  ) as React.CSSProperties;
  return (
    <div className={className} style={css}>
      {children}
    </div>
  );
}
BottomSheetHeader.displayName = 'BottomSheetHeader';

export function BottomSheetTitle({
  children,
  style,
  className,
}: BottomSheetTitleProps) {
  const ctx = useContext(BottomSheetContext);
  const register = ctx?.registerTitle;
  useEffect(() => {
    register?.(true);
    return () => register?.(false);
  }, [register]);
  const css = cssifyWebStyles(
    mergeStyles(sheetStyles.title, {margin: 0}, style),
  ) as React.CSSProperties;
  return (
    <h2 id={ctx?.titleId} className={className} style={css}>
      {children}
    </h2>
  );
}
BottomSheetTitle.displayName = 'BottomSheetTitle';

export function BottomSheetDescription({
  children,
  style,
  className,
}: BottomSheetDescriptionProps) {
  const ctx = useContext(BottomSheetContext);
  const register = ctx?.registerDescription;
  useEffect(() => {
    register?.(true);
    return () => register?.(false);
  }, [register]);
  const css = cssifyWebStyles(
    mergeStyles(sheetStyles.description, {margin: 0}, style),
  ) as React.CSSProperties;
  return (
    <p id={ctx?.descriptionId} className={className} style={css}>
      {children}
    </p>
  );
}
BottomSheetDescription.displayName = 'BottomSheetDescription';

export function BottomSheetBody({
  children,
  style,
  className,
}: BottomSheetBodyProps) {
  const css = cssifyWebStyles(
    mergeStyles(sheetStyles.body, style),
  ) as React.CSSProperties;
  return (
    <div className={className} style={{...css, overflowY: 'auto'}}>
      {children}
    </div>
  );
}
BottomSheetBody.displayName = 'BottomSheetBody';

export function BottomSheetFooter({
  children,
  style,
  className,
}: BottomSheetFooterProps) {
  const css = cssifyWebStyles(
    mergeStyles(sheetStyles.footer, style),
  ) as React.CSSProperties;
  return (
    <div className={className} style={css}>
      {children}
    </div>
  );
}
BottomSheetFooter.displayName = 'BottomSheetFooter';

interface BottomSheetComponent {
  (props: BottomSheetWebProps): React.ReactElement | null;
  displayName?: string;
  Header: typeof BottomSheetHeader;
  Title: typeof BottomSheetTitle;
  Description: typeof BottomSheetDescription;
  Body: typeof BottomSheetBody;
  Footer: typeof BottomSheetFooter;
}

const BottomSheet = BottomSheetBase as unknown as BottomSheetComponent;
BottomSheet.displayName = 'BottomSheet';
BottomSheet.Header = BottomSheetHeader;
BottomSheet.Title = BottomSheetTitle;
BottomSheet.Description = BottomSheetDescription;
BottomSheet.Body = BottomSheetBody;
BottomSheet.Footer = BottomSheetFooter;

export {BottomSheet};
```

- [x] **Step 4: facade 작성**

`src/components/BottomSheet/BottomSheet.tsx`:

```tsx
// Web-side facade fallback: Metro reads src/ directly and resolves .native via platform extensions.
export {
  BottomSheet,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetDescription,
  BottomSheetBody,
  BottomSheetFooter,
} from './BottomSheet.web';
```

- [x] **Step 5: 테스트 통과 확인**

Run: `pnpm test -- --selectProjects web BottomSheet`
Expected: PASS (13 tests)

- [x] **Step 6: 커밋**

```bash
git add src/components/BottomSheet/
git commit -m "feat(BottomSheet): web subcomponents with aria wiring + dot-notation API"
```

---

### Task 4: Native 구현 — RN Modal + PanResponder

**Files:**
- Create: `src/components/BottomSheet/BottomSheet.native.tsx`

native는 호스트 앱이 E2E를 소유하므로(jest RN preset 없음) 이 태스크는
typecheck/lint로 검증한다.

- [x] **Step 1: BottomSheet.native.tsx 작성**

```tsx
/**
 * BottomSheet — React Native implementation.
 *
 * RN 내장 <Modal transparent animationType="slide">가 진입/퇴장 슬라이드와
 * Android back(onRequestClose)을 처리한다. 핸들 영역 PanResponder 드래그로
 * 디스미스하며(판정: shouldDismiss 공유 함수), 닫힘 판정 시 translateY를
 * 리셋하지 않아 Modal slide-out이 현재 위치에서 이어진다. scrim Pressable
 * 클릭으로 onClose, 표면 Pressable이 터치 전파를 차단한다.
 */
import {useEffect, useRef, type ReactElement} from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import type {
  BottomSheetNativeProps,
  BottomSheetHeaderProps,
  BottomSheetTitleProps,
  BottomSheetDescriptionProps,
  BottomSheetBodyProps,
  BottomSheetFooterProps,
} from './types';
import {
  getBottomSheetStyles,
  SCRIM_COLOR,
  DEFAULT_MAX_HEIGHT_RATIO,
} from './BottomSheet.styles';
import {shouldDismiss} from './dismiss';
import {shadows} from '../../core/theme/tokens';

const sheetStyles = getBottomSheetStyles();

function BottomSheetBase({
  open,
  onClose,
  closeOnScrimClick = true,
  closeOnEsc = true,
  dragToClose = true,
  maxHeightRatio = DEFAULT_MAX_HEIGHT_RATIO,
  children,
  style,
  testID,
}: BottomSheetNativeProps) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  const translateY = useRef(new Animated.Value(0)).current;
  const sheetHeightRef = useRef(0);

  // 재오픈 시 직전 드래그 잔여 위치 초기화
  useEffect(() => {
    if (open) translateY.setValue(0);
  }, [open, translateY]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_evt, g) => {
        translateY.setValue(Math.max(0, g.dy));
      },
      onPanResponderRelease: (_evt, g) => {
        const dy = Math.max(0, g.dy);
        if (shouldDismiss(dy, Math.max(0, g.vy), sheetHeightRef.current)) {
          onCloseRef.current();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const maxHeight = Dimensions.get('window').height * maxHeightRatio;

  return (
    <Modal
      visible={open}
      transparent
      animationType="slide"
      onRequestClose={closeOnEsc ? onClose : () => {}}>
      <Pressable
        testID={testID ? `${testID}-scrim` : 'bottomsheet-scrim'}
        onPress={closeOnScrimClick ? onClose : undefined}
        style={styles.scrim}>
        <Animated.View
          style={[styles.sheetWrap, {transform: [{translateY}]}]}
          onLayout={e => {
            sheetHeightRef.current = e.nativeEvent.layout.height;
          }}>
          <Pressable
            testID={testID}
            onPress={() => {}}
            style={[
              sheetStyles.surface as ViewStyle,
              shadows.modal,
              {maxHeight},
              style,
            ]}>
            {dragToClose && (
              <View
                testID={testID ? `${testID}-handle` : 'bottomsheet-handle'}
                {...panResponder.panHandlers}
                style={sheetStyles.handleArea as ViewStyle}>
                <View style={sheetStyles.handle as ViewStyle} />
              </View>
            )}
            <SafeAreaView style={styles.content}>{children}</SafeAreaView>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

export function BottomSheetHeader({children, style}: BottomSheetHeaderProps) {
  return (
    <View style={[sheetStyles.header as ViewStyle, style as ViewStyle]}>
      {children}
    </View>
  );
}
BottomSheetHeader.displayName = 'BottomSheetHeader';

export function BottomSheetTitle({children, style}: BottomSheetTitleProps) {
  return (
    <Text style={[sheetStyles.title as TextStyle, style as TextStyle]}>
      {children}
    </Text>
  );
}
BottomSheetTitle.displayName = 'BottomSheetTitle';

export function BottomSheetDescription({
  children,
  style,
}: BottomSheetDescriptionProps) {
  return (
    <Text style={[sheetStyles.description as TextStyle, style as TextStyle]}>
      {children}
    </Text>
  );
}
BottomSheetDescription.displayName = 'BottomSheetDescription';

export function BottomSheetBody({children, style}: BottomSheetBodyProps) {
  return (
    <ScrollView
      style={styles.bodyScroll}
      contentContainerStyle={[sheetStyles.body as ViewStyle, style as ViewStyle]}>
      {children}
    </ScrollView>
  );
}
BottomSheetBody.displayName = 'BottomSheetBody';

export function BottomSheetFooter({children, style}: BottomSheetFooterProps) {
  return (
    <View style={[sheetStyles.footer as ViewStyle, style as ViewStyle]}>
      {children}
    </View>
  );
}
BottomSheetFooter.displayName = 'BottomSheetFooter';

interface BottomSheetComponent {
  (props: BottomSheetNativeProps): ReactElement | null;
  displayName?: string;
  Header: typeof BottomSheetHeader;
  Title: typeof BottomSheetTitle;
  Description: typeof BottomSheetDescription;
  Body: typeof BottomSheetBody;
  Footer: typeof BottomSheetFooter;
}

const BottomSheet = BottomSheetBase as unknown as BottomSheetComponent;
BottomSheet.displayName = 'BottomSheet';
BottomSheet.Header = BottomSheetHeader;
BottomSheet.Title = BottomSheetTitle;
BottomSheet.Description = BottomSheetDescription;
BottomSheet.Body = BottomSheetBody;
BottomSheet.Footer = BottomSheetFooter;

export {BottomSheet};

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: SCRIM_COLOR,
  },
  sheetWrap: {
    width: '100%',
  },
  content: {
    flexShrink: 1,
  },
  bodyScroll: {
    flexGrow: 0,
  },
});
```

- [x] **Step 2: typecheck + lint**

Run: `pnpm typecheck && pnpm lint`
Expected: 에러 없음

- [x] **Step 3: 커밋**

```bash
git add src/components/BottomSheet/BottomSheet.native.tsx
git commit -m "feat(BottomSheet): react native implementation with RN Modal + PanResponder"
```

---

### Task 5: barrel exports, 스토리북, 전체 검증

**Files:**
- Create: `src/components/BottomSheet/index.ts`
- Create: `src/components/BottomSheet/BottomSheet.web.stories.tsx`
- Modify: `src/components/index.ts`

- [x] **Step 1: index.ts 작성**

`src/components/BottomSheet/index.ts`:

```ts
export type {
  BottomSheetProps,
  BottomSheetBaseProps,
  BottomSheetWebProps,
  BottomSheetNativeProps,
  BottomSheetSectionProps,
  BottomSheetHeaderProps,
  BottomSheetTitleProps,
  BottomSheetDescriptionProps,
  BottomSheetBodyProps,
  BottomSheetFooterProps,
} from './types';
export {
  BottomSheet,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetDescription,
  BottomSheetBody,
  BottomSheetFooter,
} from './BottomSheet';
```

(`shouldDismiss`는 내부 구현 — export하지 않는다.)

- [x] **Step 2: components index 등록**

`src/components/index.ts`의 `export * from './Badge';` 다음 줄에 추가:

```ts
export * from './BottomSheet';
```

- [x] **Step 3: 스토리 작성**

`src/components/BottomSheet/BottomSheet.web.stories.tsx`:

```tsx
import type {Meta, StoryObj} from '@storybook/react';
import React, {useState} from 'react';
import {BottomSheet} from './BottomSheet';
import {Button} from '../Button';

const meta: Meta<typeof BottomSheet> = {
  title: 'Components/BottomSheet',
  component: BottomSheet,
  parameters: {layout: 'centered'},
};
export default meta;

type Story = StoryObj<typeof BottomSheet>;

function SheetDemo({
  dragToClose,
  closeOnScrimClick,
  longBody,
}: {
  dragToClose?: boolean;
  closeOnScrimClick?: boolean;
  longBody?: boolean;
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
          {longBody
            ? Array.from({length: 40}, (_, i) => (
                <p key={i}>스크롤 콘텐츠 {i + 1}</p>
              ))
            : '본문 콘텐츠'}
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
export const LongContent: Story = {render: () => <SheetDemo longBody />};
export const NoDrag: Story = {render: () => <SheetDemo dragToClose={false} />};
export const NoScrimClose: Story = {
  render: () => <SheetDemo closeOnScrimClick={false} />,
};
```

- [x] **Step 4: 전체 검증**

Run: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`
Expected: 모두 통과. (스토리북 수동 확인은 `pnpm storybook` — 선택)

- [x] **Step 5: 커밋**

```bash
git add src/components/BottomSheet/ src/components/index.ts
git commit -m "feat(BottomSheet): barrel exports, storybook, register in components index"
```
