/**
 * WooSign / WooBottle Design Tokens — "Paper & Ink"
 *
 * A warm-neutral, product-trust palette: cream canvas, deep ink surfaces,
 * warm ember CTA, ceremonial gold. Hierarchy lives in weight + spacing + color.
 *
 * Cross-platform note:
 * - Values here are plain numbers / strings so they work in both
 *   React Native (StyleSheet) and Web (CSSProperties).
 * - Shadcn-style aliases (primary, secondary, muted, etc.) are kept so
 *   existing components don't break; they map onto the WooBottle palette.
 */

// ---------- WooBottle palette primitives ----------

/** Inks — inverse surfaces, brand headings, support */
export const ink = {
  900: '#171513', // Inverse surfaces, deep feature bands
  800: '#2A2622', // Brand / headings
  700: '#3F3A34', // Support / secondary inverse surfaces
} as const;

/** Ember — warm orange Action role (primary CTA) */
export const ember = {
  600: '#B84C17', // Primary hover / press
  500: '#D35B1F', // Primary CTA
  300: '#F0C79E', // Action tint (backgrounds, focused states)
} as const;

/** Cream — warm-paper canvas surfaces */
export const cream = {
  100: '#F4EFE6', // Page canvas (never pure white)
  200: '#EAE4D8', // Section surface
  300: '#F9F3E6', // Reward / premium highlight
} as const;

/** Ceremonial gold — rewards, loyalty, achievements only */
export const goldAccent = '#C98A3C';
export const errorRed = '#B02818';

// ---------- Alpha ladders ----------

export const blackAlpha = {
  '06': 'rgba(0,0,0,0.06)',
  '08': 'rgba(0,0,0,0.08)',
  '12': 'rgba(0,0,0,0.12)',
  '24': 'rgba(0,0,0,0.24)',
  '38': 'rgba(0,0,0,0.38)',
  '58': 'rgba(0,0,0,0.58)',
  '70': 'rgba(0,0,0,0.70)',
  '87': 'rgba(0,0,0,0.87)',
  '90': 'rgba(0,0,0,0.90)',
} as const;

export const whiteAlpha = {
  '10': 'rgba(255,255,255,0.10)',
  '30': 'rgba(255,255,255,0.30)',
  '50': 'rgba(255,255,255,0.50)',
  '70': 'rgba(255,255,255,0.70)',
  '90': 'rgba(255,255,255,0.90)',
} as const;

// ---------- Semantic color tokens (light) ----------

export const colors = {
  // Shadcn-compat aliases → WooBottle mappings
  background: cream[100], // warm cream canvas
  foreground: blackAlpha[87], // text primary on light

  card: '#FFFFFF', // white island on cream
  cardForeground: blackAlpha[87],

  popover: '#FFFFFF',
  popoverForeground: blackAlpha[87],

  primary: ember[500], // ember CTA
  primaryForeground: '#FFFFFF',

  secondary: cream[200], // ceramic section surface
  secondaryForeground: blackAlpha[87],

  muted: cream[200],
  mutedForeground: blackAlpha[58],

  accent: cream[300], // reward highlight
  accentForeground: ink[800],

  destructive: errorRed,
  destructiveForeground: '#FFFFFF',

  border: blackAlpha[12], // barely-there default
  input: blackAlpha[12],
  ring: ember[500], // focus ring = ember

  // WooBottle extended semantic tokens
  canvas: cream[100],
  section: cream[200],
  reward: cream[300],
  inverse: ink[900],
  inverseForeground: '#FFFFFF',
  inverseForegroundSecondary: whiteAlpha[70],

  brand: ink[800],
  actionPrimary: ember[500],
  actionPrimaryHover: ember[600],
  actionDark: ink[900],
  actionDanger: errorRed,

  gold: goldAccent,
  successTint: 'hsla(30, 28%, 82%, 0.40)',
  errorTint: 'hsla(8, 66%, 40%, 0.06)',

  textPrimary: blackAlpha[87],
  textSecondary: blackAlpha[58],
  textTertiary: blackAlpha[38],
  textInverse: '#FFFFFF',
  textInverseSecondary: whiteAlpha[70],
  textBrand: ink[800],

  borderDefault: blackAlpha[12],
  borderStrong: blackAlpha[87],
  borderInverse: '#FFFFFF',
  borderFocus: ember[500],
} as const;

// ---------- Semantic color tokens (dark / inverse surface) ----------
// The WooBottle spec doesn't ship a traditional dark mode — it uses
// deep-green feature bands on the cream canvas. The "dark" theme here
// flips the canvas to the ink surface for apps that want full inversion.

export const darkColors = {
  background: ink[900],
  foreground: '#FFFFFF',

  card: ink[800],
  cardForeground: '#FFFFFF',

  popover: ink[800],
  popoverForeground: '#FFFFFF',

  primary: ember[500],
  primaryForeground: '#FFFFFF',

  secondary: ink[700],
  secondaryForeground: '#FFFFFF',

  muted: ink[700],
  mutedForeground: whiteAlpha[70],

  accent: ink[700],
  accentForeground: '#FFFFFF',

  destructive: errorRed,
  destructiveForeground: '#FFFFFF',

  border: whiteAlpha[10],
  input: whiteAlpha[10],
  ring: ember[500],

  canvas: ink[900],
  section: ink[800],
  reward: ink[700],
  inverse: cream[100],
  inverseForeground: blackAlpha[87],
  inverseForegroundSecondary: blackAlpha[58],

  brand: '#FFFFFF',
  actionPrimary: ember[500],
  actionPrimaryHover: ember[600],
  actionDark: '#000000',
  actionDanger: errorRed,

  gold: goldAccent,
  successTint: 'hsla(30, 28%, 82%, 0.20)',
  errorTint: 'hsla(8, 66%, 40%, 0.18)',

  textPrimary: '#FFFFFF',
  textSecondary: whiteAlpha[70],
  textTertiary: whiteAlpha[30],
  textInverse: blackAlpha[87],
  textInverseSecondary: blackAlpha[58],
  textBrand: '#FFFFFF',

  borderDefault: whiteAlpha[10],
  borderStrong: '#FFFFFF',
  borderInverse: blackAlpha[87],
  borderFocus: ember[500],
} as const;

// ---------- Spacing (4px base, keeps shadcn-compat keys) ----------

export const spacing = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
} as const;

/** WooBottle's named spacing scale — maps to the --space-* CSS custom props */
export const wbSpace = {
  1: 4, // --space-1
  2: 8, // --space-2
  3: 16, // --space-3
  4: 24, // --space-4
  5: 32, // --space-5
  6: 40, // --space-6
  7: 48, // --space-7
  8: 56, // --space-8
  9: 64, // --space-9
} as const;

/** Outer gutter — responsive 16 / 24 / 40 */
export const outerGutter = {
  sm: 16,
  md: 24,
  lg: 40,
} as const;

// ---------- Radii — buttons are ALWAYS pill ----------

export const borderRadius = {
  none: 0,
  sm: 8, // WooBottle small chips
  DEFAULT: 12, // cards / inputs / modals
  md: 12,
  lg: 16, // emphasized surfaces (feature band cards)
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  pill: 999,
  full: 9999,
  circle: 9999,
} as const;

// ---------- Typography ----------

// Note: React Native can't load a CSS @import, so fonts must be registered
// via the host app (Expo font loader or iOS/Android font bundle). The stack
// below is the _intent_ — the first available is Pretendard.
const FONT_SANS =
  '"Pretendard Variable", Pretendard, "Inter", "Helvetica Neue", Arial, sans-serif';
const FONT_SANS_ALT = '"Inter", "Helvetica Neue", Arial, sans-serif';
const FONT_SERIF = '"Woobottle Signature", "Lora", Georgia, serif';
const FONT_DISPLAY = '"Woobottle", "Pretendard Variable", "Inter", serif';

/**
 * Native fontFamily names.
 *
 * iOS resolves fontFamily by PostScript name; Android by filename (without
 * extension) — the bundled TTFs have matching identifiers for both so one
 * string works cross-platform. `sans` is left `undefined` because Pretendard
 * isn't bundled; RN falls back to the system sans which renders Korean via
 * Apple SD Gothic Neo (iOS) or Noto Sans CJK (Android).
 */
export const fontFamilyNative = {
  sans: undefined,
  sansAlt: undefined,
  display: 'Woobottle',
  signature: 'Woobottle Signature',
  serif: 'Woobottle Signature',
  mono: 'Menlo',
} as const;

export const typography = {
  fontFamily: {
    sans: FONT_SANS,
    sansAlt: FONT_SANS_ALT,
    serif: FONT_SERIF,
    display: FONT_DISPLAY,
    signature: FONT_SERIF,
    mono: 'monospace',
  },
  /** Native fontFamily (re-exported under `typography` for ergonomics) */
  fontFamilyNative,
  fontSize: {
    // Shadcn-style step scale (kept for existing component compatibility)
    xs: {size: 12, lineHeight: 16},
    sm: {size: 14, lineHeight: 20},
    base: {size: 16, lineHeight: 24},
    lg: {size: 18, lineHeight: 28},
    xl: {size: 20, lineHeight: 28},
    '2xl': {size: 24, lineHeight: 32},
    '3xl': {size: 30, lineHeight: 36},
    '4xl': {size: 36, lineHeight: 40},
    '5xl': {size: 48, lineHeight: 48},

    // WooBottle semantic scale
    displayLg: {size: 80, lineHeight: 96},
    displayMd: {size: 58, lineHeight: 70},
    headingLg: {size: 45, lineHeight: 54},
    headingMd: {size: 24, lineHeight: 36},
    bodyLg: {size: 19, lineHeight: 33},
    bodyMd: {size: 16, lineHeight: 24},
    bodySm: {size: 14, lineHeight: 21},
    caption: {size: 13, lineHeight: 20},
  },
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    regular: '400',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  letterSpacing: {
    tight: -0.16, // headings (-0.16px)
    body: -0.16, // body still uses tight tracking
    wide: 1.6, // tiny eyebrow labels (letter-spacing: 0.1em @ 16px ≈ 1.6)
    // Web-only string forms for when a component is mounted as CSS
    tightEm: '-0.01em',
    wideEm: '0.1em',
  },
  lineHeight: {
    compact: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// ---------- Elevation / shadows (layered, low-alpha) ----------
// React Native can only express a single shadow — we ship the dominant
// layer and mirror the full stack for web via CSSProperties if needed.

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  /** Card — a whisper of lift */
  card: {
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.24,
    shadowRadius: 1,
    elevation: 1,
  },
  /** Navigation — three stacked layers, still low-alpha */
  navigation: {
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  /** Floating — brightest the system allows (FAB, dropdowns) */
  floating: {
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 8,
  },
  /** Modal — slightly stronger than card */
  modal: {
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
  },

  // Shadcn-compat ramp → maps onto the WooBottle shadows
  sm: {
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.24,
    shadowRadius: 1,
    elevation: 1,
  },
  DEFAULT: {
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.24,
    shadowRadius: 1,
    elevation: 1,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
  },
} as const;

/** CSS-only layered shadows (for web components that want the full stack) */
export const shadowsCss = {
  card: '0 0 0.5px rgba(0,0,0,0.14), 0 1px 1px rgba(0,0,0,0.24)',
  navigation:
    '0 1px 3px rgba(0,0,0,0.10), 0 2px 2px rgba(0,0,0,0.06), 0 0 2px rgba(0,0,0,0.07)',
  floating: '0 0 6px rgba(0,0,0,0.24), 0 8px 12px rgba(0,0,0,0.14)',
  modal: '0 0 1px rgba(0,0,0,0.14), 0 10px 24px rgba(0,0,0,0.18)',
  focusRing: '0 0 0 3px rgba(211, 91, 31, 0.22)', // ember 500 @ 22%
} as const;

// ---------- Motion ----------

export const duration = {
  fastest: 50,
  faster: 100,
  fast: 120, // --dur-fast
  normal: 200, // --dur-base
  slow: 300, // --dur-slow
  slower: 400,
  slowest: 500,
} as const;

export const easing = {
  standard: 'cubic-bezier(0.2, 0.6, 0.2, 1)',
  out: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
} as const;

// ---------- Containers ----------

export const containers = {
  sm: 343,
  md: 500,
  lg: 720,
  xl: 1440,
} as const;

// ---------- Z-index ----------

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;
