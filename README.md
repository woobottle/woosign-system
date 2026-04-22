<div align="center">

# @woosign/ui

**WooBottle "Paper & Ink" design system — one API, two platforms.**

Warm cream canvas · deep-ink surfaces · ember CTAs · ceremonial gold.
Cross-platform React Native + Web, hand-tuned to the WooBottle spec.

![status](https://img.shields.io/badge/status-alpha-F4EFE6?labelColor=171513&color=D35B1F&style=flat-square)
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
pnpm add @woosign/ui
# or
npm i @woosign/ui
```

Host app also needs peer deps: `react`, and optionally `react-native` if
you're shipping to iOS/Android.

## Use it

```tsx
import { ThemeProvider, Button, Card, Badge } from '@woosign/ui';

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

All components expose the same `ButtonProps`/`CardProps`/etc. on both
platforms — TypeScript is the contract.

## Design tokens

One source of truth for both platforms (`src/core/theme/tokens.ts`):

```ts
import { colors, typography, borderRadius, shadows, wbSpace } from '@woosign/ui';

colors.actionPrimary     // '#D35B1F'
borderRadius.pill         // 999 — buttons are ALWAYS pill
typography.fontSize.headingMd  // { size: 24, lineHeight: 36 }
wbSpace[4]                // 24 — WooBottle's named spacing scale
shadows.card              // layered low-alpha card elevation
```

Shadcn-compat aliases (`primary`, `secondary`, `muted`, `ring`, …) are
preserved so existing integrations keep working.

## Fonts

**Web** — drop an `@font-face` rule pointing at `@woosign/ui/src/assets/fonts`:
```css
@font-face {
  font-family: 'Woobottle';
  src: url('@woosign/ui/src/assets/fonts/Woobottle-Regular.woff2') format('woff2');
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
import { resolveFontFamily } from '@woosign/ui';

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
pnpm test         # jest
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
