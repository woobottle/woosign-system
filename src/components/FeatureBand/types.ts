import type {ReactNode} from 'react';
import type {ViewStyle} from 'react-native';

/** Feature band tone — inverse (ink900), ember gradient, or reward (cream-300). */
export type FeatureBandTone = 'inverse' | 'ember' | 'reward';

export interface FeatureBandBaseProps {
  tone?: FeatureBandTone;
  /** Large radius for hero-style bands; defaults to `lg` (16px). */
  rounded?: boolean;
  children?: ReactNode;
  testID?: string;
}

export interface FeatureBandWebProps extends FeatureBandBaseProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface FeatureBandNativeProps extends FeatureBandBaseProps {
  style?: ViewStyle;
}

export type FeatureBandProps = FeatureBandBaseProps & {
  style?: ViewStyle | React.CSSProperties;
  className?: string;
};
