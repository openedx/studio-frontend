import React from 'react';
import { CheckBoxGroup } from '@edx/paragon';

import AssetsFilters from './index';
import { filtersInitial } from './../../data/reducers/assets';
import { mountWithIntl } from '../../utils/i18n/enzymeHelper';

const defaultProps = {
  assetsFilters: { ...filtersInitial },
  updateFilter: () => {},
  courseDetails: {},
};

let wrapper;

describe('<AssetsFilters />', () => {
  describe('renders', () => {
    beforeEach(() => {
      wrapper = mountWithIntl(
        <AssetsFilters
          {...defaultProps}
        />,
      );
    });
    it('correct number of filters', () => {
      const checkBoxGroup = wrapper.find(CheckBoxGroup);

      expect(checkBoxGroup).toHaveLength(1);
      expect(checkBoxGroup.find('[type="checkbox"]')).toHaveLength(5);
    });
    it('correct styling', () => {
      expect(wrapper.find('h4')).toHaveLength(1);
      expect(wrapper.find('h4').hasClass('filter-heading')).toEqual(true);
      expect(wrapper.find('div').at(1).hasClass('filter-set')).toEqual(true);
    });
    it('handles onChange callback correctly', () => {
      const checkBoxGroup = wrapper.find(CheckBoxGroup);
      let checkBoxes = checkBoxGroup.find('[type="checkbox"]');

      checkBoxes.first().simulate('change', { target: { checked: true, type: 'checkbox' } });
      checkBoxes = checkBoxGroup.find('[type="checkbox"]');
      expect(checkBoxes.first().html()).toContain('checked');
    });
    it('calls updateFilter when filter box is checked', () => {
      const filterSpy = jest.fn();

      wrapper.setProps({
        updateFilter: filterSpy,
      });

      const checkBoxGroup = wrapper.find(CheckBoxGroup);
      const checkBoxes = checkBoxGroup.find('[type="checkbox"]');
      const checkBox = checkBoxes.first();
      checkBox.simulate('change', { target: { checked: true, type: 'checkbox' } });

      expect(filterSpy).toHaveBeenCalledTimes(1);
      expect(filterSpy).toHaveBeenCalledWith(checkBox.prop('id'), true, defaultProps.courseDetails);
    });
  });
});
