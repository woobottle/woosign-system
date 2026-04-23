/**
 * Jest harness — two projects sharing the same transformer.
 *
 * - "tokens" : node env, covers the shared core (tokens, variants,
 *              resolveFontFamily). Fast, no DOM.
 * - "web"    : jsdom env, resolves .web.tsx ahead of .tsx so web
 *              components render in isolation with
 *              @testing-library/react + jest-dom matchers.
 *
 * Host apps still own end-to-end RN testing (jest-RN preset + Detox).
 */
const tsJest = [
  'ts-jest',
  {tsconfig: {jsx: 'react-jsx', esModuleInterop: true}},
];

module.exports = {
  projects: [
    {
      displayName: 'tokens',
      testEnvironment: 'node',
      roots: ['<rootDir>/src'],
      testMatch: ['<rootDir>/src/__tests__/**/*.test.ts'],
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
      transform: {'^.+\\.tsx?$': tsJest},
    },
    {
      displayName: 'web',
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/src'],
      testMatch: ['<rootDir>/src/**/*.web.test.tsx'],
      moduleFileExtensions: [
        'web.tsx',
        'web.ts',
        'tsx',
        'ts',
        'jsx',
        'js',
        'json',
      ],
      transform: {'^.+\\.tsx?$': tsJest},
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    },
  ],
};
