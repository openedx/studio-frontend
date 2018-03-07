import React from 'react';
import { Button } from '@edx/paragon';

import AssetsClearFiltersButton from './index';
import courseDetails from '../../utils/testConstants';
import { mountWithIntl } from '../../utils/i18n/enzymeHelper';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';
import messages from './displayMessages';

const defaultProps = {
  clearFilters: () => {},
  courseDetails,
};

let wrapper;

describe('<AssetsClearFiltersButton />', () => {
  describe('renders', () => {
    beforeEach(() => {
      wrapper = mountWithIntl(
        <AssetsClearFiltersButton
          {...defaultProps}
        />,
      );
    });
    it('renders a button with label', () => {
      const button = wrapper.find(Button);
      expect(button).toHaveLength(1);

      const label = button.find(WrappedMessage);
      expect(label.prop('message')).toEqual(messages.assetsClearFiltersButtonLabel);
    });
    it('emits clearFilters action on click', () => {
      const clearFiltersMock = jest.fn();

      wrapper = mountWithIntl(
        <AssetsClearFiltersButton
          {...defaultProps}
          clearFilters={clearFiltersMock}
        />,
      );

      const button = wrapper.find(Button);
      button.simulate('click');

      expect(clearFiltersMock).toHaveBeenCalledTimes(1);
    });
  });
});
