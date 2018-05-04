import { connect } from 'react-redux';

import AssetsClearSearchButton from '.';
import { searchUpdate } from '../../data/actions/assets';

const mapStateToProps = state => ({
  courseDetails: state.studioDetails.course,
});

const mapDispatchToProps = dispatch => ({
  clearSearch: courseDetails => dispatch(searchUpdate('', courseDetails)),
});

const WrappedAssetsClearSearchButton = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssetsClearSearchButton);

export default WrappedAssetsClearSearchButton;
