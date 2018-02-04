import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from '@edx/paragon';

import { assetActions } from '../../data/constants/actionTypes';
import { getAssets, clearFilters } from '../../data/actions/assets';
import { hasSelectedFilters, getSelectedFilters } from '../../utils/getAssetsFilters';
import edxBootstrap from '../../SFE.scss';
import styles from './AssetsPage.scss';
import WrappedAssetsDropZone from '../AssetsDropZone';
import WrappedAssetsTable from '../AssetsTable';
import WrappedAssetsFilters from '../AssetsFilters';
import WrappedPagination from '../Pagination';

export const types = {
  NO_ASSETS: 'noAssets',
  NO_RESULTS: 'noResults',
  NORMAL: 'normal',
  SKELETON: 'skeleton',
};

export class AssetsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pageType: types.SKELETON,
    };
  }

  componentDidMount() {
    this.props.getAssets(this.props.request, this.props.courseDetails);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      pageType: this.getPageType(nextProps),
    });
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.request) !== JSON.stringify(this.props.request)) {
      this.props.getAssets(this.props.request, this.props.courseDetails);
    }
  }

  getPageType = (props) => {
    const numberOfAssets = props.assetsList.length;

    if ('type' in props.status && props.status.type === assetActions.request.REQUESTING_ASSETS) {
      return this.state.pageType;
    } else if (numberOfAssets > 0) {
      return types.NORMAL;
    } else if (numberOfAssets === 0 && hasSelectedFilters(props.filtersMetaData.assetTypes)) {
      return types.NO_RESULTS;
    }
    return types.NO_ASSETS;
  }

  getPage = (type) => {
    switch (type) {
      case types.NORMAL:
        return this.renderAssetsPage();
      case types.NO_ASSETS:
        return this.renderNoAssetsPage();
      case types.NO_RESULTS:
        return this.renderNoResultsPage();
      case types.SKELETON:
        return this.renderSkeletonPage();
      default:
        throw new Error(`Unknown pageType ${type}.`);
    }
  }

  renderAssetsDropZone = () => (
    <WrappedAssetsDropZone
      maxFileSizeMB={this.props.uploadSettings.max_file_size_in_mbs}
    />
  );

  renderAssetsFilters = () => (
    <WrappedAssetsFilters />
  );

  renderAssetsPage = () => (
    <React.Fragment>
      <div className={edxBootstrap.col}>
        { this.renderAssetsDropZone() }
        { this.renderAssetsFilters() }
      </div>
      <div className={edxBootstrap['col-10']}>
        <WrappedAssetsTable />
        <WrappedPagination />
      </div>
    </React.Fragment>
  );

  renderNoAssetsBody = () => (
    <React.Fragment>
      <h3>0 files in your course</h3>
      <h4>Enhance your course content by uploading files such as images and documents.</h4>
    </React.Fragment>
  );

  renderNoAssetsPage = () => (
    <React.Fragment>
      <div className={edxBootstrap.col}>
        { this.renderAssetsDropZone() }
      </div>
      <div className={edxBootstrap['col-10']}>
        { this.renderNoAssetsBody() }
      </div>
    </React.Fragment>
  );

  renderNoResultsBody = () => {
    const numberOfSelectedFilters =
      getSelectedFilters(this.props.filtersMetaData.assetTypes).length;

    return (<React.Fragment>
      <h3>0 files</h3>
      <h4>{ numberOfSelectedFilters > 1 ? 'No files were found for these filters.' : 'No files were found for this filter.'}</h4>
      <Button
        buttonType="link"
        onClick={this.props.clearFilters}
        label={numberOfSelectedFilters > 1 ? 'Clear all filters' : 'Clear filter'}
      />
    </React.Fragment>);
  };

  renderNoResultsPage = () => (
    <React.Fragment>
      <div className={edxBootstrap.col}>
        { this.renderAssetsDropZone() }
        { this.renderAssetsFilters() }
      </div>
      <div className={edxBootstrap['col-10']}>
        { this.renderNoResultsBody() }
      </div>
    </React.Fragment>
  );

  renderSkeletonPage = () => (
    <div className={edxBootstrap['col-2']}>
      { this.renderAssetsDropZone() }
      { this.renderAssetsFilters() }
    </div>
  );

  render() {
    return (
      <div className={styles.assets}>
        <div className={edxBootstrap.container}>
          <div className={edxBootstrap.row}>
            { this.getPage(this.state.pageType) }
          </div>
        </div>
      </div>
    );
  }
}

AssetsPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  assetsList: PropTypes.arrayOf(PropTypes.object).isRequired,
  clearFilters: PropTypes.func.isRequired,
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
  filtersMetaData: PropTypes.shape({
    assetTypes: PropTypes.object,
  }).isRequired,
  getAssets: PropTypes.func.isRequired,
  request: PropTypes.shape({
    sort: PropTypes.string,
    direction: PropTypes.string,
    assetTypes: PropTypes.object,
    page: PropTypes.number,
  }).isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  status: PropTypes.shape({
    type: PropTypes.string,
    response: PropTypes.object,
  }).isRequired,
  uploadSettings: PropTypes.shape({
    max_file_size_in_mbs: PropTypes.number,
  }).isRequired,
};

const mapStateToProps = state => ({
  assetsList: state.assets,
  courseDetails: state.studioDetails.course,
  request: state.request,
  uploadSettings: state.studioDetails.upload_settings,
  status: state.metadata.status,
  filtersMetaData: state.metadata.filters,
});

export const mapDispatchToProps = dispatch => ({
  clearFilters: () => dispatch(clearFilters()),
  getAssets: (request, courseDetails) => dispatch(getAssets(request, courseDetails)),
});

const WrappedAssetsPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssetsPage);

export default WrappedAssetsPage;
