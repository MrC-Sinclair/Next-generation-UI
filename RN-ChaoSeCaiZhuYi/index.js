/**
 * 原生端入口：Android / iOS / 鸿蒙（RN-OH）共用。
 * Web 端请走 web/index.web.js。
 */
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
