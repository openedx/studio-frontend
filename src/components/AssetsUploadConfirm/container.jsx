import { connect } from 'react-redux';

import { uploadAssets, clearPreUploadProps } from '../../data/actions/assets';
import AssetsUploadConfirm from '.';

const mapStateToProps = state => ({
  files: state.metadata.files,
  preUploadError: state.metadata.preUploadError,
  courseDetails: state.studioDetails.course,
});

const mapDispatchToProps = dispatch => ({
  uploadAssets: (assets, courseDetails) => dispatch(uploadAssets(assets, courseDetails)),
  clearPreUploadProps: () => dispatch(clearPreUploadProps()),
});

const WrappedAssetsUploadConfirm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssetsUploadConfirm);

export default WrappedAssetsUploadConfirm;
