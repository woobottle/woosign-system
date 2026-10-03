import type {ReactNode, CSSProperties} from 'react';
import type {ViewStyle} from 'react-native';

export interface AlertBaseProps {
  title?: string;
  children?: ReactNode;
  tone?: 'info' | 'success' | 'danger';
  onClose?: () => void;
  testID?: string;
}
export interface AlertWebProps extends AlertBaseProps {
  style?: CSSProperties;
  className?: string;
}
export interface AlertNativeProps extends AlertBaseProps {
  style?: ViewStyle;
}
export type AlertProps = AlertBaseProps & {
  style?: CSSProperties | ViewStyle;
  className?: string;
};
