import React from 'react';
import PropTypes from 'prop-types';
import Table from 'paragon/src/Table';
import Button from 'paragon/src/Button';

import FontAwesomeStyles from 'font-awesome/css/font-awesome.min.css';

class AssetsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      finalAssetsList: [],
    };

    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.addDeleteButton = this.addDeleteButton.bind(this);
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {
    if (prevProps.assetsList.length !== this.props.assetsList.length) {
      this.addDeleteButton();
    }
  }

  onDeleteClick() {
    this.setState({
      // TODO: Update application state for Modal and delete logic
    });
  }

  addDeleteButton() {
    const newAssetsList = this.props.assetsList.map((asset) => {
      const currentAsset = Object.assign({}, asset);
      const deleteButton = (<Button
        className={[FontAwesomeStyles.fa, FontAwesomeStyles['fa-trash']]}
        display={''}
        buttonType={'light'}
        aria-label={`Delete current asset named ${currentAsset.display_name}`}
        onClick={this.onDeleteClick}
      />);

      currentAsset.delete_asset = deleteButton;
      return currentAsset;
    });

    this.setState({
      finalAssetsList: newAssetsList,
    });
  }

  render() {
    return (!this.props.assetsList.length) ? (
      <span>Loading....</span>
    ) : (
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
        data={this.state.finalAssetsList}
      />
    );
  }
}

AssetsTable.propTypes = {
  assetsList: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default AssetsTable;
