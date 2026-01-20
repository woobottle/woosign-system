/**
 * Input component exports
 *
 * The actual implementation is resolved by the bundler:
 * - Metro (React Native): resolves to Input.native.tsx
 * - Webpack/Vite (Web): resolves to Input.web.tsx
 */

// Re-export types
export type {
  InputProps,
  InputBaseProps,
  InputWebProps,
  InputNativeProps,
  InputVariant,
  InputSize,
} from './types';

// Re-export component
// Note: The bundler will resolve this to the correct platform-specific file
export { Input } from './Input';
