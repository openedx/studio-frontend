import { connect } from 'react-redux';

import EditImageModal from '.';
import { clearSelectedAsset, getAssets, pageUpdate } from '../../data/actions/assets';


const mapStateToProps = state => ({
  assetsList: state.assets,
  courseDetails: state.studioDetails.course,
  courseImageAccessibilityDocs: state.studioDetails.help_tokens.image_accessibility,
  selectedAsset: state.metadata.select.selectedAsset,
});

const mapDispatchToProps = dispatch => ({
  clearSelectedAsset: () => dispatch(clearSelectedAsset()),
  getAssets: (request, courseDetails) => dispatch(getAssets(request, courseDetails)),
  updatePage: (page, courseDetails) => dispatch(pageUpdate(page, courseDetails)),
});

const WrappedEditImageModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditImageModal);

export default WrappedEditImageModal;
