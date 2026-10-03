import type {CSSProperties} from 'react';
import type {ViewStyle} from 'react-native';

export interface DatePickerBaseProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  min?: string;
  max?: string;
  isDateDisabled?: (date: string) => boolean;
  locale?: 'ko' | 'en';
  disabled?: boolean;
  label: string;
  placeholder?: string;
  name?: string;
  testID?: string;
}
export interface DatePickerWebProps extends DatePickerBaseProps {
  style?: CSSProperties;
  className?: string;
}
export interface DatePickerNativeProps extends DatePickerBaseProps {
  style?: ViewStyle;
}
export type DatePickerProps = DatePickerBaseProps & {
  style?: CSSProperties | ViewStyle;
  className?: string;
};
