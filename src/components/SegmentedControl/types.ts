import type {CSSProperties} from 'react';
import type {ViewStyle} from 'react-native';

export interface SegmentedControlBaseProps {
  items: readonly {value: string; label: string; disabled?: boolean}[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  label: string;
  testID?: string;
}
export interface SegmentedControlWebProps extends SegmentedControlBaseProps {
  style?: CSSProperties;
  className?: string;
}
export interface SegmentedControlNativeProps extends SegmentedControlBaseProps {
  style?: ViewStyle;
}
export type SegmentedControlProps = SegmentedControlBaseProps & {
  style?: CSSProperties | ViewStyle;
  className?: string;
};
