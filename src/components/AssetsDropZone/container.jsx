import { connect } from 'react-redux';

import AssetsDropZone from '.';
import { uploadAssets, uploadExceedMaxSize, uploadExceedMaxCount, uploadInvalidFileType } from '../../data/actions/assets';


const mapStateToProps = state => ({
  courseDetails: state.studioDetails.course,
});

const mapDispatchToProps = dispatch => ({
  uploadAssets: (files, courseDetails) => dispatch(uploadAssets(files, courseDetails)),
  uploadExceedMaxCount: maxFileCount => dispatch(uploadExceedMaxCount(maxFileCount)),
  uploadExceedMaxSize: maxFileSizeMB => dispatch(uploadExceedMaxSize(maxFileSizeMB)),
  uploadInvalidFileType: () => dispatch(uploadInvalidFileType()),
});

const WrappedAssetsDropZone = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssetsDropZone);

export default WrappedAssetsDropZone;
