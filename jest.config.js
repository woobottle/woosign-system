/**
 * Jest config — smoke tests for the shared (platform-agnostic) core.
 *
 * Components ship separate `.web.tsx` / `.native.tsx` files; fully testing
 * them is the host app's job (Jest-RN preset for native, jsdom for web).
 * This config focuses on the tokens + variant system, where bugs would
 * break every component.
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {tsconfig: {jsx: 'react-jsx', esModuleInterop: true}}],
  },
};
