/**
 * Card component types
 * shadcn/ui inspired variants
 */

import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

// Card variants
export type CardVariant = 'default' | 'outline' | 'ghost';

// Common props shared between web and native
export interface CardBaseProps {
  /** Card visual style variant */
  variant?: CardVariant;
  /** Card content */
  children?: ReactNode;
  /** Full width card */
  fullWidth?: boolean;
  /** Press handler (makes card interactive) */
  onPress?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Test ID for testing */
  testID?: string;
}

// Web-specific props
export interface CardWebProps extends CardBaseProps {
  /** Additional CSS class name */
  className?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
}

// Native-specific props
export interface CardNativeProps extends CardBaseProps {
  /** Custom container style */
  style?: ViewStyle;
}

// Union type for platform-agnostic usage
export type CardProps = CardBaseProps & {
  style?: ViewStyle | React.CSSProperties;
  className?: string;
};

// CardHeader props
export interface CardHeaderProps {
  children?: ReactNode;
  style?: ViewStyle | React.CSSProperties;
  className?: string;
}

// CardTitle props
export interface CardTitleProps {
  children?: ReactNode;
  style?: ViewStyle | React.CSSProperties;
  className?: string;
}

// CardDescription props
export interface CardDescriptionProps {
  children?: ReactNode;
  style?: ViewStyle | React.CSSProperties;
  className?: string;
}

// CardContent props
export interface CardContentProps {
  children?: ReactNode;
  style?: ViewStyle | React.CSSProperties;
  className?: string;
}

// CardFooter props
export interface CardFooterProps {
  children?: ReactNode;
  style?: ViewStyle | React.CSSProperties;
  className?: string;
}
