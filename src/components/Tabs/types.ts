import type {ReactNode} from 'react';
import type {ViewStyle, TextStyle} from 'react-native';

/** One tab definition. */
export interface TabItem {
  key: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface TabsBaseProps {
  items: TabItem[];
  value: string;
  onChange: (key: string) => void;
  /** Inverse surface (for deep-ink feature bands). */
  inverse?: boolean;
  testID?: string;
}

export interface TabsWebProps extends TabsBaseProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface TabsNativeProps extends TabsBaseProps {
  style?: ViewStyle;
  tabStyle?: ViewStyle;
  labelStyle?: TextStyle;
}

export type TabsProps = TabsBaseProps & {
  style?: ViewStyle | React.CSSProperties;
  className?: string;
};
