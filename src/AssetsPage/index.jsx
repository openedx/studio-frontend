import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import WrappedAssetsTable from './AssetsTable';
import AssetsFilters from './AssetsFilters';

import { getAssets } from '../data/actions/assets';
import styles from './styles.scss';

class AssetsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
  }

  componentDidMount() {
    this.props.getAssets(this.props.assetsParameters);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.assetsParameters.assetTypes !== this.props.assetsParameters.assetTypes) {
      // if filters changed, update the assetsList
      // TODO: consider using the reselect library for this
      this.props.getAssets(this.props.assetsParameters);
    }
  }

  handleCheckBoxChange = (checked) => {
    this.setState({
      checked,
    });
  }

  render() {
    return (
      <div className={styles.assets}>
        <h2>Files & Uploads</h2>
        <AssetsFilters />
        <WrappedAssetsTable
          assetsList={this.props.assetsList}
        />
      </div>
    );
  }
}

AssetsPage.propTypes = {
  assetsList: PropTypes.arrayOf(PropTypes.object).isRequired,
  assetsParameters: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool, PropTypes.object]),
  ).isRequired,
  getAssets: PropTypes.func.isRequired,
};

const WrappedAssetsPage = connect(
  state => ({
    assetsList: state.assets.list,
    assetsParameters: state.assets.parameters,
  }), dispatch => ({
    getAssets: assetsParameters => dispatch(getAssets(assetsParameters)),
  }),
)(AssetsPage);

export default WrappedAssetsPage;
