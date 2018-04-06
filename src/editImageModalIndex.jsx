/* eslint-disable global-require,no-underscore-dangle */
if ((typeof window !== 'undefined' && !window._babelPolyfill) ||
  (typeof global !== 'undefined' && !global._babelPolyfill)) {
  // Don't load babel-polyfill if already loaded: https://github.com/babel/babel/issues/4019
  require('babel-polyfill'); // general ES2015 polyfill (e.g. promise)
}
/* eslint-enable global-require no-underscore-dangle */

/* eslint-disable import/first */
import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import 'custom-event-polyfill'; // needed for IE11

import EditImageModal from './components/EditImageModal';
import './SFE.scss';
import loadI18nDomData from './utils/i18n/loadI18nDomData';
/* eslint-enable import/first */

const i18nData = loadI18nDomData();
/* eslint-enable import/first */

const App = () => (
  <IntlProvider locale={i18nData.locale} messages={i18nData.messages}>
    <div className="SFE-wrapper">
      <EditImageModal />
    </div>
  </IntlProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
