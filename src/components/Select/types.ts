import type {CSSProperties} from 'react';
import type {ViewStyle} from 'react-native';
import type {InputSize, InputVariant} from '../Input/types';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}
export interface SelectBaseProps {
  options: readonly SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  /** Visible label and accessible name. */
  label?: string;
  disabled?: boolean;
  variant?: InputVariant;
  size?: InputSize;
  fullWidth?: boolean;
  testID?: string;
}
export interface SelectWebProps extends SelectBaseProps {
  style?: CSSProperties;
  className?: string;
  id?: string;
  name?: string;
  required?: boolean;
}
export interface SelectNativeProps extends SelectBaseProps {
  style?: ViewStyle;
}
export type SelectProps = SelectBaseProps & {style?: CSSProperties | ViewStyle};
