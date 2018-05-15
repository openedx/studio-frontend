import { Button } from '@edx/paragon';
import React from 'react';

import AssetsClearSearchButton from './index';
import { courseDetails } from '../../utils/testConstants';
import messages from './displayMessages';
import { shallowWithIntl } from '../../utils/i18n/enzymeHelper';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';

const defaultProps = {
  clearSearch: () => {},
  courseDetails,
};

let wrapper;

describe('<AssetsClearSearchButton />', () => {
  describe('renders', () => {
    beforeEach(() => {
      wrapper = shallowWithIntl(
        <AssetsClearSearchButton
          {...defaultProps}
        />,
      );
    });
    it('renders a button with label', () => {
      const button = wrapper.find(Button);
      expect(button).toHaveLength(1);

      const label = button.dive().find(WrappedMessage).dive();
      expect(label.prop('message')).toEqual(messages.assetsClearSearchButtonLabel);
    });
    it('emits clearSearch action on click', () => {
      const clearSearchMock = jest.fn();

      wrapper.setProps({ clearSearch: clearSearchMock });

      const button = wrapper.find(Button);
      button.simulate('click');

      expect(clearSearchMock).toHaveBeenCalledTimes(1);
    });
  });
});
