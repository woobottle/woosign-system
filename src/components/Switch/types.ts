/**
 * Switch component types
 * shadcn/ui inspired toggle switch
 */

import type { ViewStyle, PressableProps } from 'react-native';

// Switch sizes
export type SwitchSize = 'default' | 'sm' | 'lg';

// Common props shared between web and native
export interface SwitchBaseProps {
  /** Whether the switch is on */
  checked?: boolean;
  /** Called when the value changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Switch size */
  size?: SwitchSize;
  /** Disabled state */
  disabled?: boolean;
  /** Label text displayed next to the switch */
  label?: string;
  /** Test ID for testing */
  testID?: string;
}

// Web-specific props
export interface SwitchWebProps extends SwitchBaseProps {
  /** Additional CSS class name */
  className?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
}

// Native-specific props
export interface SwitchNativeProps extends SwitchBaseProps {
  /** Custom container style */
  style?: ViewStyle;
  /** Additional Pressable props */
  pressableProps?: Omit<PressableProps, 'onPress' | 'disabled' | 'style'>;
}

// Union type for platform-agnostic usage
export type SwitchProps = SwitchBaseProps & {
  style?: ViewStyle | React.CSSProperties;
  className?: string;
};
