import React from 'react';
import PropTypes from 'prop-types';

import { assetActions } from '../../data/constants/actionTypes';
import { hasSearchOrFilterApplied } from '../../utils/getAssetsFilters';
import edxBootstrap from '../../SFE.scss';
import styles from './AssetsPage.scss';
import WrappedAssetsDropZone from '../AssetsDropZone/container';
import WrappedAssetsTable from '../AssetsTable/container';
import WrappedAssetsFilters from '../AssetsFilters/container';
import WrappedPagination from '../Pagination/container';
import WrappedAssetsSearch from '../AssetsSearch/container';
import WrappedAssetsResultsCount from '../AssetsResultsCount/container';
import WrappedAssetsClearFiltersButton from '../AssetsClearFiltersButton/container';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';
import messages from './displayMessages';

export const types = {
  NO_ASSETS: 'noAssets',
  NO_RESULTS: 'noResults',
  NORMAL: 'normal',
  SKELETON: 'skeleton',
};

export default class AssetsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pageType: types.SKELETON,
    };
  }

  componentDidMount() {
    this.props.getAssets({}, this.props.courseDetails);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      pageType: this.getPageType(nextProps),
    });
  }

  getPageType = (props) => {
    const numberOfAssets = props.assetsList.length;
    const filters = props.filtersMetaData.assetTypes;
    const search = props.searchMetaData.search;

    if ('type' in props.status && props.status.type === assetActions.request.REQUESTING_ASSETS) {
      return this.state.pageType;
    } else if (numberOfAssets > 0) {
      return types.NORMAL;
    } else if (numberOfAssets === 0 && hasSearchOrFilterApplied(filters, search)) {
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
        {this.props.searchSettings.enabled &&
          <React.Fragment>
            <div className={edxBootstrap.row}>
              <div className={`${edxBootstrap['col-md-8']}`}>
                <WrappedAssetsResultsCount />
              </div>
              <div className={`${edxBootstrap['col-md-4']} ${edxBootstrap['text-right']}`}>
                {hasSearchOrFilterApplied(this.props.filtersMetaData.assetTypes,
                  this.props.searchMetaData.search) &&
                  <WrappedAssetsClearFiltersButton />
                }
              </div>
            </div>
          </React.Fragment>
        }
        <div className={edxBootstrap.row}>
          <div className={edxBootstrap.col}>
            <WrappedAssetsTable />
          </div>
        </div>
        <div className={edxBootstrap.row}>
          <div className={edxBootstrap.col}>
            <WrappedPagination />
          </div>
        </div>
      </div>
    </React.Fragment>
  );

  renderNoAssetsBody = () => (
    <div>
      <WrappedMessage message={messages.assetsPageNoAssetsNumFiles} tagName="h3" />
      <WrappedMessage message={messages.assetsPageNoAssetsMessage} tagName="h4" />
    </div>
  );

  renderNoAssetsPage = () => (
    <React.Fragment>
      <div className={edxBootstrap.col}>
        { this.renderAssetsDropZone() }
      </div>
      <div className={edxBootstrap['col-10']}>
        <div className={edxBootstrap.row}>
          { this.renderNoAssetsBody() }
        </div>
      </div>
    </React.Fragment>
  );

  renderNoResultsBody = () => (
    <div>
      <WrappedMessage message={messages.assetsPageNoResultsNumFiles} tagName="h3" />
      <WrappedMessage message={messages.assetsPageNoResultsMessage} tagName="h4" />
      <WrappedAssetsClearFiltersButton />
    </div>
  );

  renderNoResultsPage = () => (
    <React.Fragment>
      <div className={edxBootstrap.col}>
        { this.renderAssetsDropZone() }
        { this.renderAssetsFilters() }
      </div>
      <div className={edxBootstrap['col-10']}>
        <div className={edxBootstrap.row}>
          { this.renderNoResultsBody() }
        </div>
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
          {this.props.searchSettings.enabled &&
            <div className={edxBootstrap.row}>
              <div className={edxBootstrap['col-12']}>
                <WrappedAssetsSearch />
              </div>
            </div>
          }
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
  // eslint-disable-next-line react/no-unused-prop-types
  filtersMetaData: PropTypes.shape({
    assetTypes: PropTypes.object,
  }).isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  searchMetaData: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
  getAssets: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  status: PropTypes.shape({
    type: PropTypes.string,
    response: PropTypes.object,
  }).isRequired,
  uploadSettings: PropTypes.shape({
    max_file_size_in_mbs: PropTypes.number,
  }).isRequired,
  searchSettings: PropTypes.shape({
    enabled: PropTypes.bool,
  }).isRequired,
};
