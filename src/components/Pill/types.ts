import type {ReactNode} from 'react';
import type {ViewStyle, TextStyle, PressableProps} from 'react-native';

/** Selectable pill used for category filters, etc. */
export interface PillBaseProps {
  active?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  onPress?: () => void;
  testID?: string;
}

export interface PillWebProps extends PillBaseProps {
  className?: string;
  style?: React.CSSProperties;
  type?: 'button' | 'submit';
}

export interface PillNativeProps extends PillBaseProps {
  style?: ViewStyle;
  textStyle?: TextStyle;
  pressableProps?: Omit<PressableProps, 'onPress' | 'disabled' | 'style'>;
}

export type PillProps = PillBaseProps & {
  style?: ViewStyle | React.CSSProperties;
  className?: string;
};
