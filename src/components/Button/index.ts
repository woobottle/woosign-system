/**
 * Button component exports
 *
 * The actual implementation is resolved by the bundler:
 * - Metro (React Native): resolves to Button.native.tsx
 * - Webpack/Vite (Web): resolves to Button.web.tsx
 */

// Re-export types
export type {
  ButtonProps,
  ButtonBaseProps,
  ButtonWebProps,
  ButtonNativeProps,
  ButtonVariant,
  ButtonSize,
} from './types';

// Re-export component
// Note: The bundler will resolve this to the correct platform-specific file
export { Button } from './Button';
