import type {CSSProperties} from 'react';
import type {ViewStyle} from 'react-native';

export interface PaginationBaseProps {
  totalPages: number;
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  disabled?: boolean;
  label?: string;
  testID?: string;
}
export interface PaginationWebProps extends PaginationBaseProps {
  style?: CSSProperties;
  className?: string;
}
export interface PaginationNativeProps extends PaginationBaseProps {
  style?: ViewStyle;
}
export type PaginationProps = PaginationBaseProps & {
  style?: CSSProperties | ViewStyle;
  className?: string;
};
