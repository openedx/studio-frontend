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
      tableColumns: {
        display_name: {
          label: 'Name',
          key: 'display_name',
          sortable: true,
          // redundancy :(
          sortDirection: 'none',
        },
        content_type: {
          label: 'Type',
          key: 'content_type',
          sortable: true,
          sortDirection: 'none',
        },
        date_added: {
          label: 'Date Added',
          key: 'date_added',
          sortable: true,
          sortDirection: 'desc',
        },
        delete_asset: {
          label: 'Delete Asset',
          key: 'delete_asset',
          sortable: false,
        },
      },
    };

    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.deleteAsset = this.deleteAsset.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.getSortIcon = this.getSortIcon.bind(this);
    this.renderTableColumnButton = this.renderTableColumnButton.bind(this);
    this.addTableColumnButton = this.addTableColumnButton.bind(this);
    this.onSortClick = this.onSortClick.bind(this);

    this.trashcanRefs = {};
  }

  // componentDidMount() {
    //moved this logic into componentWillReceiveProps, but I worry this will cause two renders?
  // }

  // componentWillReceiveProps(nextProps) {
    // const x = this.addDeleteButton(nextProps.assetsList);

    // this.setState({
    //   displayAssetsList: x,
    // });
  // }

  // componentDidUpdate(prevProps) {
    // if (prevProps.assetsList.length !== this.props.assetsList.length) {
    //   this.addDeleteButton(this.props.assetsList);
    // }
    // else if (prevProps.assetsParameters !== this.props.assetsParameters) {
    //   this.addDeleteButton(this.props.assetsList);
    // }
  // }

  onSortClick(columnKey) {
    const columns = this.state.tableColumns;
    const column = columns[columnKey];
    const sortedColumn = this.props.assetsParameters.sort;
    const sortedDirection = this.props.assetsParameters.direction;

    let newDirection = '';

    if (sortedColumn === columnKey) {
      newDirection = sortedDirection === 'desc' ? 'asc' : 'desc';
      column.sortDirection = newDirection;
    } else {
      const oldColumn = this.state.tableColumns[sortedColumn];

      // can we have a better way to do this that's less ambiguous than relying on the default?
      oldColumn.sortDirection = '';
      newDirection = 'asc';
      column.sortDirection = newDirection;
    }

    this.setState({
      tableColumns: columns,
    });

    this.props.updateSort(column.key, newDirection);
  }

  onDeleteClick(assetId) {
    const assetToDelete = this.state.displayAssetsList.find(asset => (asset.id === assetId));

    this.setState({
      modalOpen: true,
      assetToDelete,
      elementToFocusOnModalClose: this.trashcanRefs[assetId],
    });
  }

  getSortIcon(sortDirection) {
    let sortIconClassName = '';

    switch (sortDirection) {
      case 'asc':
        sortIconClassName = 'fa-sort-asc';
        break;
      case 'desc':
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

  addTableColumnButton(column) {
    const newColumn = Object.assign({}, column);
    const columnButton = this.renderTableColumnButton(newColumn);
    newColumn.label = columnButton;
    return newColumn;
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

    // TODO shift focus to banner, something like:
    // this.setState({
    //  elementToFocusOnModalClose: <alertStatus>
    // })
    // this.state.elementToFocusOnModalClose.focus();
  }

  renderTableColumnButton(column) {
    return (column.sortable ?
      <Button
        display={<span> {column.label} {this.getSortIcon(column.sortDirection)} </span>}
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
          columns={Object.keys(this.state.tableColumns).map(columnKey => (
            this.addTableColumnButton(this.state.tableColumns[columnKey])
          ))}
          data={this.addDeleteButton(this.props.assetsList)}
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
