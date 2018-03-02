import React from 'react';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';

import { Button } from '@edx/paragon';
import FontAwesomeStyles from 'font-awesome/css/font-awesome.min.css';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';
import messages from './displayMessages';
import styles from './AssetsDropZone.scss';

export default class AssetsDropZone extends React.Component {
  constructor() {
    super();
    this.dropzoneRef = {};
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length + acceptedFiles.length > this.props.maxFileCount) {
      this.props.uploadExceedMaxCount(this.props.maxFileCount);
    } else if (rejectedFiles.length > 0) {
      this.props.uploadExceedMaxSize(this.props.maxFileSizeMB);
    } else {
      this.props.uploadAssets(acceptedFiles, this.props.courseDetails);
    }
  }

  setDropzonRef = (node) => {
    this.dropzoneRef = node;
  }

  handleClick = () => {
    this.dropzoneRef.open();
  }

  render() {
    return (
      <div>
        <Dropzone
          ref={this.setDropzonRef}
          onDrop={this.onDrop}
          className={styles['drop-zone']}
          activeClassName={styles['drop-active']}
          disableClick
          maxSize={this.props.maxFileSizeMB * 1000000}
          data-identifier="asset-drop-zone"
        >
          <p className={styles['upload-icon']} data-identifier="asset-drop-zone-icon">
            <span
              aria-hidden
              className={classNames(FontAwesomeStyles.fa, FontAwesomeStyles['fa-cloud-upload'])}
            />
          </p>
          <WrappedMessage message={messages.assetsDropZoneHeader}>
            { displayText => (
              <h2 data-identifier="asset-drop-zone-header">{displayText}</h2>
            )}
          </WrappedMessage>
          <div className={styles['center-text']}>
            <WrappedMessage message={messages.assetsDropZoneBrowseLabel} >
              { displayText => (
                <Button
                  className={['btn', 'btn-outline-primary']}
                  label={displayText}
                  onClick={this.handleClick}
                  data-identifier="asset-drop-zone-browse-button"
                />
              )}
            </WrappedMessage>
          </div>
          <WrappedMessage
            message={messages.assetsDropZoneMaxFileSizeLabel}
            values={{
              maxFileSizeMB: this.props.maxFileSizeMB,
            }}
          >
            { displayText => (
              <p data-identifier="asset-drop-zone-max-file-size-label">
                {displayText}
              </p>
            )}
          </WrappedMessage>
        </Dropzone>
      </div>
    );
  }
}

AssetsDropZone.propTypes = {
  uploadAssets: PropTypes.func.isRequired,
  uploadExceedMaxCount: PropTypes.func.isRequired,
  uploadExceedMaxSize: PropTypes.func.isRequired,
  maxFileCount: PropTypes.number,
  maxFileSizeMB: PropTypes.number,
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
};

AssetsDropZone.defaultProps = {
  maxFileCount: 1000,
  maxFileSizeMB: 10,
};
