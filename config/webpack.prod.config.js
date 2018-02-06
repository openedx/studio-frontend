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
        // babel-pollyfill is already loaded once in Studio
        test: /babel-polyfill/,
        use: 'null-loader',
      },
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, '../src'),
        ],
        loader: 'babel-loader',
      },
      {
        test: /(.scss|.css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                modules: true,
                minimize: true,
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
        }),
      },
      {
        // Font-Awesome and OpenSans is already loaded and available in Studio
        test: /\.(woff2?|ttf|svg|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'null-loader',
      },
    ],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => module.context && module.context.includes('node_modules'),
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),
    new ExtractTextPlugin({
      filename: '[name].min.css',
      allChunks: true,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
  ],
});
