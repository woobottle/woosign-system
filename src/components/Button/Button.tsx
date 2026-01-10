/**
 * Button facade
 *
 * This file serves as the entry point for bundler resolution.
 * The actual implementation comes from:
 * - Button.web.tsx (for web builds with .web.tsx extension priority)
 * - Button.native.tsx (for native builds with .native.tsx extension priority)
 *
 * This facade file is used when neither extension is prioritized.
 */

// Default to native implementation for React Native projects
export { Button } from './Button.native';
