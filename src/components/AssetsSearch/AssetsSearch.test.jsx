import React from 'react';

import AssetsSearch from './index';
import { searchInitial } from './../../data/reducers/assets';
import { mountWithIntl } from '../../utils/i18n/enzymeHelper';

const defaultProps = {
  assetsSearch: { ...searchInitial },
  updateSearch: () => {},
  courseDetails: {},
};

let wrapper;

describe('<AssetsSearch />', () => {
  describe('renders', () => {
    beforeEach(() => {
      wrapper = mountWithIntl(
        <AssetsSearch
          {...defaultProps}
        />,
      );
    });
    it('has label, input, and button in a form element', () => {
      const searchForm = wrapper.find('form');

      expect(searchForm).toHaveLength(1);
      expect(searchForm.find('label')).toHaveLength(1);
      expect(searchForm.find('input[type="search"]')).toHaveLength(1);
      expect(searchForm.find('button[type="submit"]')).toHaveLength(1);
    });
    it('has correct styling', () => {
      const button = wrapper.find('form').find('button[type="submit"]');
      expect(wrapper.find('form').hasClass('form-group')).toEqual(true);
      expect(wrapper.find('form').hasClass('form-inline')).toEqual(true);
      expect(button.find('span.fa')).toHaveLength(1);
      expect(button.find('span.fa').hasClass('fa-search')).toEqual(true);
    });
    it('handles onChange callback correctly', () => {
      const searchInput = wrapper.find('form input[type="search"]');

      searchInput.simulate('change', { target: { value: 'edX' } });
      expect(wrapper.state('value')).toEqual('edX');
    });
    it('calls updateSearch when submit button is clicked', () => {
      const searchSpy = jest.fn();

      wrapper.setProps({
        updateSearch: searchSpy,
      });

      const submitButton = wrapper.find('form button[type="submit"]');
      const searchInput = wrapper.find('form input[type="search"]');
      searchInput.simulate('change', { target: { value: 'edX' } });
      submitButton.simulate('submit');

      expect(searchSpy).toHaveBeenCalledTimes(1);
      expect(searchSpy).toHaveBeenCalledWith('edX', defaultProps.courseDetails);
    });
  });
});
