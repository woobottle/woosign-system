/**
 * Switch component exports
 *
 * The actual implementation is resolved by the bundler:
 * - Metro (React Native): resolves to Switch.native.tsx
 * - Webpack/Vite (Web): resolves to Switch.web.tsx
 */

// Re-export types
export type {
  SwitchProps,
  SwitchBaseProps,
  SwitchWebProps,
  SwitchNativeProps,
  SwitchSize,
} from './types';

// Re-export component
// Note: The bundler will resolve this to the correct platform-specific file
export { Switch } from './Switch';
