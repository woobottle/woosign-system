import type {Colors} from '../../core/theme/types';
import type {StatusDotTone, StatusDotSize} from './types';

const SIZE_MAP = {
  sm: 20,
  default: 28,
  lg: 36,
} as const;

export function getStatusDotStyle(
  c: Colors,
  tone: StatusDotTone,
  size: StatusDotSize,
) {
  const dim = SIZE_MAP[size];

  const [bg, fg] =
    tone === 'success'
      ? [c.successTint, c.actionPrimary]
      : tone === 'danger'
      ? [c.errorTint, c.actionDanger]
      : tone === 'brand'
      ? [c.section, c.brand]
      : [c.section, c.textSecondary];

  return {
    container: {
      width: dim,
      height: dim,
      borderRadius: dim / 2,
      backgroundColor: bg,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    text: {
      color: fg,
      fontWeight: '700' as const,
      fontSize: size === 'sm' ? 12 : size === 'lg' ? 16 : 14,
    },
  };
}
