import type {CSSProperties} from 'react';
import type {ViewStyle} from 'react-native';

export interface CalendarBaseProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  defaultMonth?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  isDateDisabled?: (date: string) => boolean;
  locale?: 'ko' | 'en';
  testID?: string;
}
export interface CalendarWebProps extends CalendarBaseProps {
  style?: CSSProperties;
  className?: string;
}
export interface CalendarNativeProps extends CalendarBaseProps {
  style?: ViewStyle;
}
export type CalendarProps = CalendarBaseProps & {
  style?: CSSProperties | ViewStyle;
  className?: string;
};
