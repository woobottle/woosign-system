import {useState} from 'react';
import {useResolvedColors} from '../../core/hooks';
import type {AvatarWebProps} from './types';
function Picture({
  src,
  name,
  fallback,
}: {
  src?: string;
  name: string;
  fallback: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  return src && !failed ? (
    <img
      src={src}
      alt={name}
      onError={() => setFailed(true)}
      style={{width: '100%', height: '100%', objectFit: 'cover'}}
    />
  ) : (
    <span>{fallback}</span>
  );
}
export function Avatar({
  src,
  name = '',
  fallback,
  size = 40,
  testID,
  style,
  className,
}: AvatarWebProps) {
  const c = useResolvedColors();
  const initials =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => Array.from(part)[0])
      .join('')
      .toUpperCase() || '?';
  return (
    <span
      role="img"
      aria-label={name || '아바타'}
      data-testid={testID}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: c.section,
        color: c.textPrimary,
        fontSize: size * 0.35,
        ...style,
      }}>
      <Picture
        key={src}
        src={src}
        name={name}
        fallback={fallback ?? initials}
      />
    </span>
  );
}
