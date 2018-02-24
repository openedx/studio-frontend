import React from 'react';
import PropTypes from 'prop-types';

import { assetActions } from '../../data/constants/actionTypes';
import { hasSearchOrFilterApplied } from '../../utils/getAssetsFilters';
import edxBootstrap from '../../SFE.scss';
import WrappedAssetsDropZone from '../AssetsDropZone/container';
import WrappedAssetsTable from '../AssetsTable/container';
import WrappedAssetsFilters from '../AssetsFilters/container';
import WrappedAssetsImagePreviewFilter from '../AssetsImagePreviewFilter/container';
import WrappedPagination from '../Pagination/container';
import WrappedAssetsSearch from '../AssetsSearch/container';
import WrappedAssetsStatusAlert from '../AssetsStatusAlert/container';
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

    this.statusAlertRef = null;
    this.deleteButtonRefs = {};

    this.getNextFocusElementOnDelete = this.getNextFocusElementOnDelete.bind(this);
    this.onDeleteStatusAlertClose = this.onDeleteStatusAlertClose.bind(this);
  }

  componentDidMount() {
    if (this.props.assetsList.length === 0) {
      this.props.getAssets({}, this.props.courseDetails);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      pageType: this.getPageType(nextProps),
    });
  }

  onDeleteStatusAlertClose = () => {
    this.props.clearAssetDeletion();

    // do not attempt to focus if there are no assets delete buttons to focus on
    // TO-DO: determine where the focus should go when the last asset is deleted
    if (this.props.assetsList.length > 0) {
      const focusElement = this.getNextFocusElementOnDelete();
      focusElement.focus();
    }
  }

  getNextFocusElementOnDelete() {
    const { deletedAssetIndex, assetsList } = this.props;

    const focusAsset = assetsList[deletedAssetIndex];
    return this.deleteButtonRefs[focusAsset.id];
  }

  getPageType = (props) => {
    const numberOfAssets = props.assetsList.length;
    const filters = props.filtersMetadata.assetTypes;
    const search = props.searchMetadata.search;

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
        <div className={edxBootstrap['page-header']}>
          <WrappedAssetsImagePreviewFilter />
        </div>
        { this.renderAssetsFilters() }
      </div>
      <div className={edxBootstrap['col-10']}>
        <div className={edxBootstrap.row}>
          <div className={`${edxBootstrap['col-md-8']}`}>
            <WrappedAssetsResultsCount />
          </div>
          <div className={`${edxBootstrap['col-md-4']} ${edxBootstrap['text-right']}`}>
            {hasSearchOrFilterApplied(this.props.filtersMetadata.assetTypes,
              this.props.searchMetadata.search) &&
              <WrappedAssetsClearFiltersButton />
            }
          </div>
        </div>
        <div className={edxBootstrap.row}>
          <div className={edxBootstrap.col}>
            <WrappedAssetsTable
              deleteButtonRefs={(button, asset) => { this.deleteButtonRefs[asset.id] = button; }}
            />
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
    <React.Fragment>
      <WrappedMessage message={messages.assetsPageNoAssetsNumFiles} tagName="h3" />
      <WrappedMessage message={messages.assetsPageNoAssetsMessage} tagName="h4" />
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

  renderNoResultsBody = () => (
    <React.Fragment>
      <WrappedMessage message={messages.assetsPageNoResultsCountFiles} tagName="h3" />
      <WrappedMessage message={messages.assetsPageNoResultsMessage} tagName="h4" />
      <WrappedAssetsClearFiltersButton />
    </React.Fragment>
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
      <React.Fragment>
        <div className={edxBootstrap.container}>
          <div className={edxBootstrap.row}>
            <div className={edxBootstrap['col-12']}>
              <WrappedAssetsStatusAlert
                statusAlertRef={(input) => { this.statusAlertRef = input; }}
                onDeleteStatusAlertClose={this.onDeleteStatusAlertClose}
                onClose={this.onStatusAlertClose}
              />
            </div>
          </div>
          {this.props.searchSettings.enabled &&
            <div className={edxBootstrap.row}>
              <div className={edxBootstrap['col-12']}>
                {this.state.pageType === types.NORMAL &&
                  <WrappedAssetsSearch />
                }
              </div>
            </div>
          }
          <div className={edxBootstrap.row}>
            { this.getPage(this.state.pageType) }
          </div>
        </div>
      </React.Fragment>
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
  deletedAssetIndex: PropTypes.oneOfType([
    PropTypes.number,
  ]),
  // eslint-disable-next-line react/no-unused-prop-types
  filtersMetadata: PropTypes.shape({
    assetTypes: PropTypes.object,
  }).isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  searchMetadata: PropTypes.shape({
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
  clearAssetDeletion: PropTypes.func.isRequired,
};

AssetsPage.defaultProps = {
  deletedAssetIndex: null,
};
