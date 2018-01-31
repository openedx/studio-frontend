import { connect } from 'react-redux';

import AssetsTable from '.';
import { clearAssetsStatus, deleteAsset, sortUpdate, toggleLockAsset } from '../../data/actions/assets';

const mapStateToProps = state => ({
  assetsList: state.assets,
  assetsSortMetaData: state.metadata.sort,
  assetsStatus: state.metadata.status,
  courseDetails: state.studioDetails.course,
  courseFilesDocs: state.studioDetails.help_tokens.files,
  upload: state.assets.upload,
});

const mapDispatchToProps = dispatch => ({
  clearAssetsStatus: () => dispatch(clearAssetsStatus()),
  deleteAsset: (assetId, courseDetails) => dispatch(deleteAsset(assetId, courseDetails)),
  updateSort: (sortKey, sortDirection, courseDetails) =>
    dispatch(sortUpdate(sortKey, sortDirection, courseDetails)),
  toggleLockAsset: (asset, courseDetails) => dispatch(toggleLockAsset(asset, courseDetails)),
});

const WrappedAssetsTable = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssetsTable);

export default WrappedAssetsTable;
