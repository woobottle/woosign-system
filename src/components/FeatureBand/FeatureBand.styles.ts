import {colors, borderRadius, wbSpace} from '../../core/theme/tokens';
import type {FeatureBandTone} from './types';

export function getFeatureBandStyle(tone: FeatureBandTone, rounded: boolean) {
  const bg =
    tone === 'ember'
      ? colors.actionPrimary
      : tone === 'reward'
      ? colors.reward
      : colors.inverse;

  return {
    backgroundColor: bg,
    borderRadius: rounded ? borderRadius.lg : 0,
    paddingTop: wbSpace[7],
    paddingBottom: wbSpace[7],
    paddingLeft: wbSpace[6],
    paddingRight: wbSpace[6],
  };
}
