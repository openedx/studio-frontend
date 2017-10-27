import 'babel-polyfill';  // general ES2015 polyfill (e.g. promise)
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import AssetsPage from './AssetsPage';
import BackendStatusBanner from './BackendStatusBanner';
import store from './data/store';

const App = () => (
  <Provider store={store}>
    <div>
      <BackendStatusBanner />
      <h1>studio-frontend</h1>
      <AssetsPage />
    </div>
  </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));
