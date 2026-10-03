import type {ReactNode, CSSProperties} from 'react';
import type {ViewStyle} from 'react-native';

export interface AvatarBaseProps {
  src?: string;
  name?: string;
  fallback?: ReactNode;
  size?: number;
  testID?: string;
}
export interface AvatarWebProps extends AvatarBaseProps {
  style?: CSSProperties;
  className?: string;
}
export interface AvatarNativeProps extends AvatarBaseProps {
  style?: ViewStyle;
}
export type AvatarProps = AvatarBaseProps & {
  style?: CSSProperties | ViewStyle;
  className?: string;
};
