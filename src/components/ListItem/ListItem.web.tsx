import {useResolvedColors} from '../../core/hooks';
import type {ListItemWebProps} from './types';
export function ListItem({
  title,
  description,
  leading,
  trailing,
  onPress,
  disabled,
  testID,
  style,
  className,
}: ListItemWebProps) {
  const c = useResolvedColors();
  const content = (
    <>
      {leading}
      <span style={{flex: 1, textAlign: 'left'}}>
        <span style={{display: 'block', fontWeight: 500}}>{title}</span>
        {description && (
          <span
            style={{display: 'block', color: c.textSecondary, fontSize: 13}}>
            {description}
          </span>
        )}
      </span>
      {trailing}
    </>
  );
  const s = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    width: '100%',
    boxSizing: 'border-box' as const,
    color: c.textPrimary,
    backgroundColor: c.card,
    border: 0,
    borderBottom: `1px solid ${c.borderDefault}`,
    opacity: disabled ? 0.5 : 1,
    ...style,
  };
  return onPress ? (
    <button
      type="button"
      disabled={disabled}
      onClick={onPress}
      data-testid={testID}
      className={className}
      style={s}>
      {content}
    </button>
  ) : (
    <div data-testid={testID} className={className} style={s}>
      {content}
    </div>
  );
}
