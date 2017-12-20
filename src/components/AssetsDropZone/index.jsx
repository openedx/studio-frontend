import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';

import Button from '@edx/paragon/src/Button';
import FontAwesomeStyles from 'font-awesome/css/font-awesome.min.css';

import { uploadAssets, uploadExceedMaxSize, uploadExceedMaxCount } from '../../data/actions/assets';

import styles from './AssetsDropZone.scss';


export class AssetsDropZone extends React.Component {
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
        >
          <p className={styles['upload-icon']}>
            <span
              aria-hidden
              className={classNames(FontAwesomeStyles.fa, FontAwesomeStyles['fa-cloud-upload'])}
            />
          </p>
          <h2>
            Drag and Drop
          </h2>
          <div className={styles['center-text']}>
            <Button
              label="Browse your computer"
              onClick={this.handleClick}
            />
          </div>
          <p>
            {`Maximum file size: ${this.props.maxFileSizeMB} MB`}
          </p>
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
  maxFileCount: 100,
  maxFileSizeMB: 10,
};

const mapStateToProps = state => ({
  courseDetails: state.studioDetails.course,
});

const mapDispatchToProps = dispatch => ({
  uploadAssets: (files, courseDetails) => dispatch(uploadAssets(files, courseDetails)),
  uploadExceedMaxCount: maxFileCount => dispatch(uploadExceedMaxCount(maxFileCount)),
  uploadExceedMaxSize: maxFileSizeMB => dispatch(uploadExceedMaxSize(maxFileSizeMB)),
});

const WrappedAssetsDropZone = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssetsDropZone);

export default WrappedAssetsDropZone;
