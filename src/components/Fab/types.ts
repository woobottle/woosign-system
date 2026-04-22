import type {ReactNode} from 'react';
import type {ViewStyle, PressableProps} from 'react-native';

/** FAB tone — ember (default), ink, or gold ceremonial. */
export type FabTone = 'ember' | 'ink' | 'gold';
export type FabSize = 'default' | 'lg';

export interface FabBaseProps {
  tone?: FabTone;
  size?: FabSize;
  disabled?: boolean;
  onPress?: () => void;
  children?: ReactNode;
  accessibilityLabel?: string;
  testID?: string;
}

export interface FabWebProps extends FabBaseProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface FabNativeProps extends FabBaseProps {
  style?: ViewStyle;
  pressableProps?: Omit<PressableProps, 'onPress' | 'disabled' | 'style'>;
}

export type FabProps = FabBaseProps & {
  style?: ViewStyle | React.CSSProperties;
  className?: string;
};
