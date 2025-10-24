import { AppRegistry } from 'react-native';
import App from './App.web';
import { name as appName } from './app.json';

// Register the app for web
AppRegistry.registerComponent(appName, () => App);

// Run the app on web
AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById('root')
});