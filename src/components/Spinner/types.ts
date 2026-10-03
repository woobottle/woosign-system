import type {CSSProperties} from 'react';
import type {ViewStyle} from 'react-native';

export interface SpinnerBaseProps {
  size?: number;
  label?: string;
  testID?: string;
}
export interface SpinnerWebProps extends SpinnerBaseProps {
  style?: CSSProperties;
  className?: string;
}
export interface SpinnerNativeProps extends SpinnerBaseProps {
  style?: ViewStyle;
}
export type SpinnerProps = SpinnerBaseProps & {
  style?: CSSProperties | ViewStyle;
  className?: string;
};
