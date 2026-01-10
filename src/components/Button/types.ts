/**
 * Button component types
 * shadcn/ui inspired variants
 */

import type { ReactNode } from 'react';
import type { ViewStyle, TextStyle, PressableProps } from 'react-native';

// Button variants (shadcn/ui style)
export type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';

// Button sizes
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

// Common props shared between web and native
export interface ButtonBaseProps {
  /** Button visual style variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Button content */
  children?: ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state - shows spinner */
  loading?: boolean;
  /** Press handler (RN-friendly naming per PRD) */
  onPress?: () => void;
  /** Full width button */
  fullWidth?: boolean;
  /** Icon to show on the left side */
  leftIcon?: ReactNode;
  /** Icon to show on the right side */
  rightIcon?: ReactNode;
  /** Test ID for testing */
  testID?: string;
}

// Web-specific props
export interface ButtonWebProps extends ButtonBaseProps {
  /** HTML button type */
  type?: 'button' | 'submit' | 'reset';
  /** Additional CSS class name */
  className?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
}

// Native-specific props
export interface ButtonNativeProps extends ButtonBaseProps {
  /** Custom container style */
  style?: ViewStyle;
  /** Custom text style */
  textStyle?: TextStyle;
  /** Additional Pressable props */
  pressableProps?: Omit<PressableProps, 'onPress' | 'disabled' | 'style'>;
}

// Union type for platform-agnostic usage
export type ButtonProps = ButtonBaseProps & {
  style?: ViewStyle | React.CSSProperties;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
};
