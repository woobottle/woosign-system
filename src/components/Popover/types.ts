import type {ReactNode, CSSProperties} from 'react';
import type {ViewStyle} from 'react-native';

export interface PopoverBaseProps {
  trigger: ReactNode;
  label: string;
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  testID?: string;
}
export interface PopoverWebProps extends PopoverBaseProps {
  style?: CSSProperties;
  className?: string;
}
export interface PopoverNativeProps extends PopoverBaseProps {
  style?: ViewStyle;
}
export type PopoverProps = PopoverBaseProps & {
  style?: CSSProperties | ViewStyle;
  className?: string;
};
