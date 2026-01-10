/**
 * Box component types
 * Flexible layout container
 */

import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

// Border radius presets
export type BorderRadiusPreset = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

// Flex direction
export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';

// Align items
export type AlignItems = 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';

// Justify content
export type JustifyContent =
  | 'flex-start'
  | 'center'
  | 'flex-end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';

// Flex wrap
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';

// Common props shared between web and native
export interface BoxBaseProps {
  // Layout - Padding
  /** Padding on all sides */
  padding?: number;
  /** Horizontal padding (left and right) */
  paddingX?: number;
  /** Vertical padding (top and bottom) */
  paddingY?: number;
  /** Padding top */
  paddingTop?: number;
  /** Padding right */
  paddingRight?: number;
  /** Padding bottom */
  paddingBottom?: number;
  /** Padding left */
  paddingLeft?: number;

  // Layout - Margin
  /** Margin on all sides */
  margin?: number;
  /** Horizontal margin (left and right) */
  marginX?: number;
  /** Vertical margin (top and bottom) */
  marginY?: number;
  /** Margin top */
  marginTop?: number;
  /** Margin right */
  marginRight?: number;
  /** Margin bottom */
  marginBottom?: number;
  /** Margin left */
  marginLeft?: number;

  // Flexbox
  /** Flex grow/shrink factor */
  flex?: number;
  /** Flex direction */
  flexDirection?: FlexDirection;
  /** Align items on cross axis */
  alignItems?: AlignItems;
  /** Justify content on main axis */
  justifyContent?: JustifyContent;
  /** Flex wrap */
  flexWrap?: FlexWrap;
  /** Gap between children */
  gap?: number;
  /** Row gap */
  rowGap?: number;
  /** Column gap */
  columnGap?: number;

  // Appearance
  /** Background color */
  backgroundColor?: string;
  /** Border radius (number or preset) */
  borderRadius?: number | BorderRadiusPreset;
  /** Border width */
  borderWidth?: number;
  /** Border color */
  borderColor?: string;

  // Size
  /** Width */
  width?: number | string;
  /** Height */
  height?: number | string;
  /** Min width */
  minWidth?: number | string;
  /** Min height */
  minHeight?: number | string;
  /** Max width */
  maxWidth?: number | string;
  /** Max height */
  maxHeight?: number | string;

  /** Children */
  children?: ReactNode;
  /** Test ID for testing */
  testID?: string;
}

// Web-specific props
export interface BoxWebProps extends BoxBaseProps {
  /** Additional CSS class name */
  className?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
  /** HTML element to render */
  as?: 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'main' | 'nav';
}

// Native-specific props
export interface BoxNativeProps extends BoxBaseProps {
  /** Custom view style */
  style?: ViewStyle;
}

// Union type for platform-agnostic usage
export type BoxProps = BoxBaseProps & {
  style?: ViewStyle | React.CSSProperties;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'main' | 'nav';
};
