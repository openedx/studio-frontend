'use strict';

const Merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const apiEndpoints = require('../src/data/api/endpoints.js');
const commonConfig = require('./webpack.common.config.js');

let targetUrl = 'localhost';
if (!process.env.RUNNING_ON_LINUX) {
  targetUrl = `docker.for.mac.${targetUrl}`;
}
targetUrl = `http://${targetUrl}:18010`;

module.exports = Merge.smart(commonConfig, {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    assets: [
      // enable react's custom hot dev client so we get errors reported
      // in the browser
      require.resolve('react-dev-utils/webpackHotDevClient'),
      path.resolve(__dirname, '../src/index.jsx'),
    ],
    accessibilityPolicy: [
      // enable react's custom hot dev client so we get errors reported
      // in the browser
      require.resolve('react-dev-utils/webpackHotDevClient'),
      path.resolve(__dirname, '../src/accessibilityIndex.jsx'),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, '../src'),
        ],
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      },
      {
        test: /(.scss|.css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
              localIdentName: '[local]',
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              includePaths: [
                path.join(__dirname, '../node_modules'),
                path.join(__dirname, '../src'),
              ],
            },
          },
        ],
      },
      {
        test: /\.(woff2?|ttf|svg|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['assets'],
      filename: 'assets.html',
      template: path.resolve(__dirname, '../public/index.html'),
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['accessibilityPolicy'],
      filename: 'accessibilityPolicy.html',
      template: path.resolve(__dirname, '../public/index.html'),
    }),
  ],
  devServer: {
    host: '0.0.0.0',
    port: 18011,
    proxy: Object.keys(apiEndpoints).reduce(
      (map, endpoint) => {
        map[apiEndpoints[endpoint]] = { // eslint-disable-line no-param-reassign
          target: targetUrl,
        };
        return map;
      }, {}),
  },
});
