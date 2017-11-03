import React from 'react';
import PropTypes from 'prop-types';
import Table from '@edx/paragon/src/Table';
import Button from '@edx/paragon/src/Button';
import Modal from '@edx/paragon/src/Modal';
import StatusAlert from '@edx/paragon/src/StatusAlert';
import classNames from 'classnames';
import { connect } from 'react-redux';

import FontAwesomeStyles from 'font-awesome/css/font-awesome.min.css';
import { assetActions } from '../../data/constants/actionTypes';
import { clearAssetsStatus, deleteAsset, sortUpdate } from '../../data/actions/assets';

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
    };

    this.columns = {
      image_preview: {
        label: 'Image Preview',
        key: 'image_preview',
        columnSortable: false,
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
      delete_asset: {
        label: 'Delete Asset',
        key: 'delete_asset',
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
  }

  onSortClick(columnKey) {
    const sortedColumn = this.props.assetsParameters.sort;
    const sortedDirection = this.props.assetsParameters.direction;

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

  getImageThumbnail(thumbnail) {
    return thumbnail ? (<img src={`${this.props.courseDetails.base_url}${thumbnail}`} alt="Description not available" />) : (<img src={undefined} alt="Preview not available" />);
  }

  addSupplementalTableElements() {
    const newAssetsList = this.props.assetsList.map((asset, index) => {
      const currentAsset = Object.assign({}, asset);
      const deleteButton = (<Button
        className={[FontAwesomeStyles.fa, FontAwesomeStyles['fa-trash']]}
        label={''}
        buttonType={'light'}
        aria-label={`Delete ${currentAsset.display_name}`}
        onClick={() => { this.onDeleteClick(index); }}
        inputRef={(ref) => { this.trashcanRefs[currentAsset.id] = ref; }}
      />);

      // TODO: create lockButton
      currentAsset.delete_asset = deleteButton;
      // TODO: currentAsset.lock_asset = lockButton;

      /*
        TODO: we will have to add functionality to actually have the alt tag be the
        image description accompanying the image; we should also give a visual indicator
        of when the image description is missing to the course team and an ability to
        add a description at that point
      */
      currentAsset.image_preview = this.getImageThumbnail(currentAsset.thumbnail);

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
            label="Yes, delete."
            buttonType="primary"
            onClick={this.deleteAsset}
          />,
        ]}
      />
    );
  }

  renderModalBody() {
    return (
      <div>
        <span className={classNames(FontAwesomeStyles.fa, FontAwesomeStyles['fa-exclamation-triangle'])} aria-hidden="true" />
        Are you sure you wish to delete this item?
        This cannot be reversed! Any content that links/refers to this item will no longer work
        (e.g. images and/or links may break).
      </div>
    );
  }

  renderStatusAlert() {
    const { assetsStatus } = this.props;
    const deleteAssetName = this.state.deletedAsset.display_name;
    let alertDialog = `Deleting ${deleteAssetName}`;
    let alertType = 'info';

    switch (assetsStatus.type) {
      case assetActions.ASSET_XHR_FAILURE:
        alertDialog = `Unable to delete ${deleteAssetName}.`;
        alertType = 'danger';
        break;
      case assetActions.DELETE_ASSET_SUCCESS:
        alertDialog = `${deleteAssetName} has been deleted.`;
        alertType = 'success';
        break;
      default:
        break;
    }

    const statusAlert = (
      <StatusAlert
        alertType={alertType}
        open={this.state.statusAlertOpen}
        dialog={alertDialog}
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
        </div>
      );
    }

    return renderOutput;
  }
}

AssetsTable.propTypes = {
  assetsList: PropTypes.arrayOf(PropTypes.object).isRequired,
  assetsParameters: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool, PropTypes.object]),
  ).isRequired,
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
  deleteAsset: PropTypes.func.isRequired,
  updateSort: PropTypes.func.isRequired,
  clearAssetsStatus: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  assetsList: state.assets.list,
  assetsParameters: state.assets.parameters,
  assetsStatus: state.assets.status,
  courseDetails: state.courseDetails,
});

const mapDispatchToProps = dispatch => ({
  clearAssetsStatus: () => dispatch(clearAssetsStatus()),
  deleteAsset: (assetId, courseDetails) => dispatch(deleteAsset(assetId, courseDetails)),
  updateSort: (sortKey, sortDirection) => dispatch(sortUpdate(sortKey, sortDirection)),
});

const WrappedAssetsTable = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssetsTable);

export default WrappedAssetsTable;
