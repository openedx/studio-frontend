import React from 'react';

import CourseOutlineStatusLabel from './';
import { shallowWithIntl } from '../../utils/i18n/enzymeHelper';

let wrapper;

describe('CourseOutlineStatusLabel', () => {
  describe('renders', () => {
    it('a header with correct props', () => {
      wrapper = shallowWithIntl(<CourseOutlineStatusLabel />);

      const header = wrapper.find('h2');
      expect(header).toHaveLength(1);
      expect(header.prop('className')).toEqual(expect.stringContaining('mb-2'));
      expect(header.prop('className')).toEqual(expect.stringContaining('status-label'));
    });

    it('a header with children prop', () => {
      const children = (<span>Test</span>);

      wrapper = shallowWithIntl(
        <CourseOutlineStatusLabel>
          {children}
        </CourseOutlineStatusLabel>,
      );

      const header = wrapper.find('h2');
      expect(header.containsMatchingElement(children)).toEqual(true);
    });
  });
});
