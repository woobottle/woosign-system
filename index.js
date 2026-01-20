import { AppRegistry, View, Text } from 'react-native';
import { name as appName } from './app.json';

// Test component to debug
const TestApp = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }}>
    <Text style={{ fontSize: 24, color: 'white' }}>Test Screen</Text>
  </View>
);

AppRegistry.registerComponent(appName, () => TestApp);
