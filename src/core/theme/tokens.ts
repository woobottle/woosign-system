/**
 * WooSign Design Tokens
 * Inspired by shadcn/ui's design system
 */

// Light theme colors (shadcn/ui default)
export const colors = {
  // Base
  background: '#FFFFFF',
  foreground: '#0F172A',

  // Card
  card: '#FFFFFF',
  cardForeground: '#0F172A',

  // Popover
  popover: '#FFFFFF',
  popoverForeground: '#0F172A',

  // Primary
  primary: '#0F172A',
  primaryForeground: '#F8FAFC',

  // Secondary
  secondary: '#F1F5F9',
  secondaryForeground: '#0F172A',

  // Muted
  muted: '#F1F5F9',
  mutedForeground: '#64748B',

  // Accent
  accent: '#F1F5F9',
  accentForeground: '#0F172A',

  // Destructive
  destructive: '#EF4444',
  destructiveForeground: '#F8FAFC',

  // Border, Input, Ring
  border: '#E2E8F0',
  input: '#E2E8F0',
  ring: '#0F172A',
} as const;

// Dark theme colors
export const darkColors = {
  // Base
  background: '#0F172A',
  foreground: '#F8FAFC',

  // Card
  card: '#0F172A',
  cardForeground: '#F8FAFC',

  // Popover
  popover: '#0F172A',
  popoverForeground: '#F8FAFC',

  // Primary
  primary: '#F8FAFC',
  primaryForeground: '#0F172A',

  // Secondary
  secondary: '#1E293B',
  secondaryForeground: '#F8FAFC',

  // Muted
  muted: '#1E293B',
  mutedForeground: '#94A3B8',

  // Accent
  accent: '#1E293B',
  accentForeground: '#F8FAFC',

  // Destructive
  destructive: '#7F1D1D',
  destructiveForeground: '#F8FAFC',

  // Border, Input, Ring
  border: '#1E293B',
  input: '#1E293B',
  ring: '#CBD5E1',
} as const;

// Spacing scale (4px base unit)
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

// Border radius
export const borderRadius = {
  none: 0,
  sm: 4,
  DEFAULT: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
} as const;

// Typography
export const typography = {
  fontFamily: {
    sans: 'System',
    mono: 'monospace',
  },
  fontSize: {
    xs: { size: 12, lineHeight: 16 },
    sm: { size: 14, lineHeight: 20 },
    base: { size: 16, lineHeight: 24 },
    lg: { size: 18, lineHeight: 28 },
    xl: { size: 20, lineHeight: 28 },
    '2xl': { size: 24, lineHeight: 32 },
    '3xl': { size: 30, lineHeight: 36 },
    '4xl': { size: 36, lineHeight: 40 },
    '5xl': { size: 48, lineHeight: 48 },
  },
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
} as const;

// Shadows (platform-specific implementations may differ)
export const shadows = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  DEFAULT: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 12,
  },
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
} as const;

// Animation durations
export const duration = {
  fastest: 50,
  faster: 100,
  fast: 150,
  normal: 200,
  slow: 300,
  slower: 400,
  slowest: 500,
} as const;

// Z-index scale
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
