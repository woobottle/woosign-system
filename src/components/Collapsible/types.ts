import type {ReactNode, CSSProperties} from 'react';
import type {ViewStyle} from 'react-native';

export interface CollapsibleBaseProps {
  id: string;
  title: string;
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  testID?: string;
}
export interface CollapsibleWebProps extends CollapsibleBaseProps {
  style?: CSSProperties;
  className?: string;
}
export interface CollapsibleNativeProps extends CollapsibleBaseProps {
  style?: ViewStyle;
}
export type CollapsibleProps = CollapsibleBaseProps & {
  style?: CSSProperties | ViewStyle;
  className?: string;
};
