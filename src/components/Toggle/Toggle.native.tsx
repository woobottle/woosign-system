import {Text, Pressable} from 'react-native';
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
        {
          padding: 12,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: c.borderDefault,
          backgroundColor: active ? c.actionPrimary : c.card,
          opacity: disabled ? 0.5 : 1,
        },
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
