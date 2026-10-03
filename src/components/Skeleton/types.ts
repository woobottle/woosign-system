import type {CSSProperties} from 'react';
import type {ViewStyle} from 'react-native';

export interface SkeletonBaseProps {
  width?: number;
  height?: number;
  circle?: boolean;
  testID?: string;
}
export interface SkeletonWebProps extends SkeletonBaseProps {
  style?: CSSProperties;
  className?: string;
}
export interface SkeletonNativeProps extends SkeletonBaseProps {
  style?: ViewStyle;
}
export type SkeletonProps = SkeletonBaseProps & {
  style?: CSSProperties | ViewStyle;
  className?: string;
};
