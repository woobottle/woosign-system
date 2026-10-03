import type {ReactNode, CSSProperties} from 'react';
import type {ViewStyle} from 'react-native';

export interface ListItemBaseProps {
  title: string;
  description?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
}
export interface ListItemWebProps extends ListItemBaseProps {
  style?: CSSProperties;
  className?: string;
}
export interface ListItemNativeProps extends ListItemBaseProps {
  style?: ViewStyle;
}
export type ListItemProps = ListItemBaseProps & {
  style?: CSSProperties | ViewStyle;
  className?: string;
};
