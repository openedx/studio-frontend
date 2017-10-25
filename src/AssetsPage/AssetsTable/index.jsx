import React from 'react';
import PropTypes from 'prop-types';
import Table from '@edx/paragon/src/Table';
import Button from '@edx/paragon/src/Button';
import Modal from '@edx/paragon/src/Modal';
import classNames from 'classnames';
import { connect } from 'react-redux';

import FontAwesomeStyles from 'font-awesome/css/font-awesome.min.css';
import { deleteAsset, sortUpdate } from '../../data/actions/assets';

export class AssetsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
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

    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.deleteAsset = this.deleteAsset.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onSortClick = this.onSortClick.bind(this);

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
        sortedColumn: '',
        columnKey: newDirection,
      });
    }

    this.props.updateSort(columnKey, newDirection);
  }

  onDeleteClick(assetId) {
    const assetToDelete = this.state.displayAssetsList.find(asset => (asset.id === assetId));

    this.setState({
      modalOpen: true,
      assetToDelete,
      elementToFocusOnModalClose: this.trashcanRefs[assetId],
    });
  }

  closeModal() {
    this.setState({ modalOpen: false });
    this.state.elementToFocusOnModalClose.focus();
  }

  addDeleteButton(assetsList) {
    const newAssetsList = assetsList.map((asset) => {
      const currentAsset = Object.assign({}, asset);
      const deleteButton = (<Button
        className={[FontAwesomeStyles.fa, FontAwesomeStyles['fa-trash']]}
        display={''}
        buttonType={'light'}
        aria-label={`Delete ${currentAsset.display_name}`}
        onClick={() => { this.onDeleteClick(currentAsset.id); }}
        inputRef={(ref) => { this.trashcanRefs[asset.id] = ref; }}
      />);

      currentAsset.delete_asset = deleteButton;
      return currentAsset;
    });

    return newAssetsList;
  }

  deleteAsset() {
    this.props.deleteAsset(this.props.assetsParameters, this.state.assetToDelete.id);
    this.setState({ modalOpen: false });
  }

  renderModal() {
    return (
      <Modal
        open={this.state.modalOpen}
        title={`Delete ${this.state.assetToDelete.display_name}`}
        body={this.renderBody()}
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

  renderBody() {
    return (
      <div>
        <span className={classNames(FontAwesomeStyles.fa, FontAwesomeStyles['fa-exclamation-triangle'])} aria-hidden="true" />
        Are you sure you wish to delete this item?
        This cannot be reversed! Any content that links/refers to this item will no longer work
        (e.g. images and/or links may break).
      </div>
    );
  }

  render() {
    return (!this.props.assetsList.length) ? (
      <span>Loading....</span>
    ) : (
      <div>
        <Table
          columns={Object.values(this.columns).map(column => ({
            ...column,
            onSort: () => this.onSortClick(column.key),
          }))}
          data={this.addDeleteButton(this.props.assetsList)}
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
  deleteAsset: PropTypes.func.isRequired,
  updateSort: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  assetsList: state.assets.list,
  assetsParameters: state.assets.parameters,
  assetsStatus: state.assets.status,
});

const mapDispatchToProps = dispatch => ({
  deleteAsset: (assetsParameters, assetId) => dispatch(deleteAsset(assetsParameters, assetId)),
  updateSort: (sortKey, sortDirection) => dispatch(sortUpdate(sortKey, sortDirection)),
});

const WrappedAssetsTable = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssetsTable);

export default WrappedAssetsTable;
