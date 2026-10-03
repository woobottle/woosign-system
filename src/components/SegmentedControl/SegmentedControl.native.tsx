import {View, Text, Pressable} from 'react-native';
import {useResolvedColors} from '../../core/hooks';
import {useControllableState} from '../_shared/state';
import type {SegmentedControlNativeProps} from './types';
export function SegmentedControl({
  items,
  value,
  defaultValue,
  onValueChange,
  disabled,
  label,
  testID,
  style,
}: SegmentedControlNativeProps) {
  const c = useResolvedColors();
  const [selected, setSelected] = useControllableState(
    value,
    defaultValue ?? items.find(item => !item.disabled)?.value ?? '',
    onValueChange,
  );
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={label}
      testID={testID}
      style={[
        {
          flexDirection: 'row',
          backgroundColor: c.section,
          padding: 4,
          borderRadius: 999,
          gap: 4,
        },
        style,
      ]}>
      {items.map(item => (
        <Pressable
          key={item.value}
          accessibilityRole="radio"
          accessibilityLabel={item.label}
          accessibilityState={{
            checked: selected === item.value,
            disabled: !!disabled || !!item.disabled,
          }}
          disabled={disabled || item.disabled}
          onPress={() => setSelected(item.value)}
          style={{
            borderRadius: 999,
            padding: 12,
            backgroundColor: selected === item.value ? c.card : 'transparent',
            opacity: disabled || item.disabled ? 0.5 : 1,
          }}>
          <Text style={{color: c.textPrimary}}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
