import React from 'react';
import PropTypes from 'prop-types';
import { CheckBox, CheckBoxGroup } from '@edx/paragon';
import { connect } from 'react-redux';

import { filterUpdate, pageUpdate } from '../../data/actions/assets';
import ASSET_TYPES from '../../data/constants/assetTypeFilters';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';
import styles from './AssetsFilters.scss';
import messages from './displayMessages';

export const AssetsFilters = ({ assetsFilters, updateFilter, updatePage }) => (
  <div role="group" aria-labelledby="filter-label">
    <WrappedMessage message={messages.assetsFiltersSectionLabel}>
      {
        displayText =>
          <h4 id="filter-label" className={styles['filter-heading']}>{displayText}</h4>
      }
    </WrappedMessage>
    <div className={styles['filter-set']}>
      <CheckBoxGroup>
        {ASSET_TYPES.map(type => (
          <CheckBox
            key={type.key}
            id={type.key}
            name={type.key}
            label={<WrappedMessage message={messages[`assetsFilters${type.displayName}`]} />}
            checked={assetsFilters.assetTypes[type.key]}
            onChange={(checked) => { updatePage(0); updateFilter(type.key, checked); }}
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
  updateFilter: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  assetsFilters: state.metadata.filters,
});

export const mapDispatchToProps = dispatch => ({
  updateFilter: (filterKey, filterValue) => dispatch(filterUpdate(filterKey, filterValue)),
  updatePage: page => dispatch(pageUpdate(page)),
});

const WrappedAssetsFilters = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssetsFilters);

export default WrappedAssetsFilters;
