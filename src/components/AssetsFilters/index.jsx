import React from 'react';
import PropTypes from 'prop-types';
import { CheckBox, CheckBoxGroup } from '@edx/paragon';

import ASSET_TYPES from '../../data/constants/assetTypeFilters';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';
import styles from './AssetsFilters.scss';
import messages from './displayMessages';

const AssetsFilters = ({ assetsFilters, updateFilter, courseDetails }) => (
  <div role="group" aria-labelledby="filter-label">
    <WrappedMessage message={messages.assetsFiltersSectionLabel}>
      {
        displayText =>
          <h4 id="filter-label" className={styles['filter-heading']} data-identifier="asset-filters-header">{displayText}</h4>
      }
    </WrappedMessage>
    <div className={styles['filter-set']} data-identifier="asset-filters">
      <CheckBoxGroup>
        {ASSET_TYPES.map(type => (
          <CheckBox
            key={type.key}
            id={type.key}
            name={type.key}
            label={<WrappedMessage message={messages[`assetsFilters${type.displayName}`]} />}
            checked={assetsFilters.assetTypes[type.key]}
            onChange={(checked) => { updateFilter(type.key, checked, courseDetails); }}
          />
        ))}
      </CheckBoxGroup>
    </div>
  </div>
);

AssetsFilters.propTypes = {
  assetsFilters: PropTypes.shape({
    assetTypes: PropTypes.object,
  }).isRequired,
  courseDetails: PropTypes.shape({
    lang: PropTypes.string,
    url_name: PropTypes.string,
    name: PropTypes.string,
    display_course_number: PropTypes.string,
    num: PropTypes.string,
    org: PropTypes.string,
    id: PropTypes.string,
    revision: PropTypes.string,
    base_url: PropTypes.string,
  }).isRequired,
  updateFilter: PropTypes.func.isRequired,
};

export default AssetsFilters;
