import {Text, Pressable, StyleSheet} from 'react-native';
import {useResolvedColors} from '../../core/hooks';
import {useControllableState} from '../_shared/state';
import type {ToggleNativeProps} from './types';
export function Toggle({
  children,
  label,
  pressed,
  defaultPressed = false,
  onPressedChange,
  disabled,
  testID,
  style,
}: ToggleNativeProps) {
  const c = useResolvedColors();
  const [active, setActive] = useControllableState(
    pressed,
    defaultPressed,
    onPressedChange,
  );
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{selected: active, disabled}}
      disabled={disabled}
      onPress={() => setActive(!active)}
      testID={testID}
      style={[
        styles.toggle,
        {
          borderColor: c.borderDefault,
          backgroundColor: active ? c.actionPrimary : c.card,
        },
        disabled && styles.disabled,
        style,
      ]}>
      {typeof children === 'string' ||
      typeof children === 'number' ||
      children == null ? (
        <Text style={{color: active ? c.primaryForeground : c.textPrimary}}>
          {children ?? label}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  toggle: {
    padding: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
  disabled: {
    opacity: 0.5,
  },
});
