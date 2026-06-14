import {borderRadius, wbSpace} from '../../core/theme/tokens';
import type {Colors} from '../../core/theme/types';
import type {FeatureBandTone} from './types';

export function getFeatureBandStyle(
  c: Colors,
  tone: FeatureBandTone,
  rounded: boolean,
) {
  const bg =
    tone === 'ember'
      ? c.actionPrimary
      : tone === 'reward'
      ? c.reward
      : tone === 'forest'
      ? c.actionForest
      : c.inverse;

  return {
    backgroundColor: bg,
    borderRadius: rounded ? borderRadius.lg : 0,
    paddingTop: wbSpace[7],
    paddingBottom: wbSpace[7],
    paddingLeft: wbSpace[6],
    paddingRight: wbSpace[6],
  };
}
