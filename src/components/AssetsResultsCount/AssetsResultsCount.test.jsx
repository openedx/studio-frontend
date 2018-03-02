import React from 'react';

import AssetsResultsCount from './index';
import { paginationInitial, filtersInitial, searchInitial } from './../../data/reducers/assets';
import { mountWithIntl } from '../../utils/i18n/enzymeHelper';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';
import messages from './displayMessages';

const defaultProps = {
  paginationMetadata: { ...paginationInitial },
  filtersMetadata: { ...filtersInitial },
  searchMetadata: { ...searchInitial },
};

let wrapper;

describe('<AssetsResultsCount />', () => {
  describe('renders', () => {
    beforeEach(() => {
      wrapper = mountWithIntl(
        <AssetsResultsCount
          {...defaultProps}
        />,
      );
    });
    it('renders correct counts with one asset', () => {
      wrapper.setProps({
        paginationMetadata: {
          start: 0,
          end: 1,
          totalCount: 1,
        },
      });

      const message = wrapper.find(WrappedMessage);
      expect(message.prop('message')).toEqual(messages.assetsResultsCountTotal);

      const counts = wrapper.find('span.font-weight-bold');
      expect(counts.at(0).text()).toEqual('1');
      expect(counts.at(1).text()).toEqual('1');
      expect(counts.at(2).text()).toEqual('1');
    });
    it('renders correct counts with many assets', () => {
      wrapper.setProps({
        paginationMetadata: {
          start: 0,
          end: 50,
          totalCount: 1000,
        },
      });

      const message = wrapper.find(WrappedMessage);
      expect(message.prop('message')).toEqual(messages.assetsResultsCountTotal);

      const counts = wrapper.find('span.font-weight-bold');
      expect(counts.at(0).text()).toEqual('1');
      expect(counts.at(1).text()).toEqual('50');
      expect(counts.at(2).text()).toEqual('1,000');
    });
    it('renders correct counts with filters applied', () => {
      wrapper.setProps({
        paginationMetadata: {
          start: 0,
          end: 50,
          totalCount: 1000,
        },
        searchMetadata: {
          search: 'edX',
        },
      });

      const message = wrapper.find(WrappedMessage);
      expect(message.prop('message')).toEqual(messages.assetsResultsCountFiltered);

      const counts = wrapper.find('span.font-weight-bold');
      expect(counts.at(0).text()).toEqual('1');
      expect(counts.at(1).text()).toEqual('50');
      expect(counts.at(2).text()).toEqual('1,000');
    });
  });
});
