/**
 * Jest harness — three projects.
 *
 * - "tokens" : node env (ts-jest), covers the shared core (tokens, variants,
 *              resolveFontFamily). Fast, no DOM.
 * - "web"    : jsdom env (ts-jest), resolves .web.tsx ahead of .tsx so web
 *              components render with @testing-library/react + jest-dom.
 * - "native" : react-native preset (babel-jest), resolves .native.tsx ahead
 *              of .tsx so RN components render with
 *              @testing-library/react-native. Modal/ScrollView are mocked by
 *              the preset (children render through), so these tests cover
 *              behavior — not real scroll/layout.
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
    {
      displayName: 'native',
      preset: 'react-native',
      roots: ['<rootDir>/src'],
      testMatch: ['<rootDir>/src/**/*.native.test.tsx'],
      moduleFileExtensions: [
        'native.tsx',
        'native.ts',
        'tsx',
        'ts',
        'jsx',
        'js',
        'json',
      ],
    },
  ],
};
