import type {CSSProperties} from 'react';
import type {ViewStyle} from 'react-native';

export type StepperOrientation = 'horizontal' | 'vertical';
export type StepStatus = 'complete' | 'current' | 'upcoming';

export interface StepperStep {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface StepperBaseProps {
  steps: readonly StepperStep[];
  /** Value of the current step. Steps before it are complete. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: StepperOrientation;
  /** Let people go back by pressing a completed step. */
  navigable?: boolean;
  /** Accessible name for the whole stepper. */
  label: string;
  testID?: string;
}
export interface StepperWebProps extends StepperBaseProps {
  style?: CSSProperties;
  className?: string;
}
export interface StepperNativeProps extends StepperBaseProps {
  style?: ViewStyle;
}
export type StepperProps = StepperBaseProps & {
  style?: CSSProperties | ViewStyle;
  className?: string;
};
