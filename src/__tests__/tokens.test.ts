/**
 * Smoke tests for WooBottle "Paper & Ink" design tokens.
 *
 * These guard the invariants every component depends on:
 * - the published hex values for the three load-bearing roles
 * - the radius ladder (buttons are ALWAYS pill)
 * - the shadcn-compat aliases still map onto something
 * - typography / spacing exposed the WooBottle-specific scale
 */

import {
  colors,
  darkColors,
  borderRadius,
  typography,
  wbSpace,
  fontFamilyNative,
  shadowsCss,
} from '../core/theme/tokens';
import {resolveFontFamily} from '../core/utils/fontFamily';

describe('palette primitives', () => {
  it('pins the three load-bearing hex roles', () => {
    expect(colors.canvas).toBe('#F4EFE6');
    expect(colors.inverse).toBe('#171513');
    expect(colors.actionPrimary).toBe('#D35B1F');
    expect(colors.gold).toBe('#C98A3C');
  });

  it('keeps shadcn-compat aliases pointing at WooBottle values', () => {
    expect(colors.primary).toBe(colors.actionPrimary);
    expect(colors.background).toBe(colors.canvas);
    expect(colors.ring).toBe(colors.borderFocus);
  });

  it('darkColors flips canvas to ink but keeps ember/gold', () => {
    expect(darkColors.background).toBe('#171513');
    expect(darkColors.actionPrimary).toBe(colors.actionPrimary);
    expect(darkColors.gold).toBe(colors.gold);
  });

  it('exposes the forest ramp anchored at #1F4435 across light + dark themes', () => {
    expect(colors.actionForest).toBe('#1F4435');
    expect(colors.actionForestHover).toBe('#163328');
    expect(colors.forestTint).toBe('#B8CFC4');
    // Dark theme keeps the same base but flips hover to brighten on dark.
    expect(darkColors.actionForest).toBe(colors.actionForest);
    expect(darkColors.actionForestHover).toBe('#B8CFC4');
  });
});

describe('radius ladder', () => {
  it('exposes the WooBottle ladder (8 / 12 / 16 / 999 / circle)', () => {
    expect(borderRadius.sm).toBe(8);
    expect(borderRadius.md).toBe(12);
    expect(borderRadius.lg).toBe(16);
    expect(borderRadius.pill).toBe(999);
  });
});

describe('typography scale', () => {
  it('exposes the WooBottle-specific semantic sizes', () => {
    expect(typography.fontSize.displayLg.size).toBe(80);
    expect(typography.fontSize.headingMd.size).toBe(24);
    expect(typography.fontSize.bodyMd.size).toBe(16);
    expect(typography.fontSize.caption.size).toBe(13);
  });

  it('tight tracking for headings', () => {
    expect(typography.letterSpacing.tight).toBe(-0.16);
  });
});

describe('spacing', () => {
  it('wbSpace[3] == 16 (the outer gutter on mobile)', () => {
    expect(wbSpace[3]).toBe(16);
    expect(wbSpace[9]).toBe(64);
  });
});

describe('shadowsCss', () => {
  it('card shadow layers two low-alpha drops', () => {
    expect(shadowsCss.card).toMatch(/rgba\(0,0,0,0\.14\)/);
    expect(shadowsCss.card).toMatch(/rgba\(0,0,0,0\.24\)/);
  });

  it('focusRing is ember at 22%', () => {
    expect(shadowsCss.focusRing).toMatch(/211, 91, 31, 0\.22/);
  });
});

describe('fontFamilyNative', () => {
  it('maps display + signature to their PostScript names', () => {
    expect(fontFamilyNative.display).toBe('Woobottle');
    expect(fontFamilyNative.signature).toBe('Woobottle Signature');
  });

  it('leaves sans undefined so RN falls back to system (Korean-safe)', () => {
    expect(fontFamilyNative.sans).toBeUndefined();
  });
});

describe('resolveFontFamily', () => {
  it('returns the PostScript name on node (treated as native)', () => {
    expect(resolveFontFamily('display')).toBe('Woobottle');
    expect(resolveFontFamily('signature')).toBe('Woobottle Signature');
  });
});
