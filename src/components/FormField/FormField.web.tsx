import {useResolvedColors} from '../../core/hooks';
import {Label} from '../Label';
import type {FormFieldWebProps} from './types';
export function FormField({
  id,
  label,
  description,
  error,
  required,
  disabled,
  children,
  testID,
  style,
  className,
}: FormFieldWebProps) {
  const c = useResolvedColors();
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;
  return (
    <div
      data-testid={testID}
      className={className}
      style={{display: 'flex', flexDirection: 'column', gap: 8, ...style}}>
      <Label htmlFor={id} required={required} disabled={disabled}>
        {label}
      </Label>
      {children({
        id,
        required,
        disabled,
        'aria-invalid': !!error,
        'aria-describedby':
          [description && helpId, error && errorId].filter(Boolean).join(' ') ||
          undefined,
        accessibilityLabel: label,
        accessibilityHint: error ?? description,
      })}
      {description && (
        <div id={helpId} style={{color: c.textSecondary, fontSize: 13}}>
          {description}
        </div>
      )}
      {error && (
        <div
          role="alert"
          id={errorId}
          style={{color: c.actionDanger, fontSize: 13}}>
          {error}
        </div>
      )}
    </div>
  );
}
