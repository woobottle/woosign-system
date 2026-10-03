<div align="center">

# woosign-system

**WooBottle "Paper & Ink" design system — one API, two platforms.**

Warm cream canvas · deep-ink surfaces · ember CTAs · ceremonial gold.
Cross-platform React Native + Web, hand-tuned to the WooBottle spec.

![status](https://img.shields.io/badge/status-alpha-F4EFE6?labelColor=171513&color=D35B1F&style=flat-square)
![ci](https://img.shields.io/github/actions/workflow/status/woobottle/woosign-system/ci.yml?branch=main&style=flat-square&labelColor=171513&color=D35B1F)
![react](https://img.shields.io/badge/React-19-171513?style=flat-square)
![rn](https://img.shields.io/badge/React_Native-0.78-171513?style=flat-square)
![ts](https://img.shields.io/badge/TypeScript-strict-171513?style=flat-square)
![license](https://img.shields.io/badge/license-private-171513?style=flat-square)

</div>

---

## The brand, in one paragraph

> WooBottle is a warm, calm, product-trust interface system. It starts from a
> **soft cream canvas** instead of stark white, then layers in a tiered
> ink-and-ember hierarchy so emphasis is earned by role — not shouted through
> saturation. Buttons are full-pill. Cards are 12px islands. Shadows are a
> whisper. It's coffeehouse-adjacent: grounded, breathable, confident.

## Quick look

| Role | Token | Hex |
|---|---|---|
| Page canvas | `colors.canvas` | `#F4EFE6` |
| Section surface | `colors.section` | `#EAE4D8` |
| Card island | `colors.card` | `#FFFFFF` |
| Inverse surface | `colors.inverse` | `#171513` |
| Brand ink | `colors.brand` | `#2A2622` |
| Primary CTA | `colors.actionPrimary` | `#D35B1F` |
| Ceremonial gold | `colors.gold` | `#C98A3C` |
| Error | `colors.actionDanger` | `#B02818` |

---

## Install

```bash
pnpm add woosign-system
# or
npm i woosign-system
```

Host app also needs peer deps: `react`, and optionally `react-native` if
you're shipping to iOS/Android.

## Use it

```tsx
import { ThemeProvider, Button, Card, Badge } from 'woosign-system';

export function App() {
  return (
    <ThemeProvider>
      <Card>
        <Badge variant="gold">Members</Badge>
        <Button onPress={() => order()}>Order now</Button>
      </Card>
    </ThemeProvider>
  );
}
```

The same code renders on web and native — platform extensions
(`.web.tsx` / `.native.tsx`) switch implementations automatically.

---

## Components

### Core

| | Variants |
|---|---|
| **Button** | `default`, `secondary`, `outline`, `ghost`, `dark`, `inverse`, `destructive`, `link` |
| **Card**   | `default` (white island), `outline`, `ghost`, `warm`, `ceramic`, `inverse` |
| **Badge**  | `default`, `secondary`, `brand`, `gold`, `success`, `reward`, `outline`, `destructive` |
| **Input**  | `default`, `error` · `sm / default / lg` |
| **Textarea** | Multiline input · `default`, `error` · `sm / default / lg` |
| **Select** | Single selection · HTML select (web), BottomSheet choices (native) |
| **Checkbox** | Checked / unchecked / indeterminate |
| **RadioGroup / Radio** | Single-choice groups |
| **Switch** | `default` · `sm / default / lg` |
| **Text**   | `h1–h4`, `p`, `lead`, `large`, `small`, `muted` |
| **Box**    | Flex-first layout primitive with padding/margin/gap/radius tokens |

### Brand primitives

| | Purpose |
|---|---|
| **Chip** | Square-cornered tag — `default`, `solid`, `outline` |
| **Pill** | Selectable filter — `active` / inactive, Pressable |
| **Tabs** | Underline tab rail, light + inverse surfaces |
| **Fab** | 56px floating action button — `ember` / `ink` / `gold`, layered shadow |
| **FeatureBand** | Deep-ink, ember, or reward feature band — the brand's hero surface |
| **Progress** | Gold/ember/ink fill on light or inverse rail |
| **StatusDot** | Tinted circle wrapper for icons — `success` / `danger` / `brand` / `neutral` |
| **Toast** | Floating notification with leading StatusDot |
| **Eyebrow** | Tracked, uppercased label — `default` / `brand` / `gold` / `inverse` |
| **Divider** | Hairline separator, horizontal or vertical, light or inverse |

### Overlays

| | Purpose |
|---|---|
| **Dialog** | Controlled modal — portal scrim (web) / RN Modal (native), Esc & Android back, `Header/Title/Description/Body/Footer` |
| **DialogProvider / useDialog** | Imperative layer over Dialog — `await useDialog().confirm({...})` → `Promise<boolean>`, `.alert({...})` → `Promise<void>`, queued one-at-a-time |
| **BottomSheet** | Controlled bottom sheet — drag-to-dismiss grabber handle, content-based height with `maxHeightRatio` cap, same subcomponent API |

| **Drawer** | Controlled side panel, shared overlay sections |

`useDialog().prompt({...})` resolves to the submitted text or `null` on cancel.

All components expose the same `ButtonProps`/`CardProps`/etc. on both
platforms — TypeScript is the contract.

## Design tokens

One source of truth for both platforms (`src/core/theme/tokens.ts`):

```ts
import { colors, typography, borderRadius, shadows, wbSpace } from 'woosign-system';

colors.actionPrimary     // '#D35B1F'
borderRadius.pill         // 999 — buttons are ALWAYS pill
typography.fontSize.headingMd  // { size: 24, lineHeight: 36 }
wbSpace[4]                // 24 — WooBottle's named spacing scale
shadows.card              // layered low-alpha card elevation
```

Shadcn-compat aliases (`primary`, `secondary`, `muted`, `ring`, …) are
preserved so existing integrations keep working.

### Dark mode

Wrap your app (or a subtree) in `<ThemeProvider>` and the converted components
follow the active scheme:

```tsx
import { ThemeProvider, useResolvedColors } from 'woosign-system';

<ThemeProvider defaultColorScheme="dark">
  <App />
</ThemeProvider>
```

Without a `ThemeProvider`, components render the light palette exactly as before —
fully backward compatible. Component styles read theme colors via the
`useResolvedColors()` hook (theme colors under a provider, static light fallback
otherwise). **All components consume theme colors**, so wrapping any subtree in
`<ThemeProvider>` switches it to dark. Storybook has a Light/Dark toolbar toggle.

## Fonts

**Web** — drop an `@font-face` rule pointing at `woosign-system/src/assets/fonts`:
```css
@font-face {
  font-family: 'Woobottle';
  src: url('woosign-system/src/assets/fonts/Woobottle-Regular.woff2') format('woff2');
  font-display: swap;
}
```

**React Native** — one-time setup after install:
```bash
npx react-native-asset
```
Fonts get linked into Xcode + `UIAppFonts` and copied into
`android/app/src/main/assets/fonts/`.

Then cross-platform access via the helper:
```ts
import { resolveFontFamily } from 'woosign-system';

<Text style={{ fontFamily: resolveFontFamily('display') }}>
  A warmer kind of morning.
</Text>
```

---

## Playground

### Web Storybook
```bash
pnpm storybook          # → http://localhost:6006
pnpm build-storybook    # static export → storybook-static/
```

### Native Storybook (iOS / Android)
```bash
pnpm storybook:native:generate
pnpm storybook:native:ios     # or :android
```

---

## Dev commands

```bash
pnpm build        # build with react-native-builder-bob (cjs + esm + dts)
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint src/**
pnpm test         # Jest behavior tests (web + native + shared utilities)
```

## CI & release

- **CI** — `.github/workflows/ci.yml` runs typecheck, lint (core + components),
  smoke tests, build, and verifies the published tarball has no stories /
  examples / duplicated font assets. Triggered on every push and PR.
- **Release** — `.github/workflows/release.yml` publishes to npm with
  provenance when a `v*.*.*` tag is pushed. Requires the `NPM_TOKEN` secret
  or npm trusted publishing configured for `woobottle/woosign-system`, workflow `release.yml`, environment `npm`. The release job uses Node 22 and npm 11 for OIDC support.

Cutting a release:
```bash
npm version patch   # bumps package.json + tags
git push --follow-tags
```

## Project layout

```
src/
├── assets/fonts/           Woobottle display + signature faces
├── core/
│   ├── theme/              tokens · types · ThemeContext
│   ├── variants/           createVariants (shared web/native)
│   ├── utils/              platform · colors · resolveFontFamily
│   └── hooks/              useTheme
├── components/
│   ├── Button/             Component.tsx + .web.tsx + .native.tsx
│   ├── Card/  Badge/  Input/  Switch/  Text/  Box/
│   └── Chip/  Pill/  Tabs/  Fab/  FeatureBand/
│       Progress/  StatusDot/  Toast/  Eyebrow/  Divider/
└── examples/              Marketing page + mobile app composed from the library
```

Each component ships:
- `Component.tsx` — platform-agnostic facade
- `Component.web.tsx` — pure React + inline styles
- `Component.native.tsx` — React Native primitives
- `Component.styles.ts` — shared variants
- `types.ts` — the contract

## Principles we don't bend

1. **Buttons are full-pill.** No square, no "slightly rounded" buttons.
2. **Cream over white.** The page is `#F4EFE6`, never `#FFFFFF`.
3. **Green is role-specific.** Ink for bands, brand for headings, ember for CTAs. Don't swap.
4. **Gold is ceremonial.** Rewards, loyalty, achievements. Never a generic accent.
5. **Hover is for promise, not drama.** No lift, no scale on hover. Press is `scale(0.95)`.
6. **Shadows whisper.** Layered, low-alpha — never one heavy drop.

---

<div align="center">
<sub>Made by <a href="https://github.com/wooBottle">wooBottle</a> · Paper &amp; Ink, always.</sub>
</div>

## Form controls

```tsx
import {Select, Textarea} from 'woosign-system';

<Select
  label="Drink"
  options={[{value: 'coffee', label: 'Coffee'}, {value: 'tea', label: 'Tea'}]}
  value={drink}
  onValueChange={setDrink}
/>
<Textarea placeholder="Notes" numberOfLines={4} value={notes} onChangeText={setNotes} />
```

Select supports `defaultValue` for uncontrolled usage and disabled options. Web also
accepts `name`, `id`, and `required` for forms. Native opens a scrollable BottomSheet;
dismissing it keeps the current value. Textarea shares Input props except input type
and multiline toggles, defaults to three rows, and forwards its input ref. Both
controls support size, error, disabled, fullWidth, and theme colors.

## Extended components

The following components have Web and React Native implementations, theme-aware
colors, public TypeScript contracts, Storybook examples and behavior tests.

| Area | Components | Purpose |
|---|---|---|
| 프로필 | Avatar · AvatarGroup | 이미지 실패 시 fallback, 그룹 초과 인원 표시 |
| 상태 | Skeleton · Spinner · Alert · EmptyState | 로딩·진행·인라인 알림·빈 화면 |
| 폼 | Label · FormField | 라벨·설명·오류·필수 표시와 접근성 연결 |
| 콘텐츠 | Accordion · Collapsible · ListItem · AspectRatio · ScrollArea | 접기·펼치기, 목록 행, 비율과 스크롤 |
| 탐색·선택 | Breadcrumb · Pagination · SegmentedControl · Toggle · ToggleGroup | 경로, 페이지, 단일·복수 선택 |
| 입력 | Slider · InputOTP · Combobox | 범위 값, 숫자 인증 코드, 검색 선택 |
| 날짜 | Calendar · DatePicker | YYYY-MM-DD 날짜와 선택 제한 |
| 보조 UI | Tooltip · Popover · DropdownMenu | 도움말·보조 콘텐츠·액션 메뉴 |

Stateful controls support controlled and uncontrolled usage. `Accordion` and
`ToggleGroup` use arrays of values and support `multiple`; `SegmentedControl`
uses a single string. Supply stable, unique `id` values to Accordion, Collapsible,
Combobox, Tooltip and FormField for accessible relationships across SSR and hydration.

Calendar / DatePicker values and bounds are strict local `YYYY-MM-DD` dates.
`isDateDisabled(date)` can block individual dates. Slider supports `min`, `max`,
`step`, change and commit callbacks; native supports dragging and accessibility
increment/decrement actions. InputOTP accepts digits, sanitizes pasted codes,
supports 1–12 slots and calls `onComplete` when a changed code reaches the length.
Skeleton is a static decorative placeholder. Spinner provides a named loading status.

Popover, DropdownMenu, Combobox and DatePicker use existing BottomSheet on native.
Web Popover / DropdownMenu / Tooltip are anchored portals; Escape and outside
click dismiss them. Web menus support arrows, Home/End and typeahead. Tooltip opens
on hover/focus/click on web and by touch on native. Native overlays inherit the
BottomSheet's Android back and scrim dismissal behavior.

```tsx
import {Accordion, Combobox, DatePicker, FormField, Input, ToggleGroup} from 'woosign-system';

<Accordion id="faq" items={[
  {value: 'delivery', title: 'When will it arrive?', content: 'Within 2–3 days.'},
]} />
<Combobox id="drink-search" label="Drink" options={[
  {value: 'coffee', label: 'Coffee'}, {value: 'tea', label: 'Tea'},
]} />
<DatePicker label="Visit date" min="2026-10-01" max="2026-12-31" />
<ToggleGroup label="Filters" multiple items={[
  {value: 'coffee', label: 'Coffee'}, {value: 'tea', label: 'Tea'},
]} />
```

FormField uses a render callback instead of modifying children. On web, pass its
`id`, `required`, `disabled` and ARIA props to the input. On native, pass
`accessibilityLabel` / `accessibilityHint` through `textInputProps`:

```tsx
<FormField id="email" label="Email" error={error}>
  {field => <Input id={field.id} inputProps={{
    'aria-invalid': field['aria-invalid'],
    'aria-describedby': field['aria-describedby'],
  }} />}
</FormField>
```

Platform implementations expose `ComponentWebProps` / `ComponentNativeProps` for
platform-specific styles. See each `src/components/<Name>/types.ts` for the full API.
