/* eslint-disable global-require,no-underscore-dangle */
if ((typeof window !== 'undefined' && !window._babelPolyfill) ||
   (typeof global !== 'undefined' && !global._babelPolyfill)) {
  // Don't load babel-polyfill if already loaded: https://github.com/babel/babel/issues/4019
  require('babel-polyfill'); // general ES2015 polyfill (e.g. promise)
}
/* eslint-enable global-require no-underscore-dangle */

/* eslint-disable import/first */
import './SFE.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { addLocaleData, IntlProvider } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';

import WrappedCourseOutlineStatus from './components/CourseOutlineStatus/container';
import store from './data/store';
/* eslint-enable import/first */

const locale = 'en';
const messages = {};
addLocaleData(enLocaleData);

const CourseHealthCheckApp = () => (
  <IntlProvider locale={locale} messages={messages}>
    <Provider store={store}>
      <div className="SFE-wrapper">
        <WrappedCourseOutlineStatus />
      </div>
    </Provider>
  </IntlProvider>
);

ReactDOM.render(<CourseHealthCheckApp />, document.getElementById('root'));
