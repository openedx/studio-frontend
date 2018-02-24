import { connect } from 'react-redux';

import AssetsTable from '.';
import { clearAssetsStatus, deleteAsset, sortUpdate, stageAssetDeletion, toggleLockAsset, unstageAssetDeletion } from '../../data/actions/assets';

const mapStateToProps = state => ({
  assetsList: state.assets,
  assetToDelete: state.metadata.deletion.assetToDelete,
  assetsSortMetadata: state.metadata.sort,
  assetsStatus: state.metadata.status,
  courseDetails: state.studioDetails.course,
  courseFilesDocs: state.studioDetails.help_tokens.files,
  upload: state.assets.upload,
  isImagePreviewEnabled: state.metadata.imagePreview.enabled,
});

const mapDispatchToProps = dispatch => ({
  clearAssetsStatus: () => dispatch(clearAssetsStatus()),
  deleteAsset: (asset, courseDetails) => dispatch(deleteAsset(asset, courseDetails)),
  stageAssetDeletion: (asset, index) => dispatch(stageAssetDeletion(asset, index)),
  toggleLockAsset: (asset, courseDetails) => dispatch(toggleLockAsset(asset, courseDetails)),
  updateSort: (sortKey, sortDirection, courseDetails) =>
    dispatch(sortUpdate(sortKey, sortDirection, courseDetails)),
  unstageAssetDeletion: () => dispatch(unstageAssetDeletion()),
});

const WrappedAssetsTable = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssetsTable);

export default WrappedAssetsTable;
