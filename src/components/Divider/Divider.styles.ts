import {colors} from '../../core/theme/tokens';
import type {DividerTone} from './types';

export function getDividerStyle(tone: DividerTone, vertical: boolean) {
  const bg = tone === 'inverse' ? 'rgba(255,255,255,0.10)' : colors.borderDefault;
  return vertical
    ? {width: 1, alignSelf: 'stretch' as const, backgroundColor: bg}
    : {height: 1, alignSelf: 'stretch' as const, backgroundColor: bg};
}
