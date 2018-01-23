import React from 'react';
import PropTypes from 'prop-types';
import CheckBoxGroup from '@edx/paragon/src/CheckBoxGroup';
import CheckBox from '@edx/paragon/src/CheckBox';
import { connect } from 'react-redux';

import { filterUpdate, pageUpdate } from '../../data/actions/assets';
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

export const AssetsFilters = ({ assetsFilters, updateFilter, updatePage }) => (
  <div role="group" aria-labelledby="filter-label">
    <h4 id="filter-label" className={styles['filter-heading']}>Filter by File Type</h4>
    <div className={styles['filter-set']}>
      <CheckBoxGroup>
        {ASSET_TYPES.map(type => (
          <CheckBox
            key={type.key}
            id={type.key}
            name={type.key}
            label={type.displayName}
            checked={assetsFilters[type.key]}
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
