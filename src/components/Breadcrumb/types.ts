import type {CSSProperties} from 'react';
import type {ViewStyle} from 'react-native';
export interface BreadcrumbItem {
  label: string;
  href?: string;
  onPress?: () => void;
}

export interface BreadcrumbBaseProps {
  items: readonly BreadcrumbItem[];
  label?: string;
  testID?: string;
}
export interface BreadcrumbWebProps extends BreadcrumbBaseProps {
  style?: CSSProperties;
  className?: string;
}
export interface BreadcrumbNativeProps extends BreadcrumbBaseProps {
  style?: ViewStyle;
}
export type BreadcrumbProps = BreadcrumbBaseProps & {
  style?: CSSProperties | ViewStyle;
  className?: string;
};
