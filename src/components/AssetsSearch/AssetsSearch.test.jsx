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
    let wrapper;
    let searchField;
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
    describe('how updateSearch is called', () => {
      let searchSpy;

      beforeEach(() => {
        searchSpy = jest.fn();

        wrapper.setProps({
          updateSearch: searchSpy,
        });
        searchField.prop('onChange')('edX');
        searchField.prop('onSubmit')();
      });

      it('calls updateSearch when submit button is clicked', () => {
        expect(searchSpy).toHaveBeenCalledTimes(1);
        expect(searchSpy).toHaveBeenCalledWith('edX', defaultProps.courseDetails);
      });
      it('calls updateSearch when clear button is clicked', () => {
        searchField.prop('onClear')();
        expect(searchSpy).toHaveBeenCalledTimes(2);
        expect(searchSpy).toHaveBeenLastCalledWith('', defaultProps.courseDetails);
      });
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
