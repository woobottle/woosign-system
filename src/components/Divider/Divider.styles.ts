import type {Colors} from '../../core/theme/types';
import type {DividerTone} from './types';

export function getDividerStyle(
  c: Colors,
  tone: DividerTone,
  vertical: boolean,
) {
  const bg = tone === 'inverse' ? 'rgba(255,255,255,0.10)' : c.borderDefault;
  return vertical
    ? {width: 1, alignSelf: 'stretch' as const, backgroundColor: bg}
    : {height: 1, alignSelf: 'stretch' as const, backgroundColor: bg};
}
