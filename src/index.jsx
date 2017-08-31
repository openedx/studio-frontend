import React from 'react';
import ReactDOM from 'react-dom';

import AssetsPage from './AssetsPage';
import BackendStatusBanner from './BackendStatusBanner';

const App = () => (
  <div>
    <BackendStatusBanner />
    <h1>I am a app</h1>
    <AssetsPage />
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));
