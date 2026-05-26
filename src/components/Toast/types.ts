import type {ReactNode} from 'react';
import type {ViewStyle, TextStyle} from 'react-native';

/** Toast tone — drives the accompanying status dot color. */
export type ToastTone = 'success' | 'danger' | 'brand' | 'neutral';

export interface ToastBaseProps {
  tone?: ToastTone;
  title: ReactNode;
  description?: ReactNode;
  /** Optional custom glyph for the leading status dot. */
  glyph?: ReactNode;
  /** Hide the leading status dot. */
  hideIcon?: boolean;
  testID?: string;
}

/**
 * Options passed to `useToast().show(...)` and the tone helpers.
 *
 * Same shape as the dumb Toast props plus `duration` (ms before auto-dismiss,
 * default 4000; pass 0 to keep open until manually dismissed).
 */
export interface ToastOptions {
  tone?: ToastTone;
  title: ReactNode;
  description?: ReactNode;
  glyph?: ReactNode;
  hideIcon?: boolean;
  /** Auto-dismiss delay in ms. Default 4000. `0` disables auto-dismiss. */
  duration?: number;
}

/** Internal queue entry — `id` is assigned by the provider. */
export interface ToastEntry extends ToastOptions {
  id: string;
}

/**
 * Imperative API returned by `useToast()`.
 *
 * Every method returns the new toast's `id` so callers can dismiss
 * a specific toast later. `dismiss()` with no arg dismisses all.
 */
export interface ToastApi {
  show(options: ToastOptions): string;
  success(options: Omit<ToastOptions, 'tone'>): string;
  error(options: Omit<ToastOptions, 'tone'>): string;
  brand(options: Omit<ToastOptions, 'tone'>): string;
  neutral(options: Omit<ToastOptions, 'tone'>): string;
  dismiss(id?: string): void;
}

/** Position for the toast stack on screen. Default: bottom. */
export type ToastPosition = 'top' | 'bottom';

export interface ToastProviderProps {
  children?: ReactNode;
  /** Default duration applied to toasts that don't specify one. Default 4000. */
  duration?: number;
  /** Stack position. Default 'bottom'. */
  position?: ToastPosition;
  /** Max concurrent visible toasts. Older ones are dismissed. Default 5. */
  max?: number;
  /** Bottom/top offset in px. Default 24. */
  offset?: number;
}

export interface ToastWebProps extends ToastBaseProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface ToastNativeProps extends ToastBaseProps {
  style?: ViewStyle;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
}

export type ToastProps = ToastBaseProps & {
  style?: ViewStyle | React.CSSProperties;
  className?: string;
};
