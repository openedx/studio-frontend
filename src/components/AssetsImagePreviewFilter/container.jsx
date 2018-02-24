import { connect } from 'react-redux';

import AssetsImagePreviewFilter from '.';
import { updateImagePreview } from '../../data/actions/assets';

const mapStateToProps = state => ({
  isImagePreviewEnabled: state.metadata.imagePreview.enabled,
});

const mapDispatchToProps = dispatch => ({
  updateImagePreview: checked =>
    dispatch(updateImagePreview(checked)),
});

const WrappedAssetsImagePreviewFilter = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssetsImagePreviewFilter);

export default WrappedAssetsImagePreviewFilter;
