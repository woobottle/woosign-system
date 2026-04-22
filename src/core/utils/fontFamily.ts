/**
 * Cross-platform fontFamily resolver.
 *
 * On web the full CSS stack (`typography.fontFamily.*`) is returned — the
 * browser picks the first installed face. On native, RN matches a single
 * string against bundled fonts, so we return the PostScript name from
 * `fontFamilyNative` (or `undefined` for roles that intentionally fall back
 * to the system sans, like body text).
 */

import {typography, fontFamilyNative} from '../theme/tokens';
import {isWeb} from './platform';

export type FontFamilyKey = keyof typeof fontFamilyNative;

export function resolveFontFamily(key: FontFamilyKey): string | undefined {
  if (isWeb()) {
    return typography.fontFamily[key];
  }
  return fontFamilyNative[key];
}
