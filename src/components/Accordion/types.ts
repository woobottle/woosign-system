import type {ReactNode, CSSProperties} from 'react';
import type {ViewStyle} from 'react-native';
export interface AccordionItem {
  value: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionBaseProps {
  id: string;
  items: readonly AccordionItem[];
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (value: readonly string[]) => void;
  multiple?: boolean;
  disabled?: boolean;
  testID?: string;
}
export interface AccordionWebProps extends AccordionBaseProps {
  style?: CSSProperties;
  className?: string;
}
export interface AccordionNativeProps extends AccordionBaseProps {
  style?: ViewStyle;
}
export type AccordionProps = AccordionBaseProps & {
  style?: CSSProperties | ViewStyle;
  className?: string;
};
