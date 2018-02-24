import React from 'react';

import AssetsImagePreviewFilter from './index';
import messages from './displayMessages';
import { mountWithIntl } from '../../utils/i18n/enzymeHelper';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';

const defaultProps = {
  isImagePreviewEnabled: true,
  updateImagePreview: () => {},
};

let wrapper;

describe('AssetsImagePreviewFilter', () => {
  describe('renders', () => {
    it('a checkBox', () => {
      wrapper = mountWithIntl(
        <AssetsImagePreviewFilter
          {...defaultProps}
        />,
      );
      expect(wrapper.find('[type="checkbox"]')).toHaveLength(1);
    });

    it('with correct label', () => {
      wrapper = mountWithIntl(
        <AssetsImagePreviewFilter
          {...defaultProps}
        />,
      );

      expect(wrapper.find(WrappedMessage).prop('message')).toEqual(messages.assetsImagePreviewFilterLabel);
    });
  });
  describe('behaves', () => {
    it('calls updateImagePreview prop on click', () => {
      const updateImagePreviewSpy = jest.fn();

      wrapper = mountWithIntl(
        <AssetsImagePreviewFilter
          {...defaultProps}
          updateImagePreview={updateImagePreviewSpy}
        />,
      );

      const checkBox = wrapper.find('[type="checkbox"]');

      checkBox.first().simulate('change', { target: { checked: true, type: 'checkbox' } });
      expect(updateImagePreviewSpy).toHaveBeenCalledTimes(1);
      expect(updateImagePreviewSpy).toHaveBeenCalledWith(false);
    });
  });
});
