/**
 * Input facade
 *
 * This file serves as the entry point for bundler resolution.
 * The actual implementation comes from:
 * - Input.web.tsx (for web builds with .web.tsx extension priority)
 * - Input.native.tsx (for native builds with .native.tsx extension priority)
 *
 * This facade file is used when neither extension is prioritized.
 */

// Default to native implementation for React Native projects
export { Input } from './Input.native';
