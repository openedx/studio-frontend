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
  constructor(props) {
    super();
    this.dropZoneRef = {};
    this.dropZoneMaxFileSizeBytes = props.maxFileSizeMB * 1000000;
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length + acceptedFiles.length > this.props.maxFileCount) {
      this.props.uploadExceedMaxCount(this.props.maxFileCount);
    } else if (rejectedFiles.length > 0) {
      // bubbling up error from the first rejected file in the list
      const rejectedFile = rejectedFiles[0];
      if (rejectedFile.size > this.dropZoneMaxFileSizeBytes) {
        this.props.uploadExceedMaxSize(this.dropZoneMaxFileSizeBytes);
      } else {
        this.props.uploadInvalidFileType();
      }
    } else {
      this.props.uploadAssets(acceptedFiles, this.props.courseDetails);
    }
  }

  setDropZoneRef = (ref) => {
    this.dropZoneRef = ref;
  }

  setUploadButtonRef = (ref) => {
    this.props.buttonRef(ref);
  }

  handleClick = () => {
    this.dropZoneRef.open();
  }

  render() {
    return (
      <WrappedMessage message={messages.assetsDropZoneAriaLabel}>
        { regionLabel =>
          (
            <div role="region" aria-label={regionLabel}>
              <Dropzone
                accept={this.props.acceptedFileTypes}
                activeClassName={styles['drop-active']}
                className={classNames([
                  this.props.compactStyle ? styles['drop-zone-compact'] : styles['drop-zone'],
                  styles['center-text'],
                ])}
                data-identifier="asset-drop-zone"
                disableClick
                maxSize={this.dropZoneMaxFileSizeBytes}
                onDrop={this.onDrop}
                ref={this.setDropZoneRef}
              >
                <div className={styles['center-text']} data-identifier="asset-drop-zone-icon">
                  <span
                    aria-hidden
                    className={classNames(
                      styles['center-text'],
                      FontAwesomeStyles.fa,
                      FontAwesomeStyles['fa-cloud-upload'],
                      FontAwesomeStyles['fa-3x'])}
                  />
                </div>
                <WrappedMessage message={messages.assetsDropZoneHeader}>
                  { displayText => (
                    <h2 data-identifier="asset-drop-zone-header">{displayText}</h2>
                  )}
                </WrappedMessage>
                <div className={styles['center-text']}>
                  <WrappedMessage message={messages.assetsDropZoneBrowseLabel} >
                    { displayText => (
                      <Button
                        aria-describedby="asset-drop-zone-max-file-size-label"
                        className={['btn', 'btn-outline-primary']}
                        data-identifier="asset-drop-zone-browse-button"
                        label={displayText}
                        onClick={this.handleClick}
                        inputRef={this.setUploadButtonRef}
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
                    <p
                      aria-hidden
                      className={styles['center-text']}
                      data-identifier="asset-drop-zone-max-file-size-label"
                      id="asset-drop-zone-max-file-size-label"
                    >
                      {displayText}
                    </p>
                  )}
                </WrappedMessage>
              </Dropzone>
            </div>
          )
        }
      </WrappedMessage>
    );
  }
}

AssetsDropZone.propTypes = {
  acceptedFileTypes: PropTypes.string,
  buttonRef: PropTypes.func,
  compactStyle: PropTypes.bool,
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
  maxFileCount: PropTypes.number,
  maxFileSizeMB: PropTypes.number,
  uploadAssets: PropTypes.func.isRequired,
  uploadExceedMaxCount: PropTypes.func.isRequired,
  uploadExceedMaxSize: PropTypes.func.isRequired,
  uploadInvalidFileType: PropTypes.func.isRequired,

};

AssetsDropZone.defaultProps = {
  acceptedFileTypes: undefined,
  buttonRef: () => {},
  compactStyle: false,
  maxFileCount: 1000,
  maxFileSizeMB: 10,
};
