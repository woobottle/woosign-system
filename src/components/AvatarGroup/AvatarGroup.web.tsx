import {Avatar} from '../Avatar';
import {useResolvedColors} from '../../core/hooks';
import type {AvatarGroupWebProps} from './types';
export function AvatarGroup({
  items,
  max = 4,
  size = 40,
  testID,
  style,
  className,
}: AvatarGroupWebProps) {
  const c = useResolvedColors();
  const limit = Math.max(0, Math.floor(max));
  const hidden = items.length - limit;
  return (
    <div
      role="group"
      aria-label="프로필 그룹"
      data-testid={testID}
      className={className}
      style={{display: 'flex', ...style}}>
      {items.slice(0, limit).map((item, i) => (
        <Avatar
          key={i}
          {...item}
          size={size}
          style={{
            marginLeft: i ? -size / 4 : 0,
            border: `2px solid ${c.canvas}`,
            boxSizing: 'border-box',
          }}
        />
      ))}
      {hidden > 0 && (
        <Avatar name={`${hidden}명 더`} fallback={`+${hidden}`} size={size} />
      )}
    </div>
  );
}
