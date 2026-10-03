import type {CSSProperties} from 'react';
import type {ViewStyle} from 'react-native';

export interface ToggleGroupBaseProps {
  items: readonly {value: string; label: string; disabled?: boolean}[];
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (value: readonly string[]) => void;
  multiple?: boolean;
  disabled?: boolean;
  label: string;
  testID?: string;
}
export interface ToggleGroupWebProps extends ToggleGroupBaseProps {
  style?: CSSProperties;
  className?: string;
}
export interface ToggleGroupNativeProps extends ToggleGroupBaseProps {
  style?: ViewStyle;
}
export type ToggleGroupProps = ToggleGroupBaseProps & {
  style?: CSSProperties | ViewStyle;
  className?: string;
};
