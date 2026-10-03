import type {ReactNode, CSSProperties} from 'react';
import type {ViewStyle} from 'react-native';

export interface TooltipBaseProps {
  id: string;
  trigger: ReactNode;
  content: string;
  disabled?: boolean;
  testID?: string;
}
export interface TooltipWebProps extends TooltipBaseProps {
  style?: CSSProperties;
  className?: string;
}
export interface TooltipNativeProps extends TooltipBaseProps {
  style?: ViewStyle;
}
export type TooltipProps = TooltipBaseProps & {
  style?: CSSProperties | ViewStyle;
  className?: string;
};
