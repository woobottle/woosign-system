/**
 * Card component exports
 *
 * The actual implementation is resolved by the bundler:
 * - Metro (React Native): resolves to Card.native.tsx
 * - Webpack/Vite (Web): resolves to Card.web.tsx
 */

// Re-export types
export type {
  CardProps,
  CardBaseProps,
  CardWebProps,
  CardNativeProps,
  CardVariant,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
} from './types';

// Re-export components
// Note: The bundler will resolve this to the correct platform-specific file
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './Card';
