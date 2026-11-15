import type {Colors} from '../../core/theme/types';
import type {StepStatus, StepperStep} from './types';

export const INDICATOR_SIZE = 32;

export const statusText: Record<StepStatus, string> = {
  complete: '완료',
  current: '현재 단계',
  upcoming: '예정',
};

export function currentIndexOf(
  steps: readonly StepperStep[],
  value: string,
): number {
  return Math.max(
    0,
    steps.findIndex(step => step.value === value),
  );
}

export function statusOf(index: number, current: number): StepStatus {
  if (index < current) {
    return 'complete';
  }
  return index === current ? 'current' : 'upcoming';
}

export function getStepColors(c: Colors, status: StepStatus) {
  const active = status !== 'upcoming';
  return {
    indicatorBackground: status === 'complete' ? c.actionPrimary : c.card,
    indicatorBorder: active ? c.actionPrimary : c.borderDefault,
    indicatorText:
      status === 'complete'
        ? c.primaryForeground
        : status === 'current'
        ? c.actionPrimary
        : c.textSecondary,
    label: active ? c.textPrimary : c.textSecondary,
    connector: status === 'complete' ? c.actionPrimary : c.borderDefault,
  };
}
