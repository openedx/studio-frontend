import React from 'react';
import Enzyme from 'enzyme';
import { AccessibilityPolicyPage } from './index';

const mount = Enzyme.mount;

const defaultProps = {
  zendeskDetails: {
    zendeskTags: '',
    customFields: {
      course_id: 'course-v1:edX+DemoX+Demo_Course',
    },
    accessToken: 'accessToken',
  },
};

let wrapper;

describe('<AccessibilityPolicyPage />', () => {
  describe('renders', () => {
    beforeEach(() => {
      wrapper = mount(
        <AccessibilityPolicyPage
          {...defaultProps}
        />,
      );
    });
    it('contains the policy body', () => { // this will change
      expect(wrapper.text()).toContain('Studio Accessibility Policy');
    });
  });
});
