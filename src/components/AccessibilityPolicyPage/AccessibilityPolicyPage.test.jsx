import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import AccessibilityPolicyPage from './index';
import { mountWithIntl } from '../../utils/i18n/enzymeHelper';


const defaultProps = {
  communityAccessibilityLink: 'http://www.testLink.com',
  email: 'test@example.com',
};
const initialState = {
  accessibility: {
    status: {},
  },
};
const mockStore = configureStore();
let store;

let wrapper;

describe('<AccessibilityPolicyPage />', () => {
  describe('renders', () => {
    beforeEach(() => {
      store = mockStore(initialState);
      wrapper = mountWithIntl(
        <Provider store={store}>
          <AccessibilityPolicyPage
            {...defaultProps}
          />
        </Provider>,
      );
    });
    it('contains the policy body', () => { // this will change
      expect(wrapper.text()).toContain('Individualized Accessibility Process for Course Creators');
    });
  });
});
