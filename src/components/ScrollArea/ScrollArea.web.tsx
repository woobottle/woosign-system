import type {ScrollAreaWebProps} from './types';
export function ScrollArea({
  children,
  horizontal,
  maxHeight = 320,
  label = '스크롤 영역',
  testID,
  style,
  className,
}: ScrollAreaWebProps) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      data-testid={testID}
      className={className}
      style={{
        maxHeight,
        overflowX: horizontal ? 'auto' : 'hidden',
        overflowY: horizontal ? 'hidden' : 'auto',
        ...style,
      }}>
      {children}
    </div>
  );
}
