import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@edx/paragon';

import { assetActions } from '../../data/constants/actionTypes';
import { hasSelectedFilters } from '../../utils/getAssetsFilters';
import edxBootstrap from '../../SFE.scss';
import styles from './AssetsPage.scss';
import WrappedAssetsDropZone from '../AssetsDropZone/container';
import WrappedAssetsTable from '../AssetsTable/container';
import WrappedAssetsFilters from '../AssetsFilters/container';
import WrappedPagination from '../Pagination/container';
import WrappedAssetsSearch from '../AssetsSearch/container';
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

    this.onClearFiltersButtonClick = this.onClearFiltersButtonClick.bind(this);
  }

  componentDidMount() {
    this.props.getAssets({}, this.props.courseDetails);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      pageType: this.getPageType(nextProps),
    });
  }

  onClearFiltersButtonClick = () => {
    this.props.clearFilters(this.props.courseDetails);
  }

  getPageType = (props) => {
    const numberOfAssets = props.assetsList.length;

    if ('type' in props.status && props.status.type === assetActions.request.REQUESTING_ASSETS) {
      return this.state.pageType;
    } else if (numberOfAssets > 0) {
      return types.NORMAL;
    } else if (numberOfAssets === 0 &&
               (hasSelectedFilters(props.filtersMetaData.assetTypes) ||
                (props.searchMetaData.search && props.searchMetaData.search.length > 0))) {
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
        { this.renderNoAssetsBody() }
      </div>
    </React.Fragment>
  );

  renderNoResultsBody = () => (
    <div>
      <WrappedMessage message={messages.assetsPageNoResultsNumFiles} tagName="h3" />
      <WrappedMessage message={messages.assetsPageNoResultsMessage} tagName="h4" />
      <Button
        buttonType="link"
        onClick={this.onClearFiltersButtonClick}
        label={
          <WrappedMessage message={messages.assetsPageNoResultsClear} />
        }
      />
    </div>
  );

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
          {this.props.searchSettings.enabled &&
            <div className={edxBootstrap.row}>
              <div className={`${edxBootstrap['col-md-3']} ${edxBootstrap['offset-md-9']}`}>
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
