import type {AspectRatioWebProps} from './types';
export function AspectRatio({
  ratio = 16 / 9,
  children,
  testID,
  style,
  className,
}: AspectRatioWebProps) {
  return (
    <div
      data-testid={testID}
      className={className}
      style={{
        width: '100%',
        aspectRatio: Number.isFinite(ratio) && ratio > 0 ? ratio : 1,
        overflow: 'hidden',
        ...style,
      }}>
      {children}
    </div>
  );
}
