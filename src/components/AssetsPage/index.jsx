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

export class AssetsPage extends React.Component {
  constructor(props) {
    super(props);

    const hasAssets = this.hasAssets(props.assetsList);

    this.state = {
      checked: false,
      hasAssets,
    };
  }

  componentDidMount() {
    this.props.getAssets(this.props.request, this.props.courseDetails);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.hasAssets && this.hasNoAssets(nextProps.assetsList)) {
      this.setState({
        hasAssets: false,
      });
    } else if (!this.state.hasAssets && this.hasAssets(nextProps.assetsList)) {
      this.setState({
        hasAssets: true,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.request) !== JSON.stringify(this.props.request)) {
      this.props.getAssets(this.props.request, this.props.courseDetails);
    }
  }

  hasNoAssets = assetsList => (
    assetsList.length === 0
  )

  hasAssets = assetsList => (
    assetsList.length > 0
  )

  handleCheckBoxChange = (checked) => {
    this.setState({
      checked,
    });
  }

  renderAssetsDropZone = () => (
    <WrappedAssetsDropZone
      maxFileSizeMB={this.props.uploadSettings.max_file_size_in_mbs}
    />
  )

  renderAssetsPage = () => (
    <React.Fragment>
      <div className={edxBootstrap.col}>
        { this.renderAssetsDropZone() }
        <WrappedAssetsFilters />
      </div>
      <div className={edxBootstrap['col-10']}>
        <WrappedAssetsTable />
        <WrappedPagination />
      </div>
    </React.Fragment>
  )

  renderNoAssetsPage = () => (
    <React.Fragment>
      <div className={edxBootstrap.col}>
        { this.renderAssetsDropZone() }
      </div>
      <div className={edxBootstrap['col-10']}>
        { !this.state.hasAssets && this.renderNoAssetsBody() }
      </div>
    </React.Fragment>
  )

  renderNoAssetsBody = () => (
    <React.Fragment>
      <h3>0 files in your course</h3>
      <h4>Enhance your course content by uploading files such as images and documents.</h4>
    </React.Fragment>
  )

  render() {
    return (
      <div className={styles.assets}>
        <div className={edxBootstrap.container}>
          <div className={edxBootstrap.row}>
            { this.state.hasAssets ? this.renderAssetsPage() : this.renderNoAssetsPage() }
          </div>
        </div>
      </div>
    );
  }
}

AssetsPage.propTypes = {
  assetsList: PropTypes.arrayOf(PropTypes.object).isRequired,
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
  assetsList: state.assets,
});

const mapDispatchToProps = dispatch => ({
  getAssets: (request, courseDetails) => dispatch(getAssets(request, courseDetails)),
});

const WrappedAssetsPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssetsPage);

export default WrappedAssetsPage;
