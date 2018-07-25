import React from 'react';

import CourseOutlineStatusValue from './';
import { shallowWithIntl } from '../../utils/i18n/enzymeHelper';

let wrapper;

describe('CourseOutlineStatusValue', () => {
  describe('renders', () => {
    it('a div with correct props', () => {
      wrapper = shallowWithIntl(<CourseOutlineStatusValue />);

      const div = wrapper.find('div');
      expect(div).toHaveLength(1);
      expect(div.prop('className')).toEqual(expect.stringContaining('d-block'));
      expect(div.prop('className')).toEqual(expect.stringContaining('status-value'));
    });

    it('a div with children prop', () => {
      const children = (<span>Test</span>);

      wrapper = shallowWithIntl(
        <CourseOutlineStatusValue>
          {children}
        </CourseOutlineStatusValue>,
      );

      const div = wrapper.find('div');
      expect(div.containsMatchingElement(children)).toEqual(true);
    });
  });
});
