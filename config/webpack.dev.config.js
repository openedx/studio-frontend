'use strict';

const Merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const apiEndpoints = require('../src/data/api/endpoints.js');
const commonConfig = require('./webpack.common.config.js');

const targetUrl = 'http://edx.devstack.studio:18010';

module.exports = Merge.smart(commonConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
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
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              ident: 'postcss',
              plugins: () => [
                /* eslint-disable global-require */
                require('autoprefixer'),
                require('../src/utils/matches-prefixer.js'),
                require('postcss-pseudo-class-any-link'),
                require('postcss-initial')(),
                require('postcss-prepend-selector')({ selector: '#root.SFE ' }),
                /* eslint-enable global-require */
              ],
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
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['editImageModal'],
      filename: 'editImageModal.html',
      template: path.resolve(__dirname, '../public/index.html'),
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['courseHealthCheck'],
      filename: 'courseHealthCheck.html',
      template: path.resolve(__dirname, '../public/index.html'),
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['courseOutlineHealthCheck'],
      filename: 'courseOutlineHealthCheck.html',
      template: path.resolve(__dirname, '../public/index.html'),
    }),
  ],
  devServer: {
    host: '0.0.0.0',
    port: 18011,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    overlay: true,
    proxy: Object.keys(apiEndpoints).reduce(
      (map, endpoint) => {
        map[apiEndpoints[endpoint]] = { // eslint-disable-line no-param-reassign
          target: targetUrl,
        };
        return map;
      }, {}),
  },
});
