import React from 'react';
import ReactDOM from 'react-dom';

import AssetsPage from './AssetsPage';

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>I am a app</h1>
        <AssetsPage />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
