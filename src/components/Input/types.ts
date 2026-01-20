/**
 * Input component types
 * shadcn/ui inspired variants
 */

import type { ReactNode } from 'react';
import type { ViewStyle, TextStyle, TextInputProps } from 'react-native';

// Input variants (shadcn/ui style)
export type InputVariant = 'default' | 'error';

// Input sizes
export type InputSize = 'default' | 'sm' | 'lg';

// Common props shared between web and native
export interface InputBaseProps {
  /** Input visual style variant */
  variant?: InputVariant;
  /** Input size */
  size?: InputSize;
  /** Placeholder text */
  placeholder?: string;
  /** Current value */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Read-only state */
  readOnly?: boolean;
  /** Value change handler */
  onChangeText?: (text: string) => void;
  /** Focus handler */
  onFocus?: () => void;
  /** Blur handler */
  onBlur?: () => void;
  /** Submit handler (for keyboard submit) */
  onSubmitEditing?: () => void;
  /** Full width input */
  fullWidth?: boolean;
  /** Left icon/element */
  leftIcon?: ReactNode;
  /** Right icon/element */
  rightIcon?: ReactNode;
  /** Test ID for testing */
  testID?: string;
  /** Input type (text, password, email, etc.) */
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';
  /** Auto-capitalize behavior */
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  /** Auto-correct behavior */
  autoCorrect?: boolean;
  /** Auto-focus on mount */
  autoFocus?: boolean;
  /** Keyboard type */
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'decimal-pad' | 'url';
  /** Return key type */
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  /** Maximum length */
  maxLength?: number;
  /** Multiline input (textarea) */
  multiline?: boolean;
  /** Number of lines for multiline */
  numberOfLines?: number;
}

// Web-specific props
export interface InputWebProps extends InputBaseProps {
  /** Additional CSS class name */
  className?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
  /** HTML name attribute */
  name?: string;
  /** HTML id attribute */
  id?: string;
  /** Required field */
  required?: boolean;
  /** Pattern for validation */
  pattern?: string;
  /** Min value for number inputs */
  min?: number | string;
  /** Max value for number inputs */
  max?: number | string;
  /** Step value for number inputs */
  step?: number | string;
}

// Native-specific props
export interface InputNativeProps extends InputBaseProps {
  /** Custom container style */
  style?: ViewStyle;
  /** Custom input style */
  inputStyle?: TextStyle;
  /** Additional TextInput props */
  textInputProps?: Omit<
    TextInputProps,
    | 'value'
    | 'onChangeText'
    | 'placeholder'
    | 'editable'
    | 'style'
    | 'onFocus'
    | 'onBlur'
  >;
  /** Secure text entry (password) */
  secureTextEntry?: boolean;
}

// Union type for platform-agnostic usage
export type InputProps = InputBaseProps & {
  style?: ViewStyle | React.CSSProperties;
  className?: string;
  name?: string;
  id?: string;
};
