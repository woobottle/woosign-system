import {colors} from '../../core/theme/tokens';
import type {ProgressTone, ProgressSurface, ProgressSize} from './types';

const HEIGHT = {sm: 6, default: 8, lg: 12} as const;

export function getProgressStyles(
  tone: ProgressTone,
  surface: ProgressSurface,
  size: ProgressSize,
) {
  const railBg =
    surface === 'inverse' ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)';

  const fillBg =
    tone === 'ember'
      ? colors.actionPrimary
      : tone === 'ink'
      ? colors.inverse
      : colors.gold;

  const height = HEIGHT[size];

  return {
    rail: {
      height,
      backgroundColor: railBg,
      borderRadius: 999,
      overflow: 'hidden' as const,
      width: '100%' as const,
    },
    fill: {
      height: '100%' as const,
      backgroundColor: fillBg,
      borderRadius: 999,
    },
  };
}

export function normalizeProgress(value: number, max?: number): number {
  const resolvedMax = max ?? (value <= 1 ? 1 : 100);
  const pct = Math.max(0, Math.min(1, value / resolvedMax));
  return pct;
}
