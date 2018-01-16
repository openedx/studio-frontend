import 'babel-polyfill'; // general ES2015 polyfill (e.g. promise)
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import AssetsPage from './components/AssetsPage';
import BackendStatusBanner from './components/BackendStatusBanner';
import store from './data/store';

const App = () => (
  <Provider store={store}>
    <div>
      <BackendStatusBanner />
      <AssetsPage />
    </div>
  </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));
