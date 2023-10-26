import { connect } from 'react-redux';

import { uploadAssets, clearUploadConfirmProps } from '../../data/actions/assets';
import AssetsUploadConfirm from '.';

const mapStateToProps = state => ({
  filesToUpload: state.metadata.filesToUpload,
  filenameConflicts: state.metadata.filenameConflicts,
  courseDetails: state.studioDetails.course,
});

const mapDispatchToProps = dispatch => ({
  uploadAssets: (assets, courseDetails) => dispatch(uploadAssets(assets, courseDetails)),
  clearUploadConfirmProps: () => dispatch(clearUploadConfirmProps()),
});

const WrappedAssetsUploadConfirm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssetsUploadConfirm);

export default WrappedAssetsUploadConfirm;
