/**
 * Badge component types
 * shadcn/ui inspired variants
 */

import type { ReactNode } from 'react';
import type { ViewStyle, TextStyle } from 'react-native';

// Badge variants (shadcn/ui style)
export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

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
