module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    // tsconfig uses the automatic JSX runtime ("jsx": "react-jsx"),
    // so React does not need to be in scope for JSX.
    'react/react-in-jsx-scope': 'off',
  },
  overrides: [
    {
      // no-inline-styles targets React Native StyleSheet usage. Web components
      // pass plain DOM style objects, and stories/examples are demo code.
      files: ['**/*.web.tsx', '**/*.stories.tsx', 'src/examples/**'],
      rules: {
        'react-native/no-inline-styles': 'off',
      },
    },
  ],
};
