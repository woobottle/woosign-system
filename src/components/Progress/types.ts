import type {ViewStyle} from 'react-native';

export type ProgressTone = 'gold' | 'ember' | 'ink';
export type ProgressSurface = 'light' | 'inverse';
export type ProgressSize = 'sm' | 'default' | 'lg';

export interface ProgressBaseProps {
  /** Fill value (0-1 or 0-100, inferred from range). */
  value: number;
  /** Maximum value (default 1 if value ≤ 1, else 100). */
  max?: number;
  tone?: ProgressTone;
  /** Rail surface — on light canvas or on inverse ink band. */
  surface?: ProgressSurface;
  size?: ProgressSize;
  testID?: string;
}

export interface ProgressWebProps extends ProgressBaseProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface ProgressNativeProps extends ProgressBaseProps {
  style?: ViewStyle;
}

export type ProgressProps = ProgressBaseProps & {
  style?: ViewStyle | React.CSSProperties;
  className?: string;
};
