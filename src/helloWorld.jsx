// This file creates a new React app containing our HelloWorld component that we will insert
// straight into the DOM.

// This ugly bit of code is needed so that we only load babel-polyfill, in-case a Studio page
// already has it loaded.  Babel-polyfill will define a bunch of the newer JavaScript functions
// that we use in SFE so that our code can work in older browsers.
/* eslint-disable global-require,no-underscore-dangle */
if ((typeof window !== 'undefined' && !window._babelPolyfill) ||
   (typeof global !== 'undefined' && !global._babelPolyfill)) {
  // Don't load babel-polyfill if already loaded: https://github.com/babel/babel/issues/4019
  require('babel-polyfill'); // general ES2015 polyfill (e.g. promise)
}
/* eslint-enable global-require no-underscore-dangle */

/* eslint-disable import/first */
import './SFE.scss'; // our global styles for all SFE pages/components (includes Bootstrap)
import React from 'react';
import ReactDOM from 'react-dom';
import { addLocaleData, IntlProvider } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';

import HelloWorld from './components/HelloWorld';
/* eslint-enable import/first */

// Set-up internationalization, with the default being 'en'
const locale = 'en';
const messages = {};
addLocaleData(enLocaleData);

// IntlProvider: provides translated messages to child components
const HelloWorldApp = () => (
  <IntlProvider locale={locale} messages={messages}>
    <div className="SFE-wrapper">
      <HelloWorld />
    </div>
  </IntlProvider>
);

// Renders our HelloWorldApp to a div on the page with the id "root"
ReactDOM.render(<HelloWorldApp />, document.getElementById('root'));
