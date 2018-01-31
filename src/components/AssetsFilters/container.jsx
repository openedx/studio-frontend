import { connect } from 'react-redux';

import AssetsFilters from '.';
import { filterUpdate } from '../../data/actions/assets';

const mapStateToProps = state => ({
  assetsFilters: state.metadata.filters,
  courseDetails: state.studioDetails.course,
});

const mapDispatchToProps = dispatch => ({
  updateFilter: (filterKey, filterValue, courseDetails) =>
    dispatch(filterUpdate(filterKey, filterValue, courseDetails)),
});

const WrappedAssetsFilters = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssetsFilters);

export default WrappedAssetsFilters;
