import React from 'react';
import PropTypes from 'prop-types';
import CheckBox from 'paragon/src/CheckBox';
import { connect } from 'react-redux';

import { filterUpdate } from '../../data/actions/assets';
import styles from './styles.scss';

const AssetsFilters = ({ assetTypes, assetsFilters, updateFilter }) => (
  <ul className={styles['filter-set']}>
    {assetTypes.map(type => (
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
  assetTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
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
