'use strict';

const Merge = require('webpack-merge');
const commonConfig = require('./webpack.common.config.js');
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = Merge.smart(commonConfig, {
  devtool: 'source-map',
  output: {
    filename: '[name].min.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, '../src'),
        loader: 'babel-loader',
      },
      {
        test: /.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
              minimize: true,
            },
          },
        }),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('studio-frontend.min.css'),
    new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
  ],
});
