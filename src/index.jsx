import React from 'react';
import ReactDOM from 'react-dom';

import AssetsPage from './AssetsPage';

const App = () => (
  <div>
    <h1>I am a app</h1>
    <AssetsPage />
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));
