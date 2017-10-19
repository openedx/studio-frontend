import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { addLocaleData, IntlProvider } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';

import AssetsPage from './AssetsPage';
import BackendStatusBanner from './BackendStatusBanner';
import store from './data/store';

addLocaleData(enLocaleData);

const localeDataDiv = document.getElementById('studio-frontend-messages');
const locale = localeDataDiv.dataset.locale || 'en';
const messages = localeDataDiv.textContent || {};

const App = () => (
  <IntlProvider locale={locale} messages={messages}>
    <Provider store={store}>
      <div>
        <BackendStatusBanner />
        <h1>studio-frontend</h1>
        <AssetsPage />
      </div>
    </Provider>
  </IntlProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
