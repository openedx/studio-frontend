'use strict';

const path = require('path');

module.exports = {
  entry: {
    assets: path.resolve(__dirname, '../src/index.jsx'),
    accessibilityPolicy: path.resolve(__dirname, '../src/accessibilityIndex.jsx'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
