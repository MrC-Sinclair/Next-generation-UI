const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appDirectory = __dirname;
const isProd =
  process.env.NODE_ENV === 'production' ||
  process.argv.includes('--mode=production') ||
  process.argv.includes('production');

/**
 * Web（PC 浏览器）打包配置
 * ------------------------------------------------------------
 * 同一套 src/ 代码，通过 `react-native` -> `react-native-web` 别名
 * 直接跑在浏览器里，天然支持 PC 各种尺寸（由 useResponsive 做断点适配）。
 * 平台后缀 `.web.tsx / .web.ts` 优先级最高，用于写 Web 专属实现（如 CSS 渐变）。
 */
module.exports = {
  entry: path.resolve(appDirectory, 'web/index.web.js'),
  target: 'web',
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? false : 'eval-cheap-module-source-map',
  output: {
    path: path.resolve(appDirectory, 'web-dist'),
    filename: 'bundle.[contenthash:8].js',
    publicPath: '',
    clean: true,
  },
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
      'react-native/Libraries/Renderer/shims/ReactNativeViewConfigRegistry': 'react-native-web/dist/modules/forwardedProps',
      '@': path.resolve(appDirectory, 'src'),
    },
    extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
    mainFields: ['browser', 'module', 'main'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: [
          path.resolve(appDirectory, 'src'),
          path.resolve(appDirectory, 'web'),
          path.resolve(appDirectory, 'index.js'),
        ],
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            configFile: false,
            cacheDirectory: true,
            presets: [
              ['@babel/preset-env', {targets: {browsers: ['last 2 versions', 'not dead']}, modules: false}],
              ['@babel/preset-react', {runtime: 'automatic'}],
              '@babel/preset-typescript',
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(!isProd),
      'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(appDirectory, 'web/index.html'),
      filename: 'index.html',
      inject: 'body',
    }),
  ],
  devServer: {
    static: path.resolve(appDirectory, 'web-dist'),
    historyApiFallback: true,
    hot: true,
    host: '0.0.0.0',
    port: 4321,
    allowedHosts: 'all',
    client: {overlay: false},
  },
  performance: {hints: false},
};
