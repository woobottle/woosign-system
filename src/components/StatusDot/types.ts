import type {ReactNode} from 'react';
import type {ViewStyle, TextStyle} from 'react-native';

/** Status tone — tinted circle wrapper around an icon or glyph. */
export type StatusDotTone = 'success' | 'danger' | 'brand' | 'neutral';
export type StatusDotSize = 'sm' | 'default' | 'lg';

export interface StatusDotBaseProps {
  tone?: StatusDotTone;
  size?: StatusDotSize;
  /** Glyph / icon rendered inside the circle (e.g. '✓', '!', Lucide icon) */
  children?: ReactNode;
  testID?: string;
}

export interface StatusDotWebProps extends StatusDotBaseProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface StatusDotNativeProps extends StatusDotBaseProps {
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export type StatusDotProps = StatusDotBaseProps & {
  style?: ViewStyle | React.CSSProperties;
  className?: string;
};
