import React from 'react';
import PropTypes from 'prop-types';
import CheckBox from 'paragon/src/CheckBox';
import { connect } from 'react-redux';

import { filterUpdate } from '../../data/actions/assets';
import styles from './styles.scss';

const ASSET_TYPES = [
  {
    key: 'images',
    displayName: 'Images',
  },
  {
    key: 'documents',
    displayName: 'Documents',
  },
  {
    key: 'other',
    displayName: 'Other',
  },
];

const AssetsFilters = ({ assetsFilters, updateFilter }) => (
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
  assetsFilters: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  ).isRequired,
  updateFilter: PropTypes.func.isRequired,
};

const WrappedAssetsFilters = connect(
  state => ({
    assetsFilters: state.assetsFilters,
  }), dispatch => ({
    updateFilter: (filterKey, filterValue) => dispatch(filterUpdate(filterKey, filterValue)),
  }),
)(AssetsFilters);

export default WrappedAssetsFilters;
