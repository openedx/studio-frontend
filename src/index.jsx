import 'babel-polyfill'; // general ES2015 polyfill (e.g. promise)
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { addLocaleData, IntlProvider } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';

import WrappedAssetsPage from './components/AssetsPage';
import BackendStatusBanner from './components/BackendStatusBanner';
import store from './data/store';

addLocaleData(enLocaleData);

// TODO: make these values dynamic and correct
const locale = 'en';
const messages = {};

const App = () => (
  <IntlProvider locale={locale} messages={messages}>
    <Provider store={store}>
      <div className="SFE-wrapper">
        <BackendStatusBanner />
        <WrappedAssetsPage />
      </div>
    </Provider>
  </IntlProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
