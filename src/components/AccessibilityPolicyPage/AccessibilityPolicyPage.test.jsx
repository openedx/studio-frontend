import React from 'react';
import Enzyme from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import AccessibilityPolicyPage from './index';

const mount = Enzyme.mount;

const defaultProps = {
  communityAccessibilityLink: 'http://www.testLink.com',
  email: 'test@example.com',
  phoneNumber: '555-555-5555',
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
      wrapper = mount(
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
