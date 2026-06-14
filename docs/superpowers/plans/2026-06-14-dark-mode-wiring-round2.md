# 다크모드 컴포넌트 배선 Round 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 라운드1에서 확립한 패턴(`useResolvedColors()` + 색 팩토리)을 나머지 13개 컴포넌트(BottomSheet, Chip, Dialog, Divider, Eyebrow, Fab, FeatureBand, Pill, Progress, StatusDot, Switch, Tabs, Toast)에 적용해 시스템 전역 다크모드를 완성한다.

**Architecture:** 라운드1과 동일. 스타일의 색 의존 정의에 resolved `colors`를 주입하고, 컴포넌트가 렌더 시 `useResolvedColors()`로 색을 읽는다. Provider 없으면 정적 light 폴백(하위호환). NO logic change — 색 출처만 정적→테마.

**Tech Stack:** React(useContext/useMemo), @testing-library/react + jest(jsdom web), 기존 `useResolvedColors`(src/core/hooks).

**Spec/근거:** `docs/superpowers/specs/2026-06-14-dark-mode-wiring-design.md` (라운드1; "나머지 13개는 후속 라운드 동일 패턴"으로 명시). 라운드1 구현 참조: Card(commit 6700e25), Switch가 createVariants 정적이면 Card 방식, 단일 함수형은 colors 인자 주입.

---

## 공통 규칙 (모든 태스크)

세 가지 스타일 형태가 있다. 각 형태별 변환:

**형태 A — 이미 `getXStyle(args)` 단일 함수(렌더에서 호출, 모듈 `colors.` 참조).**
대상: Chip, Pill, Eyebrow, Divider, Fab, FeatureBand, Progress, StatusDot, Tabs.
- styles: 함수 시그니처에 `colors`를 **첫 인자**로 추가 → `export function getXStyle(c: Colors, ...기존인자)`. 본문의 `colors.` → `c.`. `import type {Colors} from '../../core/theme/types';` 추가, 정적 `colors` import 제거.
- 컴포넌트(web+native): 본문에 `const colors = useResolvedColors();`(`import {useResolvedColors} from '../../core/hooks';`) 추가하고, 기존 `getXStyle(tone)` 호출을 `getXStyle(colors, tone)`로. 이미 렌더에서 prop 인자로 호출하므로 `useMemo`는 선택(원하면 `useMemo(() => getXStyle(colors, tone), [colors, tone])`).

**형태 B — 모듈 레벨에서 한 번 호출하는 공유 스타일 객체 (`const xStyles = getXStyles();`).**
대상: BottomSheet, Dialog, Toast.
- styles: `getXStyles()` → `getXStyles(c: Colors)`, 본문 `colors.`→`c.`, `import type {Colors}` 추가, 정적 `colors` 제거.
- 컴포넌트(web+native): **모듈 레벨 `const xStyles = getXStyles();`를 제거**하고, `xStyles`를 쓰는 **각 컴포넌트/서브컴포넌트** 본문에서 `const colors = useResolvedColors(); const xStyles = useMemo(() => getXStyles(colors), [colors]);`로 만든다(변수명 유지). 서브컴포넌트(Header/Title/Body 등)가 각자 `xStyles`를 참조하면 각자 hook+memo를 가진다.

**형태 C — 여러 createVariants 정적 export (Card/Button과 동일).**
대상: Switch.
- 색 의존 export 각각을 `getX = (c: Colors) => <body, colors.→c.>` 팩토리로. 색 무관 export(spacing/dimension 등)는 정적 유지. 컴포넌트는 `useResolvedColors()`+`useMemo`로 빌드(원 변수명 유지).

**다크 테스트(모든 컴포넌트):** 각 컴포넌트의 web 테스트에 다크 케이스 추가(없으면 `X.web.test.tsx` 신규 생성, 최소 구성: 렌더 1 + 다크 1 + light 폴백 1). 다크 테스트는 `<ThemeProvider defaultColorScheme="dark">`로 감싸 렌더하고, 그 컴포넌트의 **대표 색 요소**가 `darkColors.<TOKEN>` 값을 쓰는지 `toHaveStyle`로 검증. TOKEN은 각 태스크가 지정한 **light≠dark 판별 토큰**을 쓴다. 실제 쿼리 대상 요소(testID/getByText/parentElement)는 컴포넌트 렌더 구조를 읽고 확정한다. import: `import {ThemeProvider} from '../../core/theme/ThemeContext';` + `import {colors, darkColors} from '../../core/theme/tokens';`.

**판별 토큰(light≠dark 확인됨):** `card`(#FFF/ink800), `borderDefault`(blk12/wht10), `textSecondary`(blk58/wht70), `inverse`(ink900/cream100), `section`(cream200/ink800), `foreground`(blk87/#FFF), `textBrand`(ink800/#FFF), `textPrimary`(blk87/#FFF). actionPrimary/actionDanger/gold/actionForest는 light=dark이므로 **판별 토큰으로 쓰지 말 것**.

**각 태스크 절차(TDD):** ① 다크 테스트 작성(또는 추가) → ② `pnpm test -- --selectProjects web <X>.web.test` 로 다크 케이스 FAIL 확인 → ③ styles 변환 → ④ web+native 배선 → ⑤ 테스트 PASS + `pnpm typecheck` clean + `pnpm exec eslint <touched files>` 0 errors(--fix 가능) → ⑥ 커밋. 모든 커밋 메시지에 trailer:
`Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`

GIT SAFETY: 해당 컴포넌트 디렉터리만 `git add`, 현재 브랜치(main)에만 커밋. checkout/reset/rebase/branch 금지. 토큰 참조가 `Colors` 타입에 없으면(드묾) 추가하고 `git add src/core/theme/types.ts`도 함께.

---

### Task 1: Chip + Pill + Eyebrow (형태 A)

세 컴포넌트 모두 단일 `getXStyle(tone/active)` 함수. 규칙 형태 A 적용. 각각 web 테스트 신규 생성.

**Chip** (`src/components/Chip/`): `getChipStyles(c, tone)`. 판별 토큰: `card`(default tone의 배경). 테스트: `<Chip>라벨</Chip>` dark → 컨테이너(라벨의 부모 또는 testID) 배경 `darkColors.card`. light 폴백: provider 없이 `colors.card`.

**Pill** (`src/components/Pill/`): `getPillStyles(c, active)`. 판별 토큰: `card`(inactive 배경). 테스트: 비활성 Pill dark → 배경 `darkColors.card`.

**Eyebrow** (`src/components/Eyebrow/`): `getEyebrowStyle(c, tone)`. 판별 토큰: `textSecondary`(default tone 색). 테스트: default Eyebrow dark → 텍스트 색 `darkColors.textSecondary`.

- [ ] **Step 1**: 세 컴포넌트 각각 `X.web.test.tsx` 작성(렌더 + 다크 + light 폴백 3 테스트). 실제 쿼리 요소는 `X.web.tsx` 렌더 구조 확인 후 확정(대개 `getByText`로 라벨, 색 요소는 그 요소 또는 `.parentElement`). 다크 케이스 FAIL 확인.
- [ ] **Step 2**: 세 styles 파일 형태 A 변환(`colors` 첫 인자, `colors.`→`c.`, `import type {Colors}`, 정적 colors 제거).
- [ ] **Step 3**: 각 `X.web.tsx` + `X.native.tsx`에 `useResolvedColors()` 추가하고 `getXStyle(colors, ...)` 호출로 변경.
- [ ] **Step 4**: `pnpm test -- --selectProjects web "Chip.web.test|Pill.web.test|Eyebrow.web.test"` PASS, `pnpm typecheck` clean, eslint 0 errors.
- [ ] **Step 5**: 커밋
```bash
git add src/components/Chip/ src/components/Pill/ src/components/Eyebrow/
git commit -m "feat(Chip,Pill,Eyebrow): consume theme colors (dark mode)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Divider + Fab + FeatureBand (형태 A)

**Divider** (`src/components/Divider/`): `getDividerStyle(c, tone, vertical)`. 판별 토큰: `borderDefault`(default tone 라인 색). 테스트: default Divider dark → 라인 배경/색 `darkColors.borderDefault`.

**Fab** (`src/components/Fab/`): `getFabStyle(c, tone, size)`. 판별 토큰: `inverse`(styles에서 `colors.inverse`로 매핑되는 tone — 파일 읽고 그 tone명 사용). 테스트: 그 tone의 Fab dark → 배경 `darkColors.inverse`.

**FeatureBand** (`src/components/FeatureBand/`): `getFeatureBandStyle(c, tone, rounded)`. 판별 토큰: `inverse`(default tone, `colors.inverse`로 매핑). 테스트: default FeatureBand dark → 배경 `darkColors.inverse`.

- [ ] **Step 1**: 세 `X.web.test.tsx` 작성(렌더+다크+light). 다크 FAIL 확인. (Fab/FeatureBand는 inverse 매핑 tone을 styles에서 확인해 사용.)
- [ ] **Step 2**: 세 styles 형태 A 변환.
- [ ] **Step 3**: web+native 배선.
- [ ] **Step 4**: 테스트 PASS, typecheck clean, eslint 0.
- [ ] **Step 5**: 커밋
```bash
git add src/components/Divider/ src/components/Fab/ src/components/FeatureBand/
git commit -m "feat(Divider,Fab,FeatureBand): consume theme colors (dark mode)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Progress + StatusDot + Tabs (형태 A)

**Progress** (`src/components/Progress/`): `getProgressStyles(c, tone, ...)`. (주의: `normalizeProgress`는 색 무관 — 정적 유지, 변환 대상 아님.) 판별 토큰: `inverse`(ink tone fill, `colors.inverse`로 매핑). 테스트: ink tone Progress dark → fill 배경 `darkColors.inverse`.

**StatusDot** (`src/components/StatusDot/`): `getStatusDotStyle(c, tone, size)`. 판별 토큰: `section`(neutral tone 래퍼 배경 — styles에서 neutral이 `colors.section`). 테스트: neutral StatusDot dark → 래퍼 배경 `darkColors.section`.

**Tabs** (`src/components/Tabs/`): `getTabsStyles(c, inverse)`. 판별 토큰: `textBrand`(active tab 색, non-inverse). 테스트: Tabs dark에서 활성 탭 텍스트 색 `darkColors.textBrand`.

- [ ] **Step 1**: 세 `X.web.test.tsx` 작성(렌더+다크+light). 쿼리 요소는 각 컴포넌트 렌더 읽고 확정(Progress fill, StatusDot 래퍼, Tabs 활성 탭). 다크 FAIL 확인.
- [ ] **Step 2**: 세 styles 형태 A 변환(Progress의 `normalizeProgress`는 그대로).
- [ ] **Step 3**: web+native 배선.
- [ ] **Step 4**: 테스트 PASS, typecheck clean, eslint 0.
- [ ] **Step 5**: 커밋
```bash
git add src/components/Progress/ src/components/StatusDot/ src/components/Tabs/
git commit -m "feat(Progress,StatusDot,Tabs): consume theme colors (dark mode)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Switch (형태 C — createVariants 정적)

`src/components/Switch/Switch.styles.ts`는 Card/Button과 같은 정적 createVariants/객체 형태. 색 의존 export: `switchTrackVariants`, `switchThumbVariants`(bg `colors.background`), `trackColors`(`{checked: colors.primary, unchecked: colors.input}`), `switchLabelVariants`(color `colors.foreground`), `focusRingStyle`(boxShadow `colors.background`/`colors.ring`). 색 무관(정적 유지): `trackDimensions`, `disabledStyle`(opacity 추정), `containerGap`.

규칙 형태 C: 각 색 의존 export를 `getX = (c: Colors) => ...` 팩토리로. `trackColors`는 값 객체 → `getTrackColors = (c) => ({checked: c.primary, unchecked: c.input})`. 컴포넌트는 `useResolvedColors()`+`useMemo`로 빌드(원 변수명 유지).

판별 토큰: `foreground`(라벨 색, light blk87/dark #FFF). 테스트: `<Switch label="다크"/>` dark → 라벨 텍스트 색 `darkColors.foreground`.

- [ ] **Step 1**: `Switch.web.test.tsx` 신규 작성(렌더 + 다크 라벨색 + light 폴백). 라벨 요소는 `getByText`로. 다크 FAIL 확인.
- [ ] **Step 2**: `Switch.styles.ts` 형태 C 변환(색 의존 5개 팩토리화, 색 무관 정적 유지, `import type {Colors}`, 정적 colors 제거).
- [ ] **Step 3**: `Switch.web.tsx` + `Switch.native.tsx` 배선(useResolvedColors + 각 팩토리 useMemo, 원 변수명).
- [ ] **Step 4**: `pnpm test -- --selectProjects web Switch.web.test` PASS, typecheck clean, eslint 0.
- [ ] **Step 5**: 커밋
```bash
git add src/components/Switch/
git commit -m "feat(Switch): consume theme colors via useResolvedColors (dark mode)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: BottomSheet (형태 B — 공유 스타일 객체 + 서브컴포넌트)

`getBottomSheetStyles()` → `getBottomSheetStyles(c: Colors)`(본문 `colors.card/textPrimary/textSecondary` → `c.`). `BottomSheet.web.tsx`/`BottomSheet.native.tsx`의 모듈 레벨 `const sheetStyles = getBottomSheetStyles();`를 제거하고, `sheetStyles`를 쓰는 컨테이너 컴포넌트와 각 서브컴포넌트(Header/Title/Description/Body/Footer 등) 본문에서 `const colors = useResolvedColors(); const sheetStyles = useMemo(() => getBottomSheetStyles(colors), [colors]);`로 만든다(변수명 유지). `SCRIM_COLOR`/`HANDLE_*`/`DEFAULT_MAX_HEIGHT_RATIO`는 색 무관 상수 — 정적 유지.

판별 토큰: `card`(표면 배경). 기존 `BottomSheet.web.test.tsx`에 다크 케이스 추가: `<ThemeProvider defaultColorScheme="dark"><BottomSheet open onClose={()=>{}} testID="sheet">...</BottomSheet></ThemeProvider>` → `screen.getByTestId('sheet')` 표면 배경 `darkColors.card`.

- [ ] **Step 1**: `BottomSheet.web.test.tsx`에 다크 표면 테스트 추가(ThemeProvider/darkColors import 추가). 다크 FAIL 확인.
- [ ] **Step 2**: `BottomSheet.styles.ts` `getBottomSheetStyles(c)` 변환.
- [ ] **Step 3**: web+native에서 모듈 레벨 호출 제거 → 각 컴포넌트/서브컴포넌트에 useResolvedColors+useMemo.
- [ ] **Step 4**: `pnpm test -- --selectProjects web BottomSheet.web.test` PASS(기존 거동 무손상), typecheck clean, eslint 0.
- [ ] **Step 5**: 커밋
```bash
git add src/components/BottomSheet/
git commit -m "feat(BottomSheet): consume theme colors (dark mode)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Dialog (형태 B — 공유 스타일 객체 + 서브컴포넌트)

`getDialogStyles()` → `getDialogStyles(c: Colors)`(본문 `colors.card/textPrimary/textSecondary` → `c.`). `Dialog.web.tsx`/`Dialog.native.tsx`의 모듈 레벨 `const dialogStyles = getDialogStyles();` 제거 → 컨테이너 + 각 서브컴포넌트(Header/Title/Description/Body/Footer)에서 useResolvedColors+useMemo(변수명 유지). `SIZE_MAX_WIDTH`/`SCRIM_COLOR`는 색 무관 — 정적 유지. (임퍼러티브 DialogProvider는 controlled Dialog를 렌더하므로 자동으로 다크 반응 — 추가 변경 불필요.)

판별 토큰: `card`(표면 배경). 기존 `Dialog.web.test.tsx`에 다크 케이스 추가: dark provider로 감싼 Dialog 표면(`getByTestId` 또는 `getByRole('dialog')`) 배경 `darkColors.card`.

- [ ] **Step 1**: `Dialog.web.test.tsx`에 다크 표면 테스트 추가. 다크 FAIL 확인.
- [ ] **Step 2**: `Dialog.styles.ts` `getDialogStyles(c)` 변환.
- [ ] **Step 3**: web+native 모듈 호출 제거 → 컴포넌트/서브컴포넌트 useResolvedColors+useMemo.
- [ ] **Step 4**: `pnpm test -- --selectProjects web Dialog.web.test` PASS, typecheck clean, eslint 0.
- [ ] **Step 5**: 커밋
```bash
git add src/components/Dialog/
git commit -m "feat(Dialog): consume theme colors (dark mode)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: Toast (형태 B — 공유 스타일 객체 + 서브컴포넌트/Provider)

`getToastStyles()` → `getToastStyles(c: Colors)`(본문 `colors.card/textPrimary/textSecondary` → `c.`). `getDefaultGlyph`는 색 무관(문자 반환) — 정적 유지. `Toast.web.tsx`/`Toast.native.tsx`의 모듈 레벨 `const toastStyles = getToastStyles();` 제거 → Toast(및 서브요소) 본문에서 useResolvedColors+useMemo(변수명 유지). ToastProvider는 Toast를 렌더하므로 자동 다크 반응.

판별 토큰: `card`(표면 배경). `Toast.web.test.tsx`가 없으면 신규 생성: Toast를 단독 렌더(또는 ToastProvider+useToast로 띄움)해서 dark에서 표면 배경 `darkColors.card` 확인 + light 폴백. (Toast를 단독으로 직접 렌더할 수 있으면 그게 가장 단순 — `<Toast title="..." />`를 ThemeProvider dark로 감싸고 testID/role로 표면 쿼리.)

- [ ] **Step 1**: `Toast.web.test.tsx` 신규(또는 기존에 추가): 렌더 + 다크 표면 배경 + light 폴백. 다크 FAIL 확인.
- [ ] **Step 2**: `Toast.styles.ts` `getToastStyles(c)` 변환(`getDefaultGlyph` 정적 유지).
- [ ] **Step 3**: web+native 모듈 호출 제거 → useResolvedColors+useMemo.
- [ ] **Step 4**: `pnpm test -- --selectProjects web Toast.web.test` PASS, typecheck clean, eslint 0.
- [ ] **Step 5**: 커밋
```bash
git add src/components/Toast/
git commit -m "feat(Toast): consume theme colors (dark mode)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 8: 전체 검증 + 문서 갱신

- [ ] **Step 1: 전 컴포넌트 잔여 정적 colors 점검** — Run:
```bash
grep -rln "from '../../core/theme/tokens'" src/components/*/*.styles.ts | xargs grep -l "\bcolors\b" || echo "no styles file references static colors ✓"
```
Expected: 색 의존 styles에 정적 `colors` 참조가 남아있지 않음(색 무관 styles가 다른 토큰만 import하는 건 OK). 남아있으면 해당 컴포넌트가 미전환이거나 형태 누락 — 보완.

- [ ] **Step 2: 전체 검증** — Run: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`
Expected: typecheck clean; CI-스코프 lint 0 errors(테스트 파일 prettier 포함; 필요 시 `pnpm exec eslint --fix`); web+native 전체 그린(13개 신규/추가 다크 테스트 포함); build 성공.

CI-스코프 lint 직접 확인:
```bash
pnpm exec eslint "src/core/**/*.ts" "src/core/**/*.tsx" "src/components/**/!(*.stories).ts" "src/components/**/!(*.stories).tsx" --max-warnings 9999
```
Expected: 0 errors.

- [ ] **Step 3: README 갱신** — `README.md`의 다크모드 섹션에서 "Converted so far: **Card, Button, Badge, Text, Input**" 문구를 전 컴포넌트 전환 완료로 수정(예: "All components consume theme colors; wrap in `<ThemeProvider>` to enable dark mode."). 라운드2 잔여 메모(Input.native focus border 등)가 해소됐으면 반영.

- [ ] **Step 4: 커밋**
```bash
git add README.md
git commit -m "docs: dark mode now covers all components (round 2 complete)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
