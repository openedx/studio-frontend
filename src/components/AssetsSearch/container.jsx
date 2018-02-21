import { connect } from 'react-redux';

import AssetsSearch from '.';
import { searchUpdate } from '../../data/actions/assets';

const mapStateToProps = state => ({
  assetsFilters: state.metadata.filters,
  courseDetails: state.studioDetails.course,
});

const mapDispatchToProps = dispatch => ({
  updateSearch: (searchValue, courseDetails) =>
    dispatch(searchUpdate(searchValue, courseDetails)),
});

const WrappedAssetsSearch = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssetsSearch);

export default WrappedAssetsSearch;
