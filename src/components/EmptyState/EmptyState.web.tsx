import {useResolvedColors} from '../../core/hooks';
import type {EmptyStateWebProps} from './types';
export function EmptyState({
  title,
  description,
  icon,
  action,
  testID,
  style,
  className,
}: EmptyStateWebProps) {
  const c = useResolvedColors();
  return (
    <div
      data-testid={testID}
      className={className}
      style={{
        padding: 32,
        textAlign: 'center',
        color: c.textPrimary,
        ...style,
      }}>
      {icon}
      <h3 style={{margin: '12px 0'}}>{title}</h3>
      {description && <p style={{color: c.textSecondary}}>{description}</p>}
      {action}
    </div>
  );
}
