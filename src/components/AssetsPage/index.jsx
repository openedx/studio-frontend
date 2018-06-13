import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

import { getPageType, pageTypes } from '../../utils/getAssetsPageType';
import { hasSearchOrFilterApplied } from '../../utils/getAssetsFilters';
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
import styles from './AssetsPage.scss';

export const TABLE_CONTENTS_ID = 'table-contents';

export default class AssetsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pageType: pageTypes.SKELETON,
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
    this.setState(state => ({
      pageType: getPageType(nextProps, state.pageType),
    }));
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

  getPage = (type) => {
    switch (type) {
      case pageTypes.NORMAL:
        return this.renderAssetsPage();
      case pageTypes.NO_ASSETS:
        return this.renderNoAssetsPage();
      case pageTypes.NO_RESULTS:
        return this.renderNoResultsPage();
      case pageTypes.SKELETON:
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
      <div className="row">
        <div className="col-10 offset-2">
          <div className="row">
            <div className="col-md-8">
              <div aria-hidden>
                <WrappedAssetsResultsCount />
              </div>
            </div>
            <div className="col-md-4 text-right">
              {hasSearchOrFilterApplied(this.props.filtersMetadata.assetTypes,
                this.props.searchMetadata.search) &&
                <WrappedAssetsClearFiltersButton className="p-3" />
              }
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <a
            className={classNames('sr-only', 'sr-only-focusable', styles['skip-link'])}
            href={`#${TABLE_CONTENTS_ID}`}
          >
            <WrappedMessage message={messages.assetsPageSkipLink} />
          </a>
          {this.renderAssetsDropZone()}
          <div className="page-header">
            <WrappedAssetsImagePreviewFilter />
          </div>
          {this.renderAssetsFilters()}
        </div>
        <div className="col-10" id={TABLE_CONTENTS_ID} tabIndex="-1">
          <div className="row">
            <WrappedAssetsTable
              deleteButtonRefs={(button, asset) => { this.deleteButtonRefs[asset.id] = button; }}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-10 offset-2">
          <WrappedPagination />
        </div>
      </div>
    </React.Fragment>
  );

  renderNoAssetsBody = () => (
    <WrappedMessage message={messages.assetsPageNoAssetsMessage} tagName="h3" />
  );

  renderNoAssetsPage = () => (
    <div className="row">
      <div className="col">
        {this.renderAssetsDropZone()}
      </div>
      <div className="col-10">
        {this.renderNoAssetsBody()}
      </div>
    </div>
  );

  renderNoResultsBody = () => (
    <React.Fragment>
      <WrappedMessage message={messages.assetsPageNoResultsMessage} tagName="h3" />
      <WrappedAssetsClearFiltersButton />
    </React.Fragment>
  );

  renderNoResultsPage = () => (
    <div className="row">
      <div className="col">
        {this.renderAssetsDropZone()}
        {this.renderAssetsFilters()}
      </div>
      <div className="col-10">
        {this.renderNoResultsBody()}
      </div>
    </div>
  );

  renderSkeletonPage = () => (
    <div className="row">
      <div className="col-2">
        {this.renderAssetsDropZone()}
        {this.renderAssetsFilters()}
      </div>
    </div>
  );

  render() {
    return (
      <React.Fragment>
        <div
          aria-atomic
          aria-live="polite"
          aria-relevant="text"
          className="sr-only"
        >
          <WrappedAssetsResultsCount />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <WrappedAssetsStatusAlert
                statusAlertRef={(input) => { this.statusAlertRef = input; }}
                onDeleteStatusAlertClose={this.onDeleteStatusAlertClose}
                onClose={this.onStatusAlertClose}
              />
            </div>
          </div>
          {(this.state.pageType === pageTypes.NORMAL ||
            this.state.pageType === pageTypes.NO_RESULTS) && (
            <div className="row">
              <div className="col-12 p-0">
                <WrappedAssetsSearch />
              </div>
            </div>
          )}
          {this.getPage(this.state.pageType)}
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
  clearAssetDeletion: PropTypes.func.isRequired,
};

AssetsPage.defaultProps = {
  deletedAssetIndex: null,
};
