module.exports = {
  rootDir: '..',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/site/src/**/*.test.tsx'],
  moduleFileExtensions: ['web.tsx', 'web.ts', 'tsx', 'ts', 'js', 'json'],
  moduleNameMapper: {'^woosign-system$': '<rootDir>/src/index.ts'},
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
          resolveJsonModule: true,
        },
      },
    ],
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
