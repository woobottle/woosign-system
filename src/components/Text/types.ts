/**
 * Text component types
 * shadcn/ui Typography inspired
 */

import type { ReactNode } from 'react';
import type { TextStyle } from 'react-native';

// Text variants (shadcn/ui typography style)
export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'p'
  | 'lead'
  | 'large'
  | 'small'
  | 'muted';

// Font weights
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';

// Text alignment
export type TextAlign = 'left' | 'center' | 'right';

// Common props shared between web and native
export interface TextBaseProps {
  /** Typography variant */
  variant?: TextVariant;
  /** Font weight override */
  weight?: TextWeight;
  /** Text alignment */
  align?: TextAlign;
  /** Custom text color */
  color?: string;
  /** Apply muted foreground color */
  muted?: boolean;
  /** Text content */
  children?: ReactNode;
  /** Test ID for testing */
  testID?: string;
}

// Web-specific props
export interface TextWebProps extends TextBaseProps {
  /** HTML element to render */
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label';
  /** Additional CSS class name */
  className?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
}

// Native-specific props
export interface TextNativeProps extends TextBaseProps {
  /** Custom text style */
  style?: TextStyle;
  /** Number of lines before truncating */
  numberOfLines?: number;
  /** Ellipsize mode */
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
}

// Union type for platform-agnostic usage
export type TextProps = TextBaseProps & {
  style?: TextStyle | React.CSSProperties;
  className?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label';
  numberOfLines?: number;
};
