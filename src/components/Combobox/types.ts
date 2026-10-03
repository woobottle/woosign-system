import type {CSSProperties} from 'react';
import type {ViewStyle} from 'react-native';

export interface ComboboxBaseProps {
  id: string;
  options: readonly {value: string; label: string; disabled?: boolean}[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  error?: boolean;
  name?: string;
  testID?: string;
}
export interface ComboboxWebProps extends ComboboxBaseProps {
  style?: CSSProperties;
  className?: string;
}
export interface ComboboxNativeProps extends ComboboxBaseProps {
  style?: ViewStyle;
}
export type ComboboxProps = ComboboxBaseProps & {
  style?: CSSProperties | ViewStyle;
  className?: string;
};
