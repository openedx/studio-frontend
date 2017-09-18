import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AssetsTable from './AssetsTable';
import AssetsFilters from './AssetsFilters';

import { requestAssets } from '../data/actions/assets';
import styles from './styles.scss';

class AssetsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
  }

  componentDidMount() {
    this.props.requestAssets(this.props.assetsFilters);
  }

  componentDidUpdate(prevProps) {
    // if filters changed, update the assetsList
    if (prevProps.assetsFilters !== this.props.assetsFilters) {
      this.props.requestAssets(this.props.assetsFilters);
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
        <AssetsFilters
          assetTypes={[
            {
              key: 'images',
              displayName: 'Images',
            },
            {
              key: 'documents',
              displayName: 'Documents',
            },
            {
              key: 'other',
              displayName: 'Other',
            },
          ]}
        />
        <AssetsTable
          assetsList={this.props.assetsList}
        />
      </div>
    );
  }
}

AssetsPage.propTypes = {
  assetsList: PropTypes.arrayOf(PropTypes.object).isRequired,
  assetsFilters: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  ).isRequired,
  requestAssets: PropTypes.func.isRequired,
};

const WrappedAssetsPage = connect(
  state => ({
    assetsList: state.assetsList,
    assetsFilters: state.assetsFilters,
  }), dispatch => ({
    requestAssets: courseId => dispatch(requestAssets(courseId)),
  }),
)(AssetsPage);

export default WrappedAssetsPage;
