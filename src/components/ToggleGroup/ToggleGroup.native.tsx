import {View} from 'react-native';
import {Toggle} from '../Toggle/Toggle.native';
import {useControllableState} from '../_shared/state';
import type {ToggleGroupNativeProps} from './types';
export function ToggleGroup({
  items,
  value,
  defaultValue = [],
  onValueChange,
  multiple = false,
  disabled,
  label,
  testID,
  style,
}: ToggleGroupNativeProps) {
  const [selected, setSelected] = useControllableState(
    value,
    defaultValue,
    onValueChange,
  );
  return (
    <View
      accessibilityLabel={label}
      testID={testID}
      style={[{flexDirection: 'row', flexWrap: 'wrap', gap: 8}, style]}>
      {items.map(item => (
        <Toggle
          key={item.value}
          label={item.label}
          disabled={disabled || item.disabled}
          pressed={selected.includes(item.value)}
          onPressedChange={active =>
            setSelected(
              active
                ? multiple
                  ? [...selected, item.value]
                  : [item.value]
                : selected.filter(v => v !== item.value),
            )
          }
        />
      ))}
    </View>
  );
}
