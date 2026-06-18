import type {ReactNode} from 'react';
import type {ViewStyle, PressableProps} from 'react-native';

export type CheckboxSize = 'sm' | 'default' | 'lg';

export interface CheckboxBaseProps {
  /** 체크 여부 (controlled). */
  checked?: boolean;
  /** 중간 상태 — 체크 대신 대시(–). checked보다 우선해 시각/aria에 반영. */
  indeterminate?: boolean;
  /** 누르면 onCheckedChange(!checked) 호출. */
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** 우측 라벨. */
  label?: ReactNode;
  size?: CheckboxSize;
  testID?: string;
}

export interface CheckboxWebProps extends CheckboxBaseProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface CheckboxNativeProps extends CheckboxBaseProps {
  style?: ViewStyle;
  pressableProps?: Omit<PressableProps, 'onPress' | 'disabled' | 'style'>;
}

export type CheckboxProps = CheckboxBaseProps & {
  style?: ViewStyle | React.CSSProperties;
  className?: string;
};
