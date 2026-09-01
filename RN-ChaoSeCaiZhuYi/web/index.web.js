/**
 * Web 入口：把 RN 的 AppRegistry 接到浏览器 DOM 上。
 * 原生端入口是根目录的 index.js，两端共用同一个 <App />。
 */
import {AppRegistry} from 'react-native';
import App from '../src/App';

const rootTag = document.getElementById('root');
const boot = document.getElementById('boot');

AppRegistry.registerComponent('chroma-portfolio', () => App);
AppRegistry.runApplication('chroma-portfolio', {rootTag});

if (boot && boot.parentNode) {
  boot.parentNode.removeChild(boot);
}
