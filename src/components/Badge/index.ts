/**
 * Badge component exports
 *
 * The actual implementation is resolved by the bundler:
 * - Metro (React Native): resolves to Badge.native.tsx
 * - Webpack/Vite (Web): resolves to Badge.web.tsx
 */

// Re-export types
export type {
  BadgeProps,
  BadgeBaseProps,
  BadgeWebProps,
  BadgeNativeProps,
  BadgeVariant,
} from './types';

// Re-export component
// Note: The bundler will resolve this to the correct platform-specific file
export { Badge } from './Badge';
