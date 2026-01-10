import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

// Always load Storybook for this design system library
// since there's no separate app to toggle between
const App = require('./.storybook-native').default;

AppRegistry.registerComponent(appName, () => App);
