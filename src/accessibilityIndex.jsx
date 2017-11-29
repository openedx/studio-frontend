import 'babel-polyfill'; // general ES2015 polyfill (e.g. promise)
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import WrappedAccessibilityPolicyPage from './components/AccessibilityPolicyPage';
import store from './data/store';

const AccessibilityApp = () => (
  <Provider store={store}>
    <div>
      <WrappedAccessibilityPolicyPage />
    </div>
  </Provider>
);

ReactDOM.render(<AccessibilityApp />, document.getElementById('root'));
