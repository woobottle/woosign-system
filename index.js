import React from 'react';
import { AppRegistry, View, LogBox } from 'react-native';
import { name as appName } from './app.json';
import StorybookUIRoot from './.storybook-native';

// Suppress RCTEventEmitter error (bridgeless architecture compatibility issue)
LogBox.ignoreLogs(['Failed to call into JavaScript module method RCTEventEmitter']);

function App() {
  return (
    <View style={{ flex: 1 }}>
      <StorybookUIRoot />
    </View>
  );
}

AppRegistry.registerComponent(appName, () => App);
