import React from 'react';
import { SearchField } from '@edx/paragon';

import AssetsSearch from './index';
import { searchInitial } from './../../data/reducers/assets';
import { mountWithIntl } from '../../utils/i18n/enzymeHelper';

const defaultProps = {
  assetsSearch: { ...searchInitial },
  updateSearch: () => {},
  courseDetails: {},
};


describe('<AssetsSearch />', () => {
  describe('renders', () => {
    let wrapper,
        searchField;
    beforeEach(() => {
      wrapper = mountWithIntl(
        <AssetsSearch
          {...defaultProps}
        />,
      );
      searchField = wrapper.find(SearchField);
    });
    it('has a paragon SearchField', () => {
      expect(searchField).toHaveLength(1);
    });
    it('handles onChange callback correctly', () => {
      searchField.prop('onChange')('edX');
      expect(wrapper.state('value')).toEqual('edX');
    });
    it('calls updateSearch when submit button is clicked', () => {
      const searchSpy = jest.fn();

      wrapper.setProps({
        updateSearch: searchSpy,
      });

      searchField.prop('onChange')('edX');
      searchField.prop('onSubmit')();

      expect(searchSpy).toHaveBeenCalledTimes(1);
      expect(searchSpy).toHaveBeenCalledWith('edX', defaultProps.courseDetails);
    });
    it('updates search input text when search redux state is updated', () => {
      wrapper.setProps({ assetsSearch: { search: 'foobar' } }, () => {
        searchField = wrapper.find(SearchField);
        expect(wrapper.state('value')).toEqual('foobar');
        expect(searchField.prop('value')).toEqual('foobar');
      });
    });
  });
});
