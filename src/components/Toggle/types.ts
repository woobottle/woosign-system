import type {ReactNode, CSSProperties} from 'react';
import type {ViewStyle} from 'react-native';

export interface ToggleBaseProps {
  children?: ReactNode;
  label: string;
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  disabled?: boolean;
  testID?: string;
}
export interface ToggleWebProps extends ToggleBaseProps {
  style?: CSSProperties;
  className?: string;
}
export interface ToggleNativeProps extends ToggleBaseProps {
  style?: ViewStyle;
}
export type ToggleProps = ToggleBaseProps & {
  style?: CSSProperties | ViewStyle;
  className?: string;
};
