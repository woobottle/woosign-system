/**
 * Radio - Web. role=radio; reads RadioContext for checked/onChange/disabled.
 */
import React, {forwardRef, useCallback, useContext, useMemo} from 'react';
import type {RadioWebProps} from './types';
import {RadioContext} from './RadioContext';
import {
  getRadioStyles,
  radioDimensions,
  containerGap,
  disabledStyle,
} from './Radio.styles';
import {mergeStyles} from '../../core/variants';
import {cssifyWebStyles} from '../../core/utils/cssifyWebStyles';
import {useResolvedColors} from '../../core/hooks';

export const Radio = forwardRef<HTMLButtonElement, RadioWebProps>(function Radio(
  {value, label, disabled: itemDisabled = false, size = 'default', className, style, testID},
  ref,
) {
  const ctx = useContext(RadioContext);
  const checked = ctx?.value === value;
  const disabled = itemDisabled || !!ctx?.disabled;

  const handleClick = useCallback(() => {
    if (!disabled) ctx?.onValueChange?.(value);
  }, [disabled, ctx, value]);

  const colors = useResolvedColors();
  const s = useMemo(() => getRadioStyles(colors), [colors]);
  const dims = radioDimensions[size];

  const outerStyle = mergeStyles(
    s.outerBase,
    {width: dims.outer, height: dims.outer},
    checked ? s.outerChecked : s.outerUnchecked,
    {
      display: 'inline-flex',
      cursor: disabled ? 'not-allowed' : 'pointer',
      padding: 0,
    },
    disabled && disabledStyle,
  ) as React.CSSProperties;

  const dotStyle = cssifyWebStyles({
    ...s.dot,
    width: dims.dot,
    height: dims.dot,
    pointerEvents: 'none',
  }) as React.CSSProperties;

  const containerStyle = mergeStyles(
    {display: 'inline-flex', alignItems: 'center', gap: containerGap},
    style,
  ) as React.CSSProperties;

  const labelStyle = cssifyWebStyles({
    ...s.label,
    fontSize: dims.fontSize,
    cursor: disabled ? 'not-allowed' : 'pointer',
  }) as React.CSSProperties;

  return (
    <div style={containerStyle} className={className}>
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleClick}
        style={outerStyle}
        data-testid={testID}>
        {checked && <span style={dotStyle} />}
      </button>
      {label != null && (
        <span style={labelStyle} onClick={disabled ? undefined : handleClick}>
          {label}
        </span>
      )}
    </div>
  );
});

Radio.displayName = 'Radio';
