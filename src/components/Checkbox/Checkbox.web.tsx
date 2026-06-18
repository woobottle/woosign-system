/**
 * Checkbox component - Web implementation. controlled, role=checkbox.
 */
import React, {forwardRef, useCallback, useMemo} from 'react';
import type {CheckboxWebProps} from './types';
import {
  getCheckboxStyles,
  checkboxDimensions,
  containerGap,
  disabledStyle,
} from './Checkbox.styles';
import {mergeStyles} from '../../core/variants';
import {cssifyWebStyles} from '../../core/utils/cssifyWebStyles';
import {useResolvedColors} from '../../core/hooks';

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxWebProps>(
  function Checkbox(
    {
      checked = false,
      indeterminate = false,
      onCheckedChange,
      size = 'default',
      disabled = false,
      label,
      className,
      style,
      testID,
    },
    ref,
  ) {
    const handleClick = useCallback(() => {
      if (!disabled) onCheckedChange?.(!checked);
    }, [disabled, checked, onCheckedChange]);

    const colors = useResolvedColors();
    const s = useMemo(() => getCheckboxStyles(colors), [colors]);
    const dims = checkboxDimensions[size];
    const isOn = indeterminate || checked;

    const boxStyle = mergeStyles(
      s.boxBase,
      {width: dims.box, height: dims.box},
      isOn ? s.boxChecked : s.boxUnchecked,
      {
        display: 'inline-flex',
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding: 0,
        transition: 'background-color 150ms ease',
      },
      disabled && disabledStyle,
    ) as React.CSSProperties;

    const glyphStyle = cssifyWebStyles({
      ...s.glyph,
      fontSize: dims.glyph,
      lineHeight: 1,
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
          role="checkbox"
          aria-checked={indeterminate ? 'mixed' : checked}
          disabled={disabled}
          onClick={handleClick}
          style={boxStyle}
          data-testid={testID}>
          {isOn && (
            <span style={glyphStyle} aria-hidden>
              {indeterminate ? '–' : '✓'}
            </span>
          )}
        </button>
        {label != null && (
          <span style={labelStyle} onClick={disabled ? undefined : handleClick}>
            {label}
          </span>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
