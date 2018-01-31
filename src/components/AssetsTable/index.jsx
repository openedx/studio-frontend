import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Modal, StatusAlert, Variant } from '@edx/paragon';
import classNames from 'classnames';
import { FormattedNumber } from 'react-intl';

import FontAwesomeStyles from 'font-awesome/css/font-awesome.min.css';
import styles from './AssetsTable.scss';
import { assetActions } from '../../data/constants/actionTypes';
import { assetLoading } from '../../data/constants/loadingTypes';
import CopyButton from '../CopyButton';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';
import messages from './displayMessages';

export default class AssetsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assetToDelete: {},
      copyButtonIsClicked: false,
      deletedAsset: {},
      deletedAssetIndex: null,
      elementToFocusOnModalClose: {},
      modalOpen: false,
      statusAlertFields: {
        alertDialog: '',
        alertType: 'info',
      },
      statusAlertOpen: false,
      uploadSuccessCount: 1,
    };

    this.columns = {
      image_preview: {
        label: (<WrappedMessage message={messages.assetsTablePreviewLabel} />),
        key: 'image_preview',
        columnSortable: false,
        hideHeader: true,
      },
      display_name: {
        label: (<WrappedMessage message={messages.assetsTableNameLabel} />),
        key: 'display_name',
        columnSortable: true,
      },
      content_type: {
        label: (<WrappedMessage message={messages.assetsTableTypeLable} />),
        key: 'content_type',
        columnSortable: true,
      },
      date_added: {
        label: (<WrappedMessage message={messages.assetsTableDateLabel} />),
        key: 'date_added',
        columnSortable: true,
      },
      urls: {
        label: (<WrappedMessage message={messages.assetsTableCopyLabel} />),
        key: 'urls',
        columnSortable: false,
      },
      delete_asset: {
        label: (<WrappedMessage message={messages.assetsTableDeleteLabel} />),
        key: 'delete_asset',
        columnSortable: false,
        hideHeader: true,
      },
      lock_asset: {
        label: (<WrappedMessage message={messages.assetsTableLockLabel} />),
        key: 'lock_asset',
        columnSortable: false,
        hideHeader: true,
      },
    };

    this.trashcanRefs = {};
    this.statusAlertRef = {};

    this.addSupplementalTableElements = this.addSupplementalTableElements.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.closeStatusAlert = this.closeStatusAlert.bind(this);
    this.deleteAsset = this.deleteAsset.bind(this);
    this.onCopyButtonClick = this.onCopyButtonClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.renderStatusAlert = this.renderStatusAlert.bind(this);
    this.updateUploadSuccessCount = this.updateUploadSuccessCount.bind(this);
  }


  componentWillReceiveProps(nextProps) {
    const { assetsStatus } = nextProps;
    this.updateStatusAlertFields(assetsStatus);
  }

  onSortClick(columnKey) {
    const sortedColumn = this.props.assetsSortMetaData.sort;
    const sortedDirection = this.props.assetsSortMetaData.direction;

    let newDirection = 'desc';

    if (sortedColumn === columnKey) {
      newDirection = sortedDirection === 'desc' ? 'asc' : 'desc';
    }

    this.props.updateSort(columnKey, newDirection, this.props.courseDetails);
  }

  onDeleteClick(index) {
    const assetToDelete = this.props.assetsList[index];

    this.setState({
      assetToDelete,
      deletedAssetIndex: index,
      elementToFocusOnModalClose: this.trashcanRefs[assetToDelete.id],
      modalOpen: true,
    });
  }

  onLockClick = (e) => {
    const assetId = e.currentTarget.getAttribute('data-asset-id');
    const clickedAsset = this.props.assetsList.find(asset => (asset.id === assetId));
    this.props.toggleLockAsset(clickedAsset, this.props.courseDetails);
  }

  onCopyButtonClick(isClicked) {
    this.setState({
      copyButtonIsClicked: isClicked,
    });
  }

  getImageThumbnail(thumbnail) {
    const baseUrl = this.props.courseDetails.base_url || '';
    if (thumbnail) {
      return (
        <WrappedMessage message={messages.assetsTableNoDescription} >
          { displayText => (<img src={`${baseUrl}${thumbnail}`} alt={displayText} />) }
        </WrappedMessage>
      );
    }
    return (
      <WrappedMessage message={messages.assetsTableNoPreview} >
        { displayText => <div className={styles['no-image-preview']}>{displayText}</div> }
      </WrappedMessage>
    );
  }

  getLockButton(asset) {
    const classes = [FontAwesomeStyles.fa, 'btn-outline-primary'];
    let lockStateMessage;
    if (asset.locked) {
      lockStateMessage = messages.assetsTableUnlockedObject;
      classes.push(FontAwesomeStyles['fa-lock']);
    } else {
      lockStateMessage = messages.assetsTableUnlockedObject;
      classes.push(FontAwesomeStyles['fa-unlock']);
    }
    return (
      <WrappedMessage message={lockStateMessage} values={{ object: asset.display_name }}>
        { displayText =>
          (<Button
            className={classes}
            label={''}
            data-asset-id={asset.id}
            aria-label={displayText}
            onClick={this.onLockClick}
          />)
        }
      </WrappedMessage>
    );
  }

  getNextFocusElementOnDelete() {
    const { assetsStatus } = this.props;

    let deletedIndex = this.state.deletedAssetIndex;
    let focusAsset = this.state.deletedAsset;

    switch (assetsStatus.type) {
      case assetActions.delete.DELETE_ASSET_SUCCESS:
        if (deletedIndex > 0) {
          deletedIndex -= 1;
        }
        focusAsset = this.props.assetsList[deletedIndex];
        break;
      default:
        break;
    }

    return this.trashcanRefs[focusAsset.id];
  }

  getLoadingLockButton(asset) {
    // spinner classes are applied to the span to keep the whole button from spinning
    const spinnerClasses = [FontAwesomeStyles.fa, FontAwesomeStyles['fa-spinner'], FontAwesomeStyles['fa-spin']];
    return (
      <WrappedMessage
        message={messages.assetsTableUpdateLock}
        values={{ assetName: asset.display_name }}
      >
        { displayText =>
          (<Button
            className={['btn-outline-primary']}
            label={(<span className={classNames(...spinnerClasses)} />)}
            aria-label={displayText}
          />)
        }
      </WrappedMessage>
    );
  }

  getCopyUrlButtons(assetDisplayName, studioUrl, webUrl) {
    return (
      <span>
        {
          studioUrl && this.getCopyUrlButton(
            assetDisplayName,
            studioUrl,
            messages.assetsTableStudioLink,
            [styles['studio-copy-button']],
          )
        }
        {
          webUrl && this.getCopyUrlButton(
            assetDisplayName,
            webUrl,
            messages.assetsTableWebLink,
          )
        }
      </span>
    );
  }

  getCopyUrlButton(assetDisplayName, url, labelMessage, classes = []) {
    const buttonLabel = (
      <span>
        <span className={classNames(FontAwesomeStyles.fa, FontAwesomeStyles['fa-files-o'], styles['copy-icon'])} aria-hidden />
        <WrappedMessage message={labelMessage} />
      </span>
    );

    const onCopyLabel = (
      <WrappedMessage message={messages.assetsTableCopiedStatus} />
    );

    return (
      <WrappedMessage
        message={messages.assetsTableDetailedCopyLink}
        values={{
          displayName: assetDisplayName,
          label: (<WrappedMessage message={labelMessage} />),
        }}
      >
        {
          displayText =>
            (<CopyButton
              label={buttonLabel}
              className={classes}
              textToCopy={url}
              onCopyButtonClick={this.onCopyButtonClick}
              ariaLabel={displayText}
              onCopyLabel={onCopyLabel}
            />)
        }
      </WrappedMessage>
    );
  }

  updateStatusAlertFields(assetsStatus) {
    const assetName = this.state.deletedAsset.display_name;
    let alertDialog;
    let alertType;

    const genericUpdateError = (
      <WrappedMessage
        message={messages.assetsTableGenericUpdateError}
      />
    );

    switch (assetsStatus.type) {
      case assetActions.delete.DELETE_ASSET_FAILURE:
        alertDialog = (
          <WrappedMessage
            message={messages.assetsTableCantDelete}
            values={{ assetName }}
          />
        );
        alertType = 'danger';
        break;
      case assetActions.delete.DELETE_ASSET_SUCCESS:
        alertDialog = (
          <WrappedMessage
            message={messages.assetsTableDeleteSuccess}
            values={{ assetName }}
          />
        );
        alertType = 'success';
        break;
      case assetActions.upload.UPLOAD_ASSET_SUCCESS:
        this.updateUploadSuccessCount();
        alertDialog = (
          <WrappedMessage
            message={messages.assetsTableUploadSuccess}
            values={{ uploaded_count: (<FormattedNumber value={this.state.uploadSuccessCount} />) }}
          />
        );
        alertType = 'success';
        break;
      case assetActions.upload.UPLOADING_ASSETS:
        this.closeStatusAlert();
        alertDialog = (
          <WrappedMessage
            message={messages.assetsTableUploadInProgress}
            values={{ uploading_count: (<FormattedNumber value={assetsStatus.count} />) }}
          />
        );
        alertType = 'info';
        break;
      case assetActions.upload.UPLOAD_EXCEED_MAX_COUNT_ERROR:
        alertDialog = (
          <WrappedMessage
            message={messages.assetsTableTooManyFiles}
            values={{ max_count: (<FormattedNumber value={assetsStatus.maxFileCount} />) }}
          />
        );
        alertType = 'danger';
        break;
      case assetActions.upload.UPLOAD_EXCEED_MAX_SIZE_ERROR:
        alertDialog = (
          <WrappedMessage
            message={messages.assetsTableTooMuchData}
            values={{ max_size: (<FormattedNumber value={assetsStatus.maxFileSizeMB} />) }}
          />
        );
        alertType = 'danger';
        break;
      case assetActions.upload.UPLOAD_ASSET_FAILURE:
        alertDialog = (
          <WrappedMessage
            message={messages.assetsTableGenericError}
            values={{ assetName: assetsStatus.file.name }}
          />
        );
        alertType = 'danger';
        break;
      case assetActions.lock.TOGGLING_LOCK_ASSET_FAILURE:
        alertDialog = (
          <WrappedMessage
            message={messages.assetsTableFailedLock}
            values={{ assetName: assetsStatus.asset.name }}
          />
        );
        alertType = 'danger';
        break;
      case assetActions.clear.CLEAR_FILTERS_FAILURE:
        alertDialog = genericUpdateError;
        alertType = 'danger';
        break;
      case assetActions.filter.FILTER_UPDATE_FAILURE:
        alertDialog = genericUpdateError;
        alertType = 'danger';
        break;
      case assetActions.paginate.PAGE_UPDATE_FAILURE:
        alertDialog = genericUpdateError;
        alertType = 'danger';
        break;
      case assetActions.sort.SORT_UPDATE_FAILURE:
        alertDialog = genericUpdateError;
        alertType = 'danger';
        break;
      default:
        return;
    }

    this.setState({
      statusAlertOpen: true,
      statusAlertFields: {
        alertDialog,
        alertType,
      },
    });
    this.statusAlertRef.focus();
  }

  updateUploadSuccessCount() {
    const uploadSuccessCount = this.state.uploadSuccessCount + 1;
    this.setState({
      uploadSuccessCount,
    });
  }

  addSupplementalTableElements() {
    const newAssetsList = this.props.assetsList.map((asset, index) => {
      const currentAsset = Object.assign({}, asset);

      const deleteButton = (
        <WrappedMessage
          message={messages.assetsTableDeleteObject}
          values={{ displayName: currentAsset.display_name }}
        >
          { displayText =>
            (<Button
              key={currentAsset.id}
              className={[FontAwesomeStyles.fa, FontAwesomeStyles['fa-trash'], 'btn-outline-primary']}
              label={''}
              aria-label={displayText}
              onClick={() => { this.onDeleteClick(index); }}
              inputRef={(ref) => { this.trashcanRefs[currentAsset.id] = ref; }}
            />)
          }
        </WrappedMessage>
      );
      const isLoadingLock = currentAsset.loadingFields &&
        currentAsset.loadingFields.includes(assetLoading.LOCK);

      currentAsset.delete_asset = deleteButton;

      currentAsset.lock_asset = isLoadingLock ?
        this.getLoadingLockButton(currentAsset) : this.getLockButton(currentAsset);

      /*
        TODO: we will have to add functionality to actually have the alt tag be the
        image description accompanying the image; we should also give a visual indicator
        of when the image description is missing to the course team and an ability to
        add a description at that point
      */
      currentAsset.image_preview = this.getImageThumbnail(currentAsset.thumbnail);

      currentAsset.urls = this.getCopyUrlButtons(
        currentAsset.display_name,
        currentAsset.url,
        currentAsset.external_url,
      );

      return currentAsset;
    });
    return newAssetsList;
  }

  closeModal() {
    this.state.elementToFocusOnModalClose.focus();

    this.setState({
      assetToDelete: {},
      deletedAssetIndex: null,
      elementToFocusOnModalClose: {},
      modalOpen: false,
    });
  }

  closeDeleteStatus = () => {
    this.getNextFocusElementOnDelete().focus();
    this.closeStatusAlert();
  }

  closeStatusAlert() {
    this.props.clearAssetsStatus();

    // clear out all status related state
    this.setState({
      deletedAsset: {},
      deletedAssetIndex: null,
      statusAlertOpen: false,
      statusAlertFields: {
        alertDialog: '',
        alertType: 'info',
      },
      uploadSuccessCount: 1,
    });
  }

  deleteAsset() {
    const deletedAsset = { ...this.state.assetToDelete };

    this.props.deleteAsset(this.state.assetToDelete.id, this.props.courseDetails);

    this.setState({
      assetToDelete: {},
      deletedAsset,
      elementToFocusOnModalClose: this.statusAlertRef,
      modalOpen: false,
    });
  }

  renderModal() {
    return (
      <WrappedMessage message={messages.assetsTableCancel} >
        {
          displayText => (
            <Modal
              open={this.state.modalOpen}
              title={(<WrappedMessage
                message={messages.assetsTableDeleteObject}
                values={{
                  displayName: this.state.assetToDelete.display_name,
                }}
              />)}
              body={this.renderModalBody()}
              closeText={displayText}
              onClose={this.closeModal}
              buttons={[
                <Button
                  label={<WrappedMessage message={messages.assetsTablePermaDelete} />}
                  buttonType="primary"
                  onClick={this.deleteAsset}
                />,
              ]}
              variant={{ status: Variant.status.WARNING }}
            />
          )
        }
      </WrappedMessage>
    );
  }

  renderModalBody() {
    const learnMoreLink = (
      <WrappedMessage tagName="a" message={messages.assetsTableLearnMore}>
        {
          displayText => (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={this.props.courseFilesDocs}
            >
              {displayText}
            </a>
          )
        }
      </WrappedMessage>
    );
    return (
      <React.Fragment>
        <WrappedMessage
          message={messages.assetsTableDeleteWarning}
          tagName="p"
          values={{
            displayName: <b>{this.state.assetToDelete.display_name}</b>,
          }}
        />
        <WrappedMessage
          message={messages.assetsTableDeleteConsequences}
          tagName="p"
          values={{
            link: learnMoreLink,
          }}
        />
      </React.Fragment>
    );
  }

  renderStatusAlert() {
    const { assetsStatus } = this.props;

    let onClose = this.closeStatusAlert;
    if (Object.prototype.hasOwnProperty.call(assetActions.delete, assetsStatus.type)) {
      onClose = this.closeDeleteStatus;
    }

    const statusAlert = (
      <StatusAlert
        alertType={this.state.statusAlertFields.alertType}
        dialog={this.state.statusAlertFields.alertDialog}
        open={this.state.statusAlertOpen}
        onClose={onClose}
        ref={(input) => { this.statusAlertRef = input; }}
      />
    );

    return (
      <React.Fragment>
        {statusAlert}
      </React.Fragment>
    );
  }

  render() {
    return (
      <React.Fragment>
        {this.renderStatusAlert()}
        <span className={classNames(styles['wrap-text'])}>
          <Table
            className={['table-responsive']}
            columns={Object.keys(this.columns).map(columnKey => ({
              ...this.columns[columnKey],
              onSort: () => this.onSortClick(columnKey),
            }))}
            data={this.addSupplementalTableElements(this.props.assetsList)}
            tableSortable
            defaultSortedColumn="date_added"
            defaultSortDirection="desc"
          />
        </span>
        {this.renderModal()}
        <span className="sr" aria-live="assertive" id="copy-status">
          {
            this.state.copyButtonIsClicked
              ? (<WrappedMessage message={messages.assetsTableCopiedStatus} />)
              : ''
          }
        </span>
      </React.Fragment>
    );
  }
}

AssetsTable.propTypes = {
  assetsList: PropTypes.arrayOf(PropTypes.object).isRequired,
  assetsSortMetaData: PropTypes.shape({
    sort: PropTypes.string,
    direction: PropTypes.string,
  }).isRequired,
  assetsStatus: PropTypes.shape({
    response: PropTypes.object,
    type: PropTypes.string,
  }).isRequired,
  courseDetails: PropTypes.shape({
    lang: PropTypes.string,
    url_name: PropTypes.string,
    name: PropTypes.string,
    display_course_number: PropTypes.string,
    num: PropTypes.string,
    org: PropTypes.string,
    id: PropTypes.string,
    revision: PropTypes.string,
    base_url: PropTypes.string,
  }).isRequired,
  courseFilesDocs: PropTypes.string.isRequired,
  deleteAsset: PropTypes.func.isRequired,
  updateSort: PropTypes.func.isRequired,
  clearAssetsStatus: PropTypes.func.isRequired,
  toggleLockAsset: PropTypes.func.isRequired,
};
