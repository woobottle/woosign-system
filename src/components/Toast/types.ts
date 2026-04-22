import type {ReactNode} from 'react';
import type {ViewStyle, TextStyle} from 'react-native';

/** Toast tone — drives the accompanying status dot color. */
export type ToastTone = 'success' | 'danger' | 'brand' | 'neutral';

export interface ToastBaseProps {
  tone?: ToastTone;
  title: ReactNode;
  description?: ReactNode;
  /** Optional custom glyph for the leading status dot. */
  glyph?: ReactNode;
  /** Hide the leading status dot. */
  hideIcon?: boolean;
  testID?: string;
}

export interface ToastWebProps extends ToastBaseProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface ToastNativeProps extends ToastBaseProps {
  style?: ViewStyle;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
}

export type ToastProps = ToastBaseProps & {
  style?: ViewStyle | React.CSSProperties;
  className?: string;
};
