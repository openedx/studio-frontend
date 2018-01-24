import React from 'react';
import Enzyme from 'enzyme';
import { AssetsFilters, mapDispatchToProps } from './index';
import { assetActions } from '../../data/constants/actionTypes';

const mount = Enzyme.mount;

const defaultProps = {
  assetsFilters: {},
  updateFilter: () => {},
  updatePage: () => {},
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
    it('correctly maps updateFilter to dispatch props', () => {
      const dispatchSpy = jest.fn();

      const { updateFilter } = mapDispatchToProps(dispatchSpy);

      const updateFilterAction = {
        data: {
          Code: 'Code',
        },
        type: assetActions.filter.FILTER_UPDATED,
      };

      updateFilter('Code', 'Code');

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(updateFilterAction);
    });
    it('correctly maps updatePage to dispatch props', () => {
      const dispatchSpy = jest.fn();

      const { updatePage } = mapDispatchToProps(dispatchSpy);

      const updatePageAction = {
        data: {
          page: 0,
        },
        type: assetActions.paginate.PAGE_UPDATE,
      };

      updatePage(0);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(updatePageAction);
    });
    it('calls updatePage & updateFilter when filter box is checked', () => {
      const filterSpy = jest.fn();
      const pageUpdateSpy = jest.fn();

      wrapper.setProps({
        updateFilter: filterSpy,
        updatePage: pageUpdateSpy,
      });

      const checkBoxGroup = wrapper.find('CheckBoxGroup');
      const checkBoxes = checkBoxGroup.find('[type="checkbox"]');
      const checkBox = checkBoxes.first();
      checkBox.simulate('change', { target: { checked: true, type: 'checkbox' } });

      expect(pageUpdateSpy).toHaveBeenCalledTimes(1);
      expect(pageUpdateSpy).toHaveBeenCalledWith(0);
      expect(filterSpy).toHaveBeenCalledTimes(1);
      expect(filterSpy).toHaveBeenCalledWith(checkBox.prop('id'), true);
    });
  });
});
