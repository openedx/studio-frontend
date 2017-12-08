import 'babel-polyfill'; // general ES2015 polyfill (e.g. promise)
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import AccessibilityPolicyPage from './components/AccessibilityPolicyPage';
import store from './data/store';

const AccessibilityApp = () => (
  <Provider store={store}>
    <div>
      <AccessibilityPolicyPage
        communityAccessibilityLink="https://www.edx.org/accessibility"
        phoneNumber="+1 617-258-6577"
        email="accessibility@edx.org"
      />
    </div>
  </Provider>
);

ReactDOM.render(<AccessibilityApp />, document.getElementById('root'));
