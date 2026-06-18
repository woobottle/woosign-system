import type {ReactNode} from 'react';
import type {ViewStyle} from 'react-native';

export type RadioSize = 'sm' | 'default' | 'lg';

export interface RadioGroupBaseProps {
  /** 현재 선택 값 (controlled). */
  value?: string;
  onValueChange?: (value: string) => void;
  /** 그룹 전체 비활성. */
  disabled?: boolean;
  /** web 라디오 name 그룹(선택). */
  name?: string;
  children?: ReactNode;
  testID?: string;
}

export interface RadioGroupWebProps extends RadioGroupBaseProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface RadioGroupNativeProps extends RadioGroupBaseProps {
  style?: ViewStyle;
}

export interface RadioBaseProps {
  /** 이 라디오의 값(필수). */
  value: string;
  label?: ReactNode;
  /** 개별 비활성(그룹 disabled와 OR). */
  disabled?: boolean;
  size?: RadioSize;
  testID?: string;
}

export interface RadioWebProps extends RadioBaseProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface RadioNativeProps extends RadioBaseProps {
  style?: ViewStyle;
}

export interface RadioContextValue {
  value: string | undefined;
  onValueChange: ((value: string) => void) | undefined;
  disabled: boolean;
  name: string | undefined;
}

export type RadioGroupProps = RadioGroupBaseProps & {
  style?: ViewStyle | React.CSSProperties;
  className?: string;
};
export type RadioProps = RadioBaseProps & {
  style?: ViewStyle | React.CSSProperties;
  className?: string;
};
