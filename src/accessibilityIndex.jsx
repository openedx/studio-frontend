import 'babel-polyfill'; // general ES2015 polyfill (e.g. promise)
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { addLocaleData, IntlProvider } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';

import AccessibilityPolicyPage from './components/AccessibilityPolicyPage';
import store from './data/store';

addLocaleData(enLocaleData);

// hard-coded NON-defaults for testing. TODO: make these dynamic and correct
const locale = 'en';
const messages = {};

const AccessibilityApp = () => (
  <IntlProvider locale={locale} messages={messages}>
    <Provider store={store}>
      <div className="SFE-wrapper">
        <AccessibilityPolicyPage
          communityAccessibilityLink="https://www.edx.org/accessibility"
          phoneNumber="+1 617-258-6577"
          email="accessibility@edx.org"
        />
      </div>
    </Provider>
  </IntlProvider>
);

ReactDOM.render(<AccessibilityApp />, document.getElementById('root'));
