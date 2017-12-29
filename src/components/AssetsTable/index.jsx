import React from 'react';
import PropTypes from 'prop-types';
import Table from '@edx/paragon/src/Table';
import Button from '@edx/paragon/src/Button';
import Modal from '@edx/paragon/src/Modal';
import StatusAlert from '@edx/paragon/src/StatusAlert';
import Variant from '@edx/paragon/src/utils/constants';
import classNames from 'classnames';
import { connect } from 'react-redux';

import FontAwesomeStyles from 'font-awesome/css/font-awesome.min.css';
import { assetActions } from '../../data/constants/actionTypes';
import { assetLoading } from '../../data/constants/loadingTypes';
import { clearAssetsStatus, deleteAsset, sortUpdate, toggleLockAsset } from '../../data/actions/assets';
import CopyButton from '../CopyButton';

export class AssetsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      statusAlertOpen: false,
      assetToDelete: {},
      deletedAsset: {},
      deletedAssetIndex: null,
      elementToFocusOnModalClose: {},
      copyButtonIsClicked: false,
    };

    this.columns = {
      image_preview: {
        label: 'Image Preview',
        key: 'image_preview',
        columnSortable: false,
        hideHeader: true,
      },
      display_name: {
        label: 'Name',
        key: 'display_name',
        columnSortable: true,
      },
      content_type: {
        label: 'Type',
        key: 'content_type',
        columnSortable: true,
      },
      date_added: {
        label: 'Date Added',
        key: 'date_added',
        columnSortable: true,
      },
      urls: {
        label: 'Copy URLs',
        key: 'urls',
        columnSortable: false,
      },
      delete_asset: {
        label: 'Delete Asset',
        key: 'delete_asset',
        columnSortable: false,
        hideHeader: true,
      },
      lock_asset: {
        label: 'Lock Asset',
        key: 'lock_asset',
        columnSortable: false,
        hideHeader: true,
      },
    };

    this.trashcanRefs = {};
    this.statusAlertRef = {};

    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.deleteAsset = this.deleteAsset.bind(this);
    this.addSupplementalTableElements = this.addSupplementalTableElements.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.closeStatusAlert = this.closeStatusAlert.bind(this);
    this.renderStatusAlert = this.renderStatusAlert.bind(this);
    this.onCopyButtonClick = this.onCopyButtonClick.bind(this);
  }

  onSortClick(columnKey) {
    const sortedColumn = this.props.assetsSortMetaData.sort;
    const sortedDirection = this.props.assetsSortMetaData.direction;

    let newDirection = 'desc';

    if (sortedColumn === columnKey) {
      newDirection = sortedDirection === 'desc' ? 'asc' : 'desc';
    }

    this.props.updateSort(columnKey, newDirection);
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
    return thumbnail ? (<img src={`${baseUrl}${thumbnail}`} alt="Description not available" />) : 'Preview not available';
  }

  getLockButton(asset) {
    const classes = [FontAwesomeStyles.fa];
    let lockState;
    if (asset.locked) {
      lockState = 'Locked';
      classes.push(FontAwesomeStyles['fa-lock']);
    } else {
      lockState = 'Unlocked';
      classes.push(FontAwesomeStyles['fa-unlock']);
    }
    return (<Button
      label={(<span className={classNames(...classes)} />)}
      data-asset-id={asset.id}
      aria-label={`${lockState} ${asset.display_name}`}
      onClick={this.onLockClick}
    />);
  }

  getNextFocusElementOnDelete() {
    const { assetsStatus } = this.props;

    let deletedIndex = this.state.deletedAssetIndex;
    let focusAsset = this.state.deletedAsset;

    switch (assetsStatus.type) {
      case assetActions.DELETE_ASSET_SUCCESS:
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
    const classes = [FontAwesomeStyles.fa, FontAwesomeStyles['fa-spinner'], FontAwesomeStyles['fa-spin']];
    return (<Button
      label={(<span className={classNames(...classes)} />)}
      aria-label={`Updating lock status for ${asset.display_name}`}
    />);
  }

  getLockFailedStatusFields(assetsStatus) {
    return {
      alertDialog: `Failed to toggle lock for ${assetsStatus.asset.name}`,
      alertType: 'danger',
    };
  }

  getDeleteStatusFields(assetsStatus) {
    const assetName = this.state.deletedAsset.display_name;
    let alertDialog;
    let alertType;

    switch (assetsStatus.type) {
      case assetActions.DELETE_ASSET_FAILURE:
        alertDialog = `Unable to delete ${assetName}.`;
        alertType = 'danger';
        break;
      case assetActions.DELETE_ASSET_SUCCESS:
        alertDialog = `${assetName} has been deleted.`;
        alertType = 'success';
        break;
      default:
        break;
    }
    return {
      alertDialog,
      alertType,
    };
  }

  getCopyUrlButtons(assetDisplayName, studioUrl, webUrl) {
    return (
      <span>
        {studioUrl && this.getCopyUrlButton(assetDisplayName, studioUrl, 'Studio')}
        {webUrl && this.getCopyUrlButton(assetDisplayName, webUrl, 'Web')}
      </span>
    );
  }

  getCopyUrlButton(assetDisplayName, url, label) {
    const buttonLabel = (
      <span>
        <span className={classNames(FontAwesomeStyles.fa, FontAwesomeStyles['fa-files-o'])} aria-hidden />
        {label}
      </span>
    );

    const onCopyLabel = (<span>Copied!</span>);

    return (<CopyButton
      label={buttonLabel}
      textToCopy={url}
      onCopyButtonClick={this.onCopyButtonClick}
      ariaLabel={`${assetDisplayName} copy ${label} URL`}
      onCopyLabel={onCopyLabel}
    />);
  }

  handleCopyButtonEvent(buttonIsClicked) {
    this.setState({
      copyButtonIsClicked: buttonIsClicked,
    });
  }

  addSupplementalTableElements() {
    const newAssetsList = this.props.assetsList.map((asset, index) => {
      const currentAsset = Object.assign({}, asset);

      const deleteButton = (<Button
        key={currentAsset.id}
        className={[FontAwesomeStyles.fa, FontAwesomeStyles['fa-trash']]}
        label={''}
        aria-label={`Delete ${currentAsset.display_name}`}
        onClick={() => { this.onDeleteClick(index); }}
        inputRef={(ref) => { this.trashcanRefs[currentAsset.id] = ref; }}
      />);
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

  closeStatusAlert() {
    this.getNextFocusElementOnDelete().focus();
    this.props.clearAssetsStatus();

    this.setState({
      deletedAsset: {},
      deletedAssetIndex: null,
      statusAlertOpen: false,
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
      statusAlertOpen: true,
    });
    this.state.elementToFocusOnModalClose.focus();
  }

  renderModal() {
    return (
      <Modal
        open={this.state.modalOpen}
        title={`Delete ${this.state.assetToDelete.display_name}`}
        body={this.renderModalBody()}
        closeText="Cancel"
        onClose={this.closeModal}
        buttons={[
          <Button
            label="Permanently delete"
            buttonType="primary"
            onClick={this.deleteAsset}
          />,
        ]}
        variant={{ status: Variant.status.WARNING }}
      />
    );
  }

  renderModalBody() {
    return (
      <div>
        <p>Deleting <b>{this.state.assetToDelete.display_name}</b> cannot be undone.</p>
        <p>
          Any links or references to this file will no longer work. <a
            target="_blank"
            rel="noopener noreferrer"
            href={this.props.courseFilesDocs}
          >
            Learn more.
          </a>
        </p>
      </div>
    );
  }

  renderStatusAlert() {
    const { assetsStatus } = this.props;
    const deleteActions = [assetActions.DELETE_ASSET_FAILURE, assetActions.DELETE_ASSET_SUCCESS];
    let status = {
      alertDialog: 'Processing',
      alertType: 'info',
    };
    if (assetsStatus.type === assetActions.TOGGLING_LOCK_ASSET_FAILURE) {
      status = this.getLockFailedStatusFields(assetsStatus);
    } else if (deleteActions.includes(assetsStatus.type)) {
      status = this.getDeleteStatusFields(assetsStatus);
    }

    const statusAlert = (
      <StatusAlert
        alertType={status.alertType}
        dialog={status.alertDialog}
        open={this.state.statusAlertOpen}
        onClose={this.closeStatusAlert}
        ref={(input) => { this.statusAlertRef = input; }}
      />
    );

    return (
      <div>
        {statusAlert}
      </div>
    );
  }

  render() {
    let renderOutput;
    // TODO: Add UI for when there is nothing in the list and we have a status returned from the API
    // TODO: http://fhtwd0.axshare.com/#g=1&p=files-and-uploads-empty
    // Only show Loading when the list is empty AND the status from the APIs are empty
    if (this.props.assetsList.length === 0 && Object.keys(this.props.assetsStatus).length === 0) {
      renderOutput = (<span>Loading....</span>);
    } else {
      renderOutput = (
        <div>
          {this.renderStatusAlert()}
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
          {this.renderModal()}
          <span className="sr" aria-live="assertive" id="copy-status"> {this.state.copyButtonIsClicked ? 'Copied' : ''} </span>
        </div>
      );
    }
    return renderOutput;
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

const mapStateToProps = state => ({
  assetsList: state.assets,
  assetsSortMetaData: state.metadata.sort,
  assetsStatus: state.metadata.status,
  courseDetails: state.studioDetails.course,
  courseFilesDocs: state.studioDetails.help_tokens.files,
});

const mapDispatchToProps = dispatch => ({
  clearAssetsStatus: () => dispatch(clearAssetsStatus()),
  deleteAsset: (assetId, courseDetails) => dispatch(deleteAsset(assetId, courseDetails)),
  updateSort: (sortKey, sortDirection) => dispatch(sortUpdate(sortKey, sortDirection)),
  toggleLockAsset: (asset, courseDetails) => dispatch(toggleLockAsset(asset, courseDetails)),
});

const WrappedAssetsTable = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssetsTable);

export default WrappedAssetsTable;
