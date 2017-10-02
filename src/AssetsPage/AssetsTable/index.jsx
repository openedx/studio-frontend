import React from 'react';
import PropTypes from 'prop-types';
import Table from 'paragon/src/Table';
import Button from 'paragon/src/Button';

import styles from '../styles.scss';

class AssetsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      finalAssetsList: [],
    };
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {
    if (prevProps.assetsList.length !== this.props.assetsList.length) {
      this.addDeleteButton();
    }
  }

  addDeleteButton() {
    const newAssetsList = this.props.assetsList.map((asset) => {
      const currentAsset = Object.assign({}, asset);
      const deleteButton = (<Button
        className={['fa', 'fa-trash', styles.icon]}
        display={''}
        buttonType={'link'}
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
