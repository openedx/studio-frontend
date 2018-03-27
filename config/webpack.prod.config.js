'use strict';

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Merge = require('webpack-merge');
const path = require('path');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');

const commonConfig = require('./webpack.common.config.js');

module.exports = Merge.smart(commonConfig, {
  devtool: 'source-map',
  output: {
    filename: '[name].min.js',
    // The webpack runtime will attach itself to window.studiofrontendJsonP instead of
    // window.webpackJsonP so that it does not conflict with the platform's webpack runtime.
    jsonpFunction: 'studiofrontendJsonP',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, '../src'),
        ],
        loader: 'babel-loader',
      },
      {
        type: 'javascript/auto',
        test: /\.json$/,
        include: [
          path.resolve(__dirname, '../src/data/i18n/locales'),
        ],
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: '/i18n/messages/',
        },
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
                  require('../src/utils/matches-prefixer.js'),
                  require('postcss-pseudo-class-any-link'),
                  require('postcss-initial')(),
                  require('postcss-prepend-selector')({ selector: '#root.SFE ' }),
                  require('postcss-strip-font-face'),
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
        // Font-Awesome is already loaded and available in Studio
        test: /\.(woff2?|ttf|svg|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: ['raw-loader', 'ignore-loader'],
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'common',
          chunks: 'initial',
          minChunks: 2,
        },
      },
    },
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].min.css',
      allChunks: true,
    }),
    new OptimizeCssAssetsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ],
});
