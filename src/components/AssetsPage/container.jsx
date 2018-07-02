import { connect } from 'react-redux';

import AssetsPage from '.';
import { clearAssetDeletion, getAssets, searchUpdate } from '../../data/actions/assets';


const mapStateToProps = state => ({
  assetsList: state.assets,
  assetsSearch: state.metadata.search,
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
  clearSearch: courseDetails =>
    dispatch(searchUpdate('', courseDetails)),
  getAssets: (request, courseDetails) => dispatch(getAssets(request, courseDetails)),
  updateSearch: (searchValue, courseDetails) =>
    dispatch(searchUpdate(searchValue, courseDetails)),
});

const WrappedAssetsPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssetsPage);

export default WrappedAssetsPage;
