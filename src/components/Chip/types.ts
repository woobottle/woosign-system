import type {ReactNode} from 'react';
import type {ViewStyle, TextStyle, PressableProps} from 'react-native';

/** Chip tone — square-cornered tag used for tight chrome (cards, tabs). */
export type ChipTone = 'default' | 'solid' | 'outline';

export interface ChipBaseProps {
  tone?: ChipTone;
  disabled?: boolean;
  children?: ReactNode;
  onPress?: () => void;
  leftAdornment?: ReactNode;
  rightAdornment?: ReactNode;
  testID?: string;
}

export interface ChipWebProps extends ChipBaseProps {
  className?: string;
  style?: React.CSSProperties;
  type?: 'button' | 'submit';
}

export interface ChipNativeProps extends ChipBaseProps {
  style?: ViewStyle;
  textStyle?: TextStyle;
  pressableProps?: Omit<PressableProps, 'onPress' | 'disabled' | 'style'>;
}

export type ChipProps = ChipBaseProps & {
  style?: ViewStyle | React.CSSProperties;
  className?: string;
};
