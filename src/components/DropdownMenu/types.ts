import type {ReactNode, CSSProperties} from 'react';
import type {ViewStyle} from 'react-native';
export interface DropdownMenuItem {
  value: string;
  label: string;
  onSelect?: () => void;
  disabled?: boolean;
  destructive?: boolean;
}

export interface DropdownMenuBaseProps {
  trigger: ReactNode;
  label: string;
  items: readonly DropdownMenuItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  testID?: string;
}
export interface DropdownMenuWebProps extends DropdownMenuBaseProps {
  style?: CSSProperties;
  className?: string;
}
export interface DropdownMenuNativeProps extends DropdownMenuBaseProps {
  style?: ViewStyle;
}
export type DropdownMenuProps = DropdownMenuBaseProps & {
  style?: CSSProperties | ViewStyle;
  className?: string;
};
