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
import { clearAssetsStatus, deleteAsset } from '../../data/actions/assets';

export class AssetsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayAssetsList: [],
      modalOpen: false,
      statusAlertOpen: false,
      assetToDelete: {},
      elementToFocusOnModalClose: {},
      statusAlertRef: {},
    };

    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.deleteAsset = this.deleteAsset.bind(this);
    this.addSupplementalTableElements = this.addSupplementalTableElements.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.closeStatusAlert = this.closeStatusAlert.bind(this);
    this.renderStatusAlert = this.renderStatusAlert.bind(this);

    this.trashcanRefs = {};
  }

  componentDidMount() {
    this.addSupplementalTableElements();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.assetsList.length !== this.props.assetsList.length) {
      this.addSupplementalTableElements();
    }
  }

  onDeleteClick(assetId) {
    const assetToDelete = this.state.displayAssetsList.find(asset => (asset.id === assetId));

    this.setState({
      modalOpen: true,
      assetToDelete,
      elementToFocusOnModalClose: this.trashcanRefs[assetId],
    });
  }

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

    this.setState({
      displayAssetsList: newAssetsList,
    });
  }

  closeModal() {
    this.setState({ modalOpen: false });
    this.state.elementToFocusOnModalClose.focus();
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
    this.setState({ modalOpen: false });

    this.setState({
      elementToFocusOnModalClose: this.statusAlertRef,
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
          columns={[
            {
              label: 'Name',
              key: 'display_name',
            },
            {
              label: 'Type',
              key: 'content_type',
            },
            {
              label: 'Date Added',
              key: 'date_added',
            },
            {
              label: 'Delete Asset',
              key: 'delete_asset',
            },
          ]}
          data={this.state.displayAssetsList}
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
  clearAssetsStatus: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  assetsList: state.assets.list,
  assetsParameters: state.assets.parameters,
  assetsStatus: state.assets.status,
});

const mapDispatchToProps = dispatch => ({
  deleteAsset: (assetsParameters, assetId) => dispatch(deleteAsset(assetsParameters, assetId)),
  clearAssetsStatus: () => dispatch(clearAssetsStatus()),
});

const WrappedAssetsTable = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssetsTable);

export default WrappedAssetsTable;
