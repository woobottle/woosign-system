import type {ViewStyle} from 'react-native';

/** Divider tone — default (hairline on light) or inverse (hairline on ink). */
export type DividerTone = 'default' | 'inverse';

export interface DividerBaseProps {
  tone?: DividerTone;
  orientation?: 'horizontal' | 'vertical';
  testID?: string;
}

export interface DividerWebProps extends DividerBaseProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface DividerNativeProps extends DividerBaseProps {
  style?: ViewStyle;
}

export type DividerProps = DividerBaseProps & {
  style?: ViewStyle | React.CSSProperties;
  className?: string;
};
