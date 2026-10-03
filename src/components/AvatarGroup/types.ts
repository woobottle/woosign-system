import type {CSSProperties} from 'react';
import type {ViewStyle} from 'react-native';

export interface AvatarGroupBaseProps {
  items: readonly {src?: string; name: string}[];
  max?: number;
  size?: number;
  testID?: string;
}
export interface AvatarGroupWebProps extends AvatarGroupBaseProps {
  style?: CSSProperties;
  className?: string;
}
export interface AvatarGroupNativeProps extends AvatarGroupBaseProps {
  style?: ViewStyle;
}
export type AvatarGroupProps = AvatarGroupBaseProps & {
  style?: CSSProperties | ViewStyle;
  className?: string;
};
