import React from 'react';
import PropTypes from 'prop-types';
import Table from '@edx/paragon/src/Table';
import Button from '@edx/paragon/src/Button';
import Modal from '@edx/paragon/src/Modal';
import classNames from 'classnames';
import { connect } from 'react-redux';

import FontAwesomeStyles from 'font-awesome/css/font-awesome.min.css';
import { deleteAsset } from '../../data/actions/assets';


export class AssetsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayAssetsList: [],
      modalOpen: false,
      assetToDelete: {},
      elementToFocusOnModalClose: {},
      tableColumns: [
        // keyed object? or just search through the object when I need it? performance?
        {
          // label: this.renderTableColumnButton('Name', true, 'descending'),
          label: 'Name',
          key: 'display_name',
          sortable: true,
          // redundancy :(
          sortDirection: 'descending',
        },
        {
          // label: this.renderTableColumnButton('Type', true, 'none'),
          label: 'Type',
          key: 'content_type',
          sortable: true,
          sortDirection: 'none',
        },
        {
          // label: this.renderTableColumnButton('Date Added', true, ''),
          label: 'Date Added',
          key: 'date_added',
          sortable: true,
          sortDirection: 'none',
        },
        {
          // label: this.renderTableColumnButton('Delete Asset', false, ''),
          label: 'Delete Asset',
          key: 'delete_asset',
          sortable: false,
        },
      ],
      sortState: {
        // should this be dynamic instead of hardcoded? first sortable element of the columns? how to do that?
        columnKey: 'display_name',
        direction: 'descending',
      },
    };

    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.deleteAsset = this.deleteAsset.bind(this);
    this.addDeleteButton = this.addDeleteButton.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.getSortIcon = this.getSortIcon.bind(this);
    this.renderTableColumnButton = this.renderTableColumnButton.bind(this);
    this.addTableColumnButton = this.addTableColumnButton.bind(this);
    this.onSortClick = this.onSortClick.bind(this);

    this.trashcanRefs = {};
  }

  addTableColumnButton(column) {
    const newColumn = Object.assign({}, column);
    const columnButton = this.renderTableColumnButton(newColumn);
    newColumn.label = columnButton;
    return newColumn;
  }

  componentDidMount() {
    this.addDeleteButton();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.assetsList.length !== this.props.assetsList.length) {
      this.addDeleteButton();
    }
  }

  onSortClick(columnKey) {
    // const prevColumnKey = this.state.sortState.columnKey;
    const columns = [...this.state.tableColumns];
    const column = this.state.tableColumns.find(col => (col.key === columnKey));
    let newDirection;

    if (this.state.sortState.columnKey === columnKey) {
      newDirection = this.state.sortState.direction === 'descending' ? 'ascending' : 'descending';
      column.sortDirection = newDirection;

      // then we want to make the appropriate API call
    } else {
      // is this the best way to do a line break?
      const oldColumn = this.state.tableColumns.find(col =>
        (col.key === this.state.sortState.columnKey));

      // can we have a better way to do this that's less ambiguous than relying on the default?
      oldColumn.sortDirection = '';
      newDirection = 'ascending';
      column.sortDirection = newDirection;

      // then we want to make the appropriate API call
      // who should handle this? AssetsTable? What happens if a user has a filter selected and a sort? Does this integrate
      // with what's happening in AssetsPage? I need to look into this further.
    }

    this.setState({
      sortState: {
        columnKey,
        direction: newDirection,
      },
      tableColumns: columns,
    });
  }

  onDeleteClick(assetId) {
    const assetToDelete = this.state.displayAssetsList.find(asset => (asset.id === assetId));

    this.setState({
      modalOpen: true,
      assetToDelete,
      elementToFocusOnModalClose: this.trashcanRefs[assetId],
    });
  }

  addDeleteButton() {
    const newAssetsList = this.props.assetsList.map((asset) => {
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

    this.setState({
      displayAssetsList: newAssetsList,
    });
  }

  closeModal() {
    this.setState({ modalOpen: false });
    this.state.elementToFocusOnModalClose.focus();
  }

  deleteAsset() {
    this.props.deleteAsset(this.props.assetsParameters, this.state.assetToDelete.id);
    this.setState({ modalOpen: false });

    // TODO shift focus to banner, something like:
    // this.setState({
    //  elementToFocusOnModalClose: <alertStatus>
    // })
    // this.state.elementToFocusOnModalClose.focus();
  }

  getSortIcon(sortDirection) {
    let sortIconClassName = '';

    switch (sortDirection) {
      case 'ascending':
        sortIconClassName = 'fa-sort-asc';
        break;
      case 'descending':
        sortIconClassName = 'fa-sort-desc';
        break;
      default:
        sortIconClassName = 'fa-sort';
        break;
    }

    return (<span
      className={classNames(FontAwesomeStyles.fa, FontAwesomeStyles[sortIconClassName])}
    />);
  }

  renderTableColumnButton(column) {
    return (column.sortable ?
      <Button
        // LINE BREAK?
        display={<span> <span> {column.label} </span> {this.getSortIcon(column.sortDirection)} </span>}
        buttonType="light"
        onClick={() => this.onSortClick(column.key)}
      /> :
      <Button
        display={column.label}
        buttonType="light"
      />
    );
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
          columns={this.state.tableColumns.map(column => (
            this.addTableColumnButton(column)
          ))}
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
  deleteAsset: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  assetsList: state.assets.list,
  assetsParameters: state.assets.parameters,
  assetsStatus: state.assets.status,
});

const mapDispatchToProps = dispatch => ({
  deleteAsset: (assetsParameters, assetId) => dispatch(deleteAsset(assetsParameters, assetId)),
});

const WrappedAssetsTable = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssetsTable);

export default WrappedAssetsTable;
