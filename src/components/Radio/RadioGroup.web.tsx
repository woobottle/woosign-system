/**
 * RadioGroup - Web. role=radiogroup wrapper that provides RadioContext.
 */
import {useMemo} from 'react';
import type {RadioGroupWebProps, RadioContextValue} from './types';
import {RadioContext} from './RadioContext';

export function RadioGroup({
  value,
  onValueChange,
  disabled = false,
  name,
  children,
  className,
  style,
  testID,
}: RadioGroupWebProps) {
  const ctx = useMemo<RadioContextValue>(
    () => ({value, onValueChange, disabled, name}),
    [value, onValueChange, disabled, name],
  );
  return (
    <RadioContext.Provider value={ctx}>
      <div role="radiogroup" className={className} style={style} data-testid={testID}>
        {children}
      </div>
    </RadioContext.Provider>
  );
}

RadioGroup.displayName = 'RadioGroup';
