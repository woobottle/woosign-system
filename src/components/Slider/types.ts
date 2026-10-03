import type {CSSProperties} from 'react';
import type {ViewStyle} from 'react-native';

export interface SliderBaseProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  onValueCommit?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label: string;
  testID?: string;
}
export interface SliderWebProps extends SliderBaseProps {
  style?: CSSProperties;
  className?: string;
}
export interface SliderNativeProps extends SliderBaseProps {
  style?: ViewStyle;
}
export type SliderProps = SliderBaseProps & {
  style?: CSSProperties | ViewStyle;
  className?: string;
};
