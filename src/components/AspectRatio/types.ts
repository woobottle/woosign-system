import type {ReactNode, CSSProperties} from 'react';
import type {ViewStyle} from 'react-native';

export interface AspectRatioBaseProps {
  ratio?: number;
  children?: ReactNode;
  testID?: string;
}
export interface AspectRatioWebProps extends AspectRatioBaseProps {
  style?: CSSProperties;
  className?: string;
}
export interface AspectRatioNativeProps extends AspectRatioBaseProps {
  style?: ViewStyle;
}
export type AspectRatioProps = AspectRatioBaseProps & {
  style?: CSSProperties | ViewStyle;
  className?: string;
};
