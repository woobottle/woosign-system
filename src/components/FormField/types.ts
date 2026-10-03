import type {ReactNode, CSSProperties} from 'react';
import type {ViewStyle} from 'react-native';
export interface FormFieldInputProps {
  id: string;
  required?: boolean;
  disabled?: boolean;
  'aria-invalid': boolean;
  'aria-describedby'?: string;
  accessibilityLabel: string;
  accessibilityHint?: string;
}

export interface FormFieldBaseProps {
  /** Stable id for input/label/help associations. */
  id: string;
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  /** Render input using the provided accessibility attributes. */
  children: (props: FormFieldInputProps) => ReactNode;
  testID?: string;
}
export interface FormFieldWebProps extends FormFieldBaseProps {
  style?: CSSProperties;
  className?: string;
}
export interface FormFieldNativeProps extends FormFieldBaseProps {
  style?: ViewStyle;
}
export type FormFieldProps = FormFieldBaseProps & {
  style?: CSSProperties | ViewStyle;
  className?: string;
};
