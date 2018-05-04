import { connect } from 'react-redux';

import EditImageModal from '.';
import { clearAssetsStatus, clearSelectedAsset, getAssets, pageUpdate, selectAsset } from '../../data/actions/assets';


const mapStateToProps = state => ({
  assetsStatus: state.metadata.status,
  assetsList: state.assets,
  courseDetails: state.studioDetails.course,
  courseImageAccessibilityDocs: state.studioDetails.help_tokens.image_accessibility,
  selectedAsset: state.metadata.select.selectedAsset,
});

const mapDispatchToProps = dispatch => ({
  clearAssetsStatus: () => dispatch(clearAssetsStatus()),
  clearSelectedAsset: () => dispatch(clearSelectedAsset()),
  getAssets: (request, courseDetails) => dispatch(getAssets(request, courseDetails)),
  selectAsset: (asset, index) => dispatch(selectAsset(asset, index)),
  updatePage: (page, courseDetails) => dispatch(pageUpdate(page, courseDetails)),
});

const WrappedEditImageModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditImageModal);

export default WrappedEditImageModal;
