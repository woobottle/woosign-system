import type {CSSProperties} from 'react';
import type {ViewStyle} from 'react-native';

export interface InputOTPBaseProps {
  value?: string;
  defaultValue?: string;
  onChangeText?: (value: string) => void;
  onComplete?: (value: string) => void;
  length?: number;
  disabled?: boolean;
  label?: string;
  error?: boolean;
  testID?: string;
}
export interface InputOTPWebProps extends InputOTPBaseProps {
  style?: CSSProperties;
  className?: string;
}
export interface InputOTPNativeProps extends InputOTPBaseProps {
  style?: ViewStyle;
}
export type InputOTPProps = InputOTPBaseProps & {
  style?: CSSProperties | ViewStyle;
  className?: string;
};
