/* eslint-disable global-require,no-underscore-dangle */
if ((typeof window !== 'undefined' && !window._babelPolyfill) ||
   (typeof global !== 'undefined' && !global._babelPolyfill)) {
  // Don't load babel-polyfill if already loaded: https://github.com/babel/babel/issues/4019
  require('@babel/polyfill'); // general ES2015 polyfill (e.g. promise)
}
/* eslint-enable global-require no-underscore-dangle */

/* eslint-disable import/first */
import './SFE.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { addLocaleData, IntlProvider } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';

import AccessibilityPolicyPage from './components/AccessibilityPolicyPage';
import store from './data/store';
/* eslint-enable import/first */


/* This page is deliberately *not* making use of src/utils/i18n/loadI18nDomData.jsx
 *
 * For legal purposes, we want to translate the entire page as a whole using some
 * yet-to-be-determined mechanism.
*/
const locale = 'en';
const messages = {};
addLocaleData(enLocaleData);

const AccessibilityApp = () => (
  <IntlProvider locale={locale} messages={messages}>
    <Provider store={store}>
      <div className="SFE-wrapper">
        <AccessibilityPolicyPage
          communityAccessibilityLink="https://www.edx.org/accessibility"
          email="accessibility@edx.org"
        />
      </div>
    </Provider>
  </IntlProvider>
);

ReactDOM.render(<AccessibilityApp />, document.getElementById('root'));
