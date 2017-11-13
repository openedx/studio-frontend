import React from 'react';
import PropTypes from 'prop-types';
import CheckBox from '@edx/paragon/src/CheckBox';
import { connect } from 'react-redux';

import { filterUpdate } from '../../data/actions/assets';
import styles from './AssetsFilters.scss';

const ASSET_TYPES = [
  {
    key: 'Audio',
    displayName: 'Audio',
  },
  {
    key: 'Code',
    displayName: 'Code',
  },
  {
    key: 'Documents',
    displayName: 'Documents',
  },
  {
    key: 'Images',
    displayName: 'Images',
  },
  {
    key: 'OTHER',
    displayName: 'Other',
  },
];

export const AssetsFilters = ({ assetsFilters, updateFilter }) => (
  <ul className={styles['filter-set']}>
    {ASSET_TYPES.map(type => (
      <li key={type.key}>
        <CheckBox
          name={type.key}
          label={type.displayName}
          checked={assetsFilters[type.key]}
          onChange={checked => updateFilter(type.key, checked)}
        />
      </li>
    ))}
  </ul>
);

AssetsFilters.propTypes = {
  assetsFilters: PropTypes.shape({
    assetTypes: PropTypes.object,
  }).isRequired,
  updateFilter: PropTypes.func.isRequired,
};

const WrappedAssetsFilters = connect(
  state => ({
    assetsFilters: state.metadata.filters,
  }), dispatch => ({
    updateFilter: (filterKey, filterValue) => dispatch(filterUpdate(filterKey, filterValue)),
  }),
)(AssetsFilters);

export default WrappedAssetsFilters;
