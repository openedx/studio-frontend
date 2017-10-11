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
    };

    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.deleteAsset = this.deleteAsset.bind(this);
    this.addDeleteButton = this.addDeleteButton.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.trashcanRefs = {};
  }

  componentDidMount() {
    this.addDeleteButton();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.assetsList.length !== this.props.assetsList.length) {
      this.addDeleteButton();
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
