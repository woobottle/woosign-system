import {forwardRef} from 'react';
import {useResolvedColors} from '../../core/hooks';
import {
  getInputContainerVariants,
  getInputTextVariants,
} from '../Input/Input.styles';
import type {SelectWebProps} from './types';

export const Select = forwardRef<HTMLSelectElement, SelectWebProps>(
  function Select(
    {
      options,
      value,
      defaultValue,
      onValueChange,
      placeholder = '선택하세요',
      label,
      disabled = false,
      variant = 'default',
      size = 'default',
      fullWidth,
      testID,
      style,
      className,
      id,
      name,
      required,
    },
    ref,
  ) {
    const colors = useResolvedColors();
    return (
      <label
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          color: colors.textPrimary,
          ...(fullWidth ? {width: '100%'} : {}),
        }}>
        {label && <span>{label}</span>}
        <select
          ref={ref}
          value={value}
          defaultValue={defaultValue ?? (value === undefined ? '' : undefined)}
          disabled={disabled}
          id={id}
          name={name}
          required={required}
          className={className}
          data-testid={testID}
          aria-label={label ?? placeholder}
          aria-invalid={variant === 'error' || undefined}
          onChange={event => onValueChange?.(event.currentTarget.value)}
          style={{
            ...getInputContainerVariants(colors)({variant, size}),
            ...getInputTextVariants(colors)({variant, size}),
            borderStyle: 'solid',
            ...(disabled ? {opacity: 0.5} : {}),
            ...style,
          }}>
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map(option => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  },
);
Select.displayName = 'Select';
