import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import WrappedAssetsTable from './AssetsTable';
import WrappedAssetsFilters from './AssetsFilters';

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
    if (prevProps.assetsParameters !== this.props.assetsParameters) {
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
        <WrappedAssetsFilters />
        <WrappedAssetsTable />
      </div>
    );
  }
}

AssetsPage.propTypes = {
  assetsParameters: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool, PropTypes.object]),
  ).isRequired,
  getAssets: PropTypes.func.isRequired,
};

const WrappedAssetsPage = connect(
  state => ({
    assetsParameters: state.assets.parameters,
  }), dispatch => ({
    getAssets: assetsParameters => dispatch(getAssets(assetsParameters)),
  }),
)(AssetsPage);

export default WrappedAssetsPage;
