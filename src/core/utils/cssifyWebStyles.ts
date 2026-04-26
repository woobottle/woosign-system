/**
 * Normalizes shared (RN-numeric) style objects for safe consumption as
 * React DOM inline styles on web.
 *
 * The shared `*.styles.ts` files express dimensions as plain numbers (RN
 * convention: numbers are dp/px). React DOM auto-suffixes "px" for most
 * numeric CSS properties, but it intentionally leaves a unitless whitelist
 * untouched (lineHeight, fontWeight, opacity, flex*, etc.) per the CSS
 * spec. The whitelist is correct for true unitless properties, but for
 * `lineHeight` it bites us: the tokens emit a *pixel* value like `24`,
 * which the browser then interprets as the multiplier `24` (= 16 × 24 =
 * 384px line box).
 *
 * This helper walks the style object once and converts numeric pixel-intent
 * properties to `${n}px` strings, leaving genuinely unitless values alone.
 */

type Style = Record<string, unknown>;

// Properties whose numeric values from RN-style tokens mean *pixels* but
// which React would otherwise emit as unit-less (and the browser would
// then misinterpret as a multiplier or ratio).
const PIXEL_INTENT_UNITLESS_PROPS = new Set<string>(['lineHeight']);

function isPixelIntent(value: number): boolean {
  // typography.lineHeight tokens use multipliers (1.2, 1.5, 1.75); pixel
  // tokens are always >= 4 in this codebase. Anything below the threshold
  // is treated as a CSS multiplier and left alone.
  return Number.isFinite(value) && Math.abs(value) >= 4;
}

export function cssifyWebStyles<T extends Style | undefined | null>(style: T): T {
  if (!style || typeof style !== 'object') return style;

  let mutated: Style | null = null;
  for (const key in style) {
    const value = (style as Style)[key];
    if (
      PIXEL_INTENT_UNITLESS_PROPS.has(key) &&
      typeof value === 'number' &&
      isPixelIntent(value)
    ) {
      mutated = mutated ?? { ...(style as Style) };
      mutated[key] = `${value}px`;
    }
  }
  return (mutated ?? style) as T;
}
