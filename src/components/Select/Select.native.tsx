import {forwardRef, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {BottomSheet} from '../BottomSheet/BottomSheet.native';
import {useResolvedColors} from '../../core/hooks';
import {
  getInputContainerVariants,
  getInputTextVariants,
} from '../Input/Input.styles';
import type {SelectNativeProps} from './types';

export const Select = forwardRef<View, SelectNativeProps>(function Select(
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
  },
  ref,
) {
  const [localValue, setLocalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const selectedValue = value ?? localValue;
  const selected = options.find(option => option.value === selectedValue);
  const colors = useResolvedColors();
  return (
    <View style={fullWidth ? styles.fullWidth : undefined}>
      {label && (
        <Text style={[{color: colors.textPrimary}, styles.label]}>{label}</Text>
      )}
      <Pressable
        ref={ref}
        testID={testID}
        disabled={disabled}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={label ?? placeholder}
        accessibilityValue={{text: selected?.label ?? placeholder}}
        accessibilityState={{disabled, expanded: open && !disabled}}
        style={[
          getInputContainerVariants(colors)({variant, size}),
          disabled && styles.disabled,
          style,
        ]}>
        <Text
          style={[
            getInputTextVariants(colors)({variant, size}),
            !selected && {color: colors.textTertiary},
          ]}>
          {selected?.label ?? placeholder}
        </Text>
        <Text style={{color: colors.textPrimary}} accessibilityElementsHidden>
          ⌄
        </Text>
      </Pressable>
      <BottomSheet open={open && !disabled} onClose={() => setOpen(false)}>
        <BottomSheet.Header>
          <BottomSheet.Title>{label ?? placeholder}</BottomSheet.Title>
        </BottomSheet.Header>
        <BottomSheet.Body>
          {options.map(option => (
            <Pressable
              key={option.value}
              disabled={option.disabled}
              accessibilityRole="radio"
              accessibilityLabel={option.label}
              accessibilityState={{
                selected: selectedValue === option.value,
                disabled: !!option.disabled,
              }}
              onPress={() => {
                if (value === undefined) {
                  setLocalValue(option.value);
                }
                onValueChange?.(option.value);
                setOpen(false);
              }}
              style={[
                styles.option,
                option.disabled && styles.disabled,
                {
                  backgroundColor:
                    selectedValue === option.value
                      ? colors.section
                      : colors.card,
                },
              ]}>
              <Text style={{color: colors.textPrimary}}>{option.label}</Text>
            </Pressable>
          ))}
        </BottomSheet.Body>
      </BottomSheet>
    </View>
  );
});
Select.displayName = 'Select';

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  label: {
    marginBottom: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  option: {
    padding: 14,
  },
});
