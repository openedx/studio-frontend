import React from 'react';
import PropTypes from 'prop-types';
import { CheckBox } from '@edx/paragon';

import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';
import messages from './displayMessages';

const AssetsImagePreviewFilter = ({ isImagePreviewEnabled, updateImagePreview }) => (
  <CheckBox
    id="imagePreviewCheckbox"
    name="imagePreviewCheckbox"
    label={<WrappedMessage message={messages.assetsImagePreviewFilterLabel} />}
    checked={!isImagePreviewEnabled}
    onChange={(checked) => { updateImagePreview(!checked); }}
  />
);

AssetsImagePreviewFilter.propTypes = {
  isImagePreviewEnabled: PropTypes.bool.isRequired,
  updateImagePreview: PropTypes.func.isRequired,
};

export default AssetsImagePreviewFilter;
