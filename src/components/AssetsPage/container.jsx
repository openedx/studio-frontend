import { connect } from 'react-redux';

import AssetsPage from '.';
import { clearAssetDeletion, getAssets } from '../../data/actions/assets';


const mapStateToProps = state => ({
  assetsList: state.assets,
  assetsStatus: state.metadata.status,
  assetToDelete: state.metadata.deletion.assetToDelete,
  courseDetails: state.studioDetails.course,
  deletedAsset: state.metadata.deletion.deletedAsset,
  deletedAssetIndex: state.metadata.deletion.deletedAssetIndex,
  filtersMetadata: state.metadata.filters,
  uploadSettings: state.studioDetails.upload_settings,
  searchMetadata: state.metadata.search,
  status: state.metadata.status,
});

const mapDispatchToProps = dispatch => ({
  clearAssetDeletion: () => dispatch(clearAssetDeletion()),
  getAssets: (request, courseDetails) => dispatch(getAssets(request, courseDetails)),
});

const WrappedAssetsPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssetsPage);

export default WrappedAssetsPage;
