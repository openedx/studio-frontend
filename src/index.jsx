import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { addLocaleData, IntlProvider } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';

import AssetsPage from './AssetsPage';
import BackendStatusBanner from './BackendStatusBanner';
import store from './data/store';

// en is hardcoded in right now, eventually this will be a dynamic locale
addLocaleData(enLocaleData);

const App = () => (
  <IntlProvider locale="en">
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
