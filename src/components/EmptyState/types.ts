import type {ReactNode, CSSProperties} from 'react';
import type {ViewStyle} from 'react-native';

export interface EmptyStateBaseProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  testID?: string;
}
export interface EmptyStateWebProps extends EmptyStateBaseProps {
  style?: CSSProperties;
  className?: string;
}
export interface EmptyStateNativeProps extends EmptyStateBaseProps {
  style?: ViewStyle;
}
export type EmptyStateProps = EmptyStateBaseProps & {
  style?: CSSProperties | ViewStyle;
  className?: string;
};
