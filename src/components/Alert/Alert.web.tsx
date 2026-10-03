import {useResolvedColors} from '../../core/hooks';
import type {AlertWebProps} from './types';
export function Alert({
  title,
  children,
  tone = 'info',
  onClose,
  testID,
  style,
  className,
}: AlertWebProps) {
  const c = useResolvedColors();
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      data-testid={testID}
      className={className}
      style={{
        padding: 16,
        borderRadius: 12,
        backgroundColor:
          tone === 'danger'
            ? c.errorTint
            : tone === 'success'
            ? c.successTint
            : c.section,
        color: c.textPrimary,
        display: 'flex',
        gap: 12,
        ...style,
      }}>
      <div style={{flex: 1}}>
        {title && <strong>{title}</strong>}
        {children && <div>{children}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="알림 닫기"
          style={{
            border: 0,
            borderRadius: 999,
            background: 'transparent',
            color: c.textPrimary,
          }}>
          ×
        </button>
      )}
    </div>
  );
}
