import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import WrappedAssetsDropZone from '../AssetsDropZone';
import WrappedAssetsTable from '../AssetsTable';
import WrappedAssetsFilters from '../AssetsFilters';
import WrappedPagination from '../Pagination';

import { getAssets } from '../../data/actions/assets';
import edxBootstrap from '../../SFE.scss';
import styles from './AssetsPage.scss';

class AssetsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
  }

  componentDidMount() {
    this.props.getAssets(this.props.request, this.props.courseDetails);
  }

  componentDidUpdate() {
    this.props.getAssets(this.props.request, this.props.courseDetails);
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
        <div className={edxBootstrap.container}>
          <div className={edxBootstrap.row}>
            <div className={edxBootstrap.col}>
              <WrappedAssetsDropZone
                maxFileSizeMB={this.props.uploadSettings.max_file_size_in_mbs}
              />
              <WrappedAssetsFilters />
            </div>
            <div className={edxBootstrap['col-10']}>
              <WrappedAssetsTable />
              <WrappedPagination />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AssetsPage.propTypes = {
  request: PropTypes.shape({
    sort: PropTypes.string,
    direction: PropTypes.string,
    assetTypes: PropTypes.object,
    page: PropTypes.number,
  }).isRequired,
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
  uploadSettings: PropTypes.shape({
    max_file_size_in_mbs: PropTypes.number,
  }).isRequired,
};

const mapStateToProps = state => ({
  courseDetails: state.studioDetails.course,
  uploadSettings: state.studioDetails.upload_settings,
  request: state.request,
});

const mapDispatchToProps = dispatch => ({
  getAssets: (request, courseDetails) => dispatch(getAssets(request, courseDetails)),
});

const WrappedAssetsPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssetsPage);

export default WrappedAssetsPage;
