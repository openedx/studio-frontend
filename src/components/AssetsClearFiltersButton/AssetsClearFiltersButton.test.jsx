import React from 'react';
import { Button } from '@edx/paragon';

import AssetsClearFiltersButton from './index';
import { courseDetails } from '../../utils/testConstants';
import { shallowWithIntl } from '../../utils/i18n/enzymeHelper';
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
      wrapper = shallowWithIntl(
        <AssetsClearFiltersButton
          {...defaultProps}
        />,
      );
    });
    it('renders a button with label', () => {
      const button = wrapper.find(Button);
      expect(button).toHaveLength(1);

      const label = button.dive().find(WrappedMessage).dive();
      expect(label.prop('message')).toEqual(messages.assetsClearFiltersButtonLabel);
    });
    it('emits clearFilters action on click', () => {
      const clearFiltersMock = jest.fn();

      wrapper.setProps({ clearFilters: clearFiltersMock });

      const button = wrapper.find(Button);
      button.simulate('click');

      expect(clearFiltersMock).toHaveBeenCalledTimes(1);
    });
    it('adds className prop value to button class attribute', () => {
      const className = 'foo';

      wrapper.setProps({ className });

      const button = wrapper.find(Button);
      expect(button.hasClass(className)).toEqual(true);
    });
  });
});
