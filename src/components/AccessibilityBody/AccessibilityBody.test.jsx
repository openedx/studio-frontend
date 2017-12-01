import React from 'react';
import Enzyme from 'enzyme';
import AccessibilityBody from './index';

const mount = Enzyme.mount;

let wrapper;

describe('<AccessibilityBody />', () => {
  describe('renders', () => {
    beforeEach(() => {
      wrapper = mount(
        <AccessibilityBody
          communityAccessibilityLink="http://example.com"
          phoneNumber="555-555-5555"
          email="example@example.com"
        />,
      );
    });
    it('contains links', () => {
      expect(wrapper.text()).toContain('example@example.com');
      expect(wrapper.text()).toContain('555-555-5555');
    });
  });
});
