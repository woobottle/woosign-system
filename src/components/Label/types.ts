import type {ReactNode, CSSProperties} from 'react';
import type {TextStyle} from 'react-native';

export interface LabelBaseProps {
  children?: ReactNode;
  htmlFor?: string;
  required?: boolean;
  disabled?: boolean;
  testID?: string;
}
export interface LabelWebProps extends LabelBaseProps {
  style?: CSSProperties;
  className?: string;
}
export interface LabelNativeProps extends LabelBaseProps {
  style?: TextStyle;
}
export type LabelProps = LabelBaseProps & {
  style?: CSSProperties | TextStyle;
  className?: string;
};
