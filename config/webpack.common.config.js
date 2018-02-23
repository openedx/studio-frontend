'use strict';

const path = require('path');

module.exports = {
  entry: {
    assets: path.resolve(__dirname, '../src/index.jsx'),
    accessibilityPolicy: path.resolve(__dirname, '../src/accessibilityIndex.jsx'),
    arLangData: path.resolve(__dirname, '../src/data/i18n/locales/lang_scripts/ar.jsx'),
    esLangData: path.resolve(__dirname, '../src/data/i18n/locales/lang_scripts/es.jsx'),
    frLangData: path.resolve(__dirname, '../src/data/i18n/locales/lang_scripts/fr.jsx'),
    zhLangData: path.resolve(__dirname, '../src/data/i18n/locales/lang_scripts/zh.jsx'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
