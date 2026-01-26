import React from 'react';
import { AppRegistry, View, LogBox } from 'react-native';
import { name as appName } from './app.json';
import StorybookUIRoot from './.storybook';

// Suppress common warnings
LogBox.ignoreLogs([
  'Failed to call into JavaScript module method RCTEventEmitter',
]);

function App() {
  return (
    <View style={{ flex: 1 }}>
      <StorybookUIRoot />
    </View>
  );
}

AppRegistry.registerComponent(appName, () => App);
