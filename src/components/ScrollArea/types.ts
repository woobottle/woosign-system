import type {ReactNode, CSSProperties} from 'react';
import type {ViewStyle} from 'react-native';

export interface ScrollAreaBaseProps {
  children?: ReactNode;
  horizontal?: boolean;
  maxHeight?: number;
  label?: string;
  testID?: string;
}
export interface ScrollAreaWebProps extends ScrollAreaBaseProps {
  style?: CSSProperties;
  className?: string;
}
export interface ScrollAreaNativeProps extends ScrollAreaBaseProps {
  style?: ViewStyle;
}
export type ScrollAreaProps = ScrollAreaBaseProps & {
  style?: CSSProperties | ViewStyle;
  className?: string;
};
