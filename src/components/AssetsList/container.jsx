import { connect } from 'react-redux';

import AssetsList from '.';
import { selectAsset } from '../../data/actions/assets';

const mapStateToProps = state => ({
  assetsList: state.assets,
  courseDetails: state.studioDetails.course,
  courseImageAccessibilityDocs: state.studioDetails.help_tokens.image_accessibility,
  paginationMetadata: state.metadata.pagination,
  selectedAsset: state.metadata.select.selectedAsset,
  selectedAssetIndex: state.metadata.select.selectedAssetIndex,
});

const mapDispatchToProps = dispatch => ({
  selectAsset: (asset, index) => dispatch(selectAsset(asset, index)),
});

const WrappedAssetsList = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssetsList);

export default WrappedAssetsList;
