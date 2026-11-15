module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    // tsconfig uses the automatic JSX runtime ("jsx": "react-jsx"),
    // so React does not need to be in scope for JSX.
    'react/react-in-jsx-scope': 'off',
  },
};
