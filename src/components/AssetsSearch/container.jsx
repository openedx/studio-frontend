import { connect } from 'react-redux';

import AssetsSearch from '.';
import { searchUpdate } from '../../data/actions/assets';

const mapStateToProps = state => ({
  assetsSearch: state.metadata.search,
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
