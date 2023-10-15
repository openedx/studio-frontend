import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Variant } from '@edx/paragon';

import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';
import messages from './displayMessages';

const defaultState = {
  modalOpen: false,
};
const modalWrapperID = 'modalWrapper';

export default class AssetsUploadConfirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
  }

  componentWillReceiveProps(nextProps) {
    const { preUploadError } = nextProps;
    this.updateAlertOpenState(preUploadError);
  }

  updateAlertOpenState = (preUploadError) => {
    this.setState({
      modalOpen: preUploadError.length !== 0,
    });
  };

  uploadFiles = () => {
    this.props.uploadAssets(this.props.files, this.props.courseDetails);
  };

  onClose = () => {
    this.setState(defaultState);
    this.props.clearPreUploadProps();
  };

  render() {
    const { uploadFiles } = this;
    const { modalOpen } = this.state;
    const { preUploadError } = this.props;
    const listOfFiles = (
      <ul>
        { preUploadError.sort().map(item => <li key={item}>{item}</li>) }
      </ul>
    );
    const content = (
      <WrappedMessage
        message={messages.assetsUploadConfirmMessage}
        values={{ listOfFiles }}
      />
    );
    const closeText = (
      <WrappedMessage message={messages.assetsUploadConfirmCancel} />
    );
    const button = (
      <Button
        buttonType="primary"
        label={<WrappedMessage message={messages.assetsUploadConfirmOverwrite} />}
        onClick={uploadFiles}
      />
    );

    return (
      <div id={modalWrapperID}>
        <Modal
          title={<WrappedMessage message={messages.assetsUploadConfirmTitle} />}
          open={modalOpen}
          body={content}
          buttons={[button]}
          onClose={this.onClose}
          closeText={closeText}
          variant={{ status: Variant.status.WARNING }}
          parentSelector={`#${modalWrapperID}`}
        />
      </div>
    );
  }
}

AssetsUploadConfirm.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  files: PropTypes.arrayOf(PropTypes.object),
  uploadAssets: PropTypes.func.isRequired,
  clearPreUploadProps: PropTypes.func.isRequired,
  courseDetails: PropTypes.shape({
    lang: PropTypes.string,
    url_name: PropTypes.string,
    name: PropTypes.string,
    display_course_number: PropTypes.string,
    num: PropTypes.string,
    org: PropTypes.string,
    id: PropTypes.string,
    revision: PropTypes.string,
  }).isRequired,
  preUploadError: PropTypes.arrayOf(PropTypes.string),
};

AssetsUploadConfirm.defaultProps = {
  files: [],
  preUploadError: [],
};
