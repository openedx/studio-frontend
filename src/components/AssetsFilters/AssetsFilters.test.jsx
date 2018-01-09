import React from 'react';
import Enzyme from 'enzyme';
import { AssetsFilters } from './index';

const mount = Enzyme.mount;

const defaultProps = {
  assetsFilters: {},
  updateFilter: () => {},
};

let wrapper;

describe('<AssetsFilters />', () => {
  describe('renders', () => {
    beforeEach(() => {
      wrapper = mount(
        <AssetsFilters
          {...defaultProps}
        />,
      );
    });
    it('correct number of filters', () => {
      const checkBoxGroup = wrapper.find('CheckBoxGroup');

      expect(checkBoxGroup).toHaveLength(1);
      expect(checkBoxGroup.find('[type="checkbox"]')).toHaveLength(5);
    });
    it('correct styling', () => {
      expect(wrapper.find('h4')).toHaveLength(1);
      expect(wrapper.find('h4').hasClass('filter-heading')).toEqual(true);
      expect(wrapper.find('div').at(1).hasClass('filter-set')).toEqual(true);
    });
    it('handles onChange callback correctly', () => {
      const checkBoxGroup = wrapper.find('CheckBoxGroup');
      let checkBoxes = checkBoxGroup.find('[type="checkbox"]');

      checkBoxes.first().simulate('change', { target: { checked: true, type: 'checkbox' } });
      checkBoxes = checkBoxGroup.find('[type="checkbox"]');
      expect(checkBoxes.first().html()).toContain('checked');
    });
  });
});
