import { Button } from '@edx/paragon';
import PropTypes from 'prop-types';
import React from 'react';

import messages from './displayMessages';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';


const AssetsClearSearchButton = ({ clearSearch, courseDetails }) => (
  <Button
    buttonType="link"
    onClick={() => clearSearch(courseDetails)}
    label={
      <WrappedMessage message={messages.assetsClearSearchButtonLabel} />
    }
  />
);

AssetsClearSearchButton.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  courseDetails: PropTypes.shape({
    lang: PropTypes.string,
    url_name: PropTypes.string,
    name: PropTypes.string,
    display_course_number: PropTypes.string,
    num: PropTypes.string,
    org: PropTypes.string,
    id: PropTypes.string,
    revision: PropTypes.string,
  }).isRequired,
};

export default AssetsClearSearchButton;
