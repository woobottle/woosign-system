import {useResolvedColors} from '../../core/hooks';
import {useState} from 'react';
import {useControllableState} from '../_shared/state';
import type {InputOTPWebProps} from './types';
export function InputOTP({
  value,
  defaultValue = '',
  onChangeText,
  onComplete,
  length = 6,
  disabled,
  label = '인증 코드',
  error,
  testID,
  style,
  className,
}: InputOTPWebProps) {
  const c = useResolvedColors();
  const count = Math.max(1, Math.min(12, Math.floor(length) || 6));
  const [raw, setValue] = useControllableState(
    value,
    defaultValue,
    onChangeText,
  );
  const current = raw.replace(/[^0-9]/g, '').slice(0, count);
  const [focused, setFocused] = useState(false);
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        display: 'inline-flex',
        maxWidth: '100%',
        gap: 8,
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}>
      <div aria-hidden="true" style={{display: 'flex', gap: 8}}>
        {Array.from({length: count}, (_, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 48,
              borderRadius: 8,
              border: `1px solid ${
                error
                  ? c.actionDanger
                  : focused && i === Math.min(current.length, count - 1)
                  ? c.borderFocus
                  : c.borderDefault
              }`,
              backgroundColor: c.card,
              color: c.textPrimary,
              fontSize: 20,
            }}>
            {current[i] ?? ''}
          </span>
        ))}
      </div>
      <input
        aria-label={label}
        aria-invalid={error || undefined}
        data-testid={testID}
        value={current}
        disabled={disabled}
        inputMode="numeric"
        autoComplete="one-time-code"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={event => {
          const next = event.currentTarget.value
            .replace(/[^0-9]/g, '')
            .slice(0, count);
          setValue(next);
          if (next.length === count && next !== current) {
            onComplete?.(next);
          }
        }}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: 'text',
        }}
      />
    </div>
  );
}
