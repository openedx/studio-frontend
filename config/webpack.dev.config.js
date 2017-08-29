'use strict';

const Merge = require('webpack-merge');
const commonConfig = require('./webpack.common.config.js');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = Merge.smart(commonConfig, {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    `${require.resolve('webpack-dev-server/client')}?/`,
    require.resolve('webpack/hot/dev-server'),
    require.resolve('react-error-overlay'),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, '../src'),
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, '../public/index.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:18010',
        pathRewrite: { '^/api': '' },
      },
    },
  },
});
