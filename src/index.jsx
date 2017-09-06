import React from 'react';
import ReactDOM from 'react-dom';

import AssetsPage from './AssetsPage';
import BackendStatusBanner from './BackendStatusBanner';

import displayStrings from './display_strings.json';

const App = () => (
  <div>
    <BackendStatusBanner />
    <h1>{displayStrings.header}</h1>
    <AssetsPage />
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));
