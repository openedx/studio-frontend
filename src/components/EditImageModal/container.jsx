import { connect } from 'react-redux';

import EditImageModal from '.';

const mapStateToProps = state => ({
  courseImageAccessibilityDocs: state.studioDetails.help_tokens.image_accessibility,
});

const mapDispatchToProps = () => ({});

const WrappedEditImageModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditImageModal);

export default WrappedEditImageModal;
