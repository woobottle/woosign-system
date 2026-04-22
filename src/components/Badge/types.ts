/**
 * Badge component types
 * shadcn/ui inspired variants
 */

import type {ReactNode} from 'react';
import type {ViewStyle, TextStyle} from 'react-native';

// Badge variants — WooBottle roles
//   default      — ember primary, solid pill
//   secondary    — cream section surface with ink label
//   destructive  — error red
//   outline      — hairline border, ink label
//   brand        — ink800 solid (brand heading role)
//   gold         — ceremonial gold (rewards / achievements only)
//   success      — success tint
//   reward       — cream-300 reward highlight
export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'brand'
  | 'gold'
  | 'success'
  | 'reward';

// Common props shared between web and native
export interface BadgeBaseProps {
  /** Badge visual style variant */
  variant?: BadgeVariant;
  /** Badge content */
  children?: ReactNode;
  /** Test ID for testing */
  testID?: string;
}

// Web-specific props
export interface BadgeWebProps extends BadgeBaseProps {
  /** Additional CSS class name */
  className?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
}

// Native-specific props
export interface BadgeNativeProps extends BadgeBaseProps {
  /** Custom container style */
  style?: ViewStyle;
  /** Custom text style */
  textStyle?: TextStyle;
}

// Union type for platform-agnostic usage
export type BadgeProps = BadgeBaseProps & {
  style?: ViewStyle | React.CSSProperties;
  className?: string;
};
