import { connect } from 'react-redux';

import AssetsClearFiltersButton from '.';
import { clearFilters } from '../../data/actions/assets';

const mapStateToProps = state => ({
  courseDetails: state.studioDetails.course,
});

const mapDispatchToProps = dispatch => ({
  clearFilters: courseDetails => dispatch(clearFilters(courseDetails)),
});

const WrappedAssetsClearFiltersButton = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssetsClearFiltersButton);

export default WrappedAssetsClearFiltersButton;
