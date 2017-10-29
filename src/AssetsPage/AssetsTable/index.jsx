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
      elementToFocusOnModalClose: {},
      columnSortState: {
        display_name: 'none',
        content_type: 'none',
        date_added: 'desc',
      },
    };

    this.columns = {
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
      },
    };

    this.statusAlertRef = {};

    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.deleteAsset = this.deleteAsset.bind(this);
    this.addSupplementalTableElements = this.addSupplementalTableElements.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.closeStatusAlert = this.closeStatusAlert.bind(this);
    this.renderStatusAlert = this.renderStatusAlert.bind(this);


    this.trashcanRefs = {};
  }

  onSortClick(columnKey) {
    const sortedColumn = this.props.assetsParameters.sort;
    const sortedDirection = this.props.assetsParameters.direction;

    let newDirection = 'desc';

    if (sortedColumn === columnKey) {
      newDirection = sortedDirection === 'desc' ? 'asc' : 'desc';

      this.setState({
        ...this.state.columnSortState,
        columnKey: newDirection,
      });
    } else {
      this.setState({
        ...this.state.columnSortState,
        sortedColumn: 'none',
        columnKey: newDirection,
      });
    }
    this.props.updateSort(columnKey, newDirection);
  }

  // componentDidMount() {
  //   this.addSupplementalTableElements();
  // }

  // componentDidUpdate(prevProps) {
  //   if (prevProps.assetsList.length !== this.props.assetsList.length) {
  //     this.addSupplementalTableElements();
  //   }
  //   this.props.updateSort(columnKey, newDirection);
  // }

  onDeleteClick(assetId) {
    const assetToDelete = this.props.assetsList.find(asset => (asset.id === assetId));

    this.setState({
      modalOpen: true,
      assetToDelete,
      elementToFocusOnModalClose: this.trashcanRefs[assetId],
    });
  }

  // addDeleteButton(assetsList) {
  //   const newAssetsList = assetsList.map((asset) => {

  getNextFocusElementOnDelete(assetToDelete) {
    const { assetsStatus } = this.props;
    let rowToDelete = assetToDelete.row_key;
    let focusAsset = assetToDelete;

    switch (assetsStatus.type) {
      case assetActions.DELETE_ASSET_SUCCESS:
        if (rowToDelete > 0) {
          rowToDelete -= 1;
        }
        focusAsset = this.state.displayAssetsList.find(asset => asset.row_key === (rowToDelete));
        break;
      default:
        break;
    }

    return this.trashcanRefs[focusAsset.id];
  }

  closeModal() {
    this.setState({ modalOpen: false });
    this.state.elementToFocusOnModalClose.focus();
  }

  addSupplementalTableElements() {
    const newAssetsList = this.props.assetsList.map((asset, index) => {
      const currentAsset = Object.assign({}, asset);
      const deleteButton = (<Button
        className={[FontAwesomeStyles.fa, FontAwesomeStyles['fa-trash']]}
        display={''}
        buttonType={'light'}
        aria-label={`Delete ${currentAsset.display_name}`}
        onClick={() => { this.onDeleteClick(currentAsset.id); }}
        inputRef={(ref) => { this.trashcanRefs[currentAsset.id] = ref; }}
      />);

      // TODO: create lockButton

      currentAsset.delete_asset = deleteButton;
      // TODO: currentAsset.lock_asset = lockButton;
      currentAsset.row_key = index;
      return currentAsset;
    });

    return newAssetsList;
  }

  closeStatusAlert() {
    this.setState({
      statusAlertOpen: false,
    });
    this.getNextFocusElementOnDelete(this.state.assetToDelete).focus();
    this.props.clearAssetsStatus();
  }

  deleteAsset() {
    this.props.deleteAsset(this.props.assetsParameters, this.state.assetToDelete.id);

    this.setState({
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
            display="Yes, delete."
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
    const deleteAssetName = this.state.assetToDelete.display_name;
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
    return (!this.props.assetsList.length) ? (
      <span>Loading....</span>
    ) : (
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
  deleteAsset: PropTypes.func.isRequired,
  updateSort: PropTypes.func.isRequired,
  clearAssetsStatus: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  assetsList: state.assets.list,
  assetsParameters: state.assets.parameters,
  assetsStatus: state.assets.status,
});

const mapDispatchToProps = dispatch => ({
  deleteAsset: (assetsParameters, assetId) => dispatch(deleteAsset(assetsParameters, assetId)),
  updateSort: (sortKey, sortDirection) => dispatch(sortUpdate(sortKey, sortDirection)),
  clearAssetsStatus: () => dispatch(clearAssetsStatus()),
});

const WrappedAssetsTable = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssetsTable);

export default WrappedAssetsTable;
