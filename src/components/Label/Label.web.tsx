import {useResolvedColors} from '../../core/hooks';
import type {LabelWebProps} from './types';
export function Label({
  children,
  htmlFor,
  required,
  disabled,
  testID,
  style,
  className,
}: LabelWebProps) {
  const c = useResolvedColors();
  return (
    <label
      htmlFor={htmlFor}
      data-testid={testID}
      className={className}
      style={{
        color: c.textPrimary,
        fontSize: 14,
        fontWeight: 500,
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}>
      {children}
      {required && (
        <span aria-label="필수" style={{color: c.actionDanger}}>
          {' '}
          *
        </span>
      )}
    </label>
  );
}
