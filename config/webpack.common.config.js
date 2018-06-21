'use strict';

const path = require('path');

module.exports = {
  entry: {
    assets: path.resolve(__dirname, '../src/index.jsx'),
    accessibilityPolicy: path.resolve(__dirname, '../src/accessibilityIndex.jsx'),
    editImageModal: path.resolve(__dirname, '../src/editImageModalIndex.jsx'),
    courseHealthCheck: path.resolve(__dirname, '../src/courseHealthCheckIndex.jsx'),
    courseOutlineHealthCheck: path.resolve(__dirname, '../src/courseOutlineHealthCheckIndex.jsx'),
    i18nMessages: path.resolve(__dirname, '../src/data/i18n/locales/currentlySupportedLangs.jsx'),
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
