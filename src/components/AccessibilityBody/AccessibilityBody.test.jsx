import React from 'react';
import AccessibilityBody from './index';
import { mountWithIntl } from '../../utils/i18n/enzymeHelper';


let wrapper;

describe('<AccessibilityBody />', () => {
  describe('renders', () => {
    beforeEach(() => {
      wrapper = mountWithIntl(
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
      expect(wrapper.find({ href: 'http://example.com' })).toHaveLength(1);
    });
  });
});
