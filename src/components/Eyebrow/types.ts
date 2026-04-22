import type {ReactNode} from 'react';
import type {TextStyle} from 'react-native';

/** Eyebrow tone — secondary ink (default), ember brand accent, or ceremonial gold. */
export type EyebrowTone = 'default' | 'brand' | 'gold' | 'inverse';

export interface EyebrowBaseProps {
  tone?: EyebrowTone;
  children?: ReactNode;
  testID?: string;
}

export interface EyebrowWebProps extends EyebrowBaseProps {
  className?: string;
  style?: React.CSSProperties;
  as?: 'span' | 'div' | 'p';
}

export interface EyebrowNativeProps extends EyebrowBaseProps {
  style?: TextStyle;
}

export type EyebrowProps = EyebrowBaseProps & {
  style?: TextStyle | React.CSSProperties;
  className?: string;
};
