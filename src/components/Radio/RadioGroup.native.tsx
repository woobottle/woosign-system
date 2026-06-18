/**
 * RadioGroup - React Native. View wrapper that provides RadioContext.
 */
import {useMemo} from 'react';
import {View} from 'react-native';
import type {RadioGroupNativeProps, RadioContextValue} from './types';
import {RadioContext} from './RadioContext';

export function RadioGroup({
  value,
  onValueChange,
  disabled = false,
  name,
  children,
  style,
  testID,
}: RadioGroupNativeProps) {
  const ctx = useMemo<RadioContextValue>(
    () => ({value, onValueChange, disabled, name}),
    [value, onValueChange, disabled, name],
  );
  return (
    <RadioContext.Provider value={ctx}>
      <View style={style} testID={testID}>
        {children}
      </View>
    </RadioContext.Provider>
  );
}

RadioGroup.displayName = 'RadioGroup';
