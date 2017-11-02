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
    this.props.getAssets(this.props.assetsParameters, this.props.courseDetails);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.assetsParameters !== this.props.assetsParameters ||
      prevProps.courseDetails !== this.props.courseDetails) {
      // if filters or course details are changed, update the assetsList
      // TODO: consider using the reselect library for this
      this.props.getAssets(this.props.assetsParameters, this.props.courseDetails);
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
  courseDetails: PropTypes.shape({
    lang: PropTypes.string,
    url_name: PropTypes.string,
    name: PropTypes.string,
    display_course_number: PropTypes.string,
    num: PropTypes.string,
    org: PropTypes.string,
    id: PropTypes.string,
    revision: PropTypes.string,
  }).isRequired,
};

const WrappedAssetsPage = connect(
  state => ({
    assetsParameters: state.assets.parameters,
    courseDetails: state.courseDetails,
  }), dispatch => ({
    getAssets: (assetsParameters, courseDetails) =>
      dispatch(getAssets(assetsParameters, courseDetails)),
  }),
)(AssetsPage);

export default WrappedAssetsPage;
