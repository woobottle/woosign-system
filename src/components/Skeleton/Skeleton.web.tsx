import {useResolvedColors} from '../../core/hooks';
import type {SkeletonWebProps} from './types';
export function Skeleton({
  width,
  height = 20,
  circle = false,
  testID,
  style,
  className,
}: SkeletonWebProps) {
  const c = useResolvedColors();
  return (
    <div
      aria-hidden="true"
      data-testid={testID}
      className={className}
      style={{
        width: width ?? (circle ? height : '100%'),
        height,
        borderRadius: circle ? '50%' : 8,
        backgroundColor: c.section,
        ...style,
      }}
    />
  );
}
