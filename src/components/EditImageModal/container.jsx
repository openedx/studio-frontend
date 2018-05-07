import { connect } from 'react-redux';

import EditImageModal from '.';
import {
  clearAssetsStatus,
  clearSelectedAsset,
  getAssets,
  pageUpdate,
  searchUpdate,
  selectAsset,
} from '../../data/actions/assets';


// Create an EditImageModal that is not aware of the Images filter.
// This is so that the page will display a "noAssets" list instead of a "noResults" list when the
// course has no images.
const mapStateToProps = (state) => {
  const { Images, ...typesWithoutImages } = state.metadata.filters.assetTypes;
  const filtersWithoutImages = { ...state.metadata.filters, assetTypes: typesWithoutImages };
  return {
    assetsList: state.assets,
    assetsStatus: state.metadata.status,
    courseDetails: state.studioDetails.course,
    courseImageAccessibilityDocs: state.studioDetails.help_tokens.image_accessibility,
    filtersMetadata: filtersWithoutImages,
    searchMetadata: state.metadata.search,
    selectedAsset: state.metadata.select.selectedAsset,
    status: state.metadata.status,
  };
};

const mapDispatchToProps = dispatch => ({
  clearAssetsStatus: () => dispatch(clearAssetsStatus()),
  clearSearch: courseDetails => dispatch(searchUpdate('', courseDetails)),
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
