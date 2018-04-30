import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';
import messages from './displayMessages';
import styles from './AssetsList.scss';

const initialState = {
  selectedAssetIndex: -1,
  selectedAssetPage: -1,
};

export default class AssetsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...initialState,
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.onAssetClick = this.onAssetClick.bind(this);
    this.onListBoxFocus = this.onListBoxFocus.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // if page has changed, reset the index of the selected index
    if (this.props.paginationMetadata.page !== nextProps.paginationMetadata.page) {
      if (nextProps.paginationMetadata.page === this.state.selectedAssetPage) {
        this.setState({
          selectedAssetIndex: this.getSelectedAssetIndex(nextProps.assetsList,
            nextProps.selectedAsset),
        });
      } else {
        this.setState({
          selectedAssetIndex: -1,
        });
      }
    }

    /*
      if the selectedAsset is set to empty object, reset selectedAssetIndex; this is to
      handle the case when the EditImageModal closes
    */
    if (Object.keys(this.props.selectedAsset).length !== 0 &&
      Object.keys(nextProps.selectedAsset).length === 0) {
      this.setState({
        ...initialState,
      });
    }
  }

  onAssetClick = (asset, index) => {
    this.setState({
      selectedAssetIndex: index,
      selectedAssetPage: this.props.paginationMetadata.page,
    });

    this.props.selectAsset(asset);
  }

  onListBoxFocus = () => {
    // if no list item is selected, select first item on  listbox focus
    if (this.state.selectedAssetIndex === -1) {
      this.setState(
        { selectedAssetIndex: 0,
          selectedAssetPage: this.props.paginationMetadata.page,
        },
        () => { this.props.selectAsset(this.props.assetsList[this.state.selectedAssetIndex]); },
      );
    }
  }

  getAssetsListHeader = () => (
    <div className={classNames(styles['list-header'], 'row')}>
      <span className="col-6 offset-3" data-identifier="asset-file-name" id="name-header"><WrappedMessage message={messages.assetsListNameLabel} /></span>
      <span className="col-3" data-identifier="asset-date-added" id="date-added-header"><WrappedMessage message={messages.assetsListDateLabel} /></span>
    </div>
  )

  getAssetListItem = (asset, index) => {
    const isSelected = this.props.selectedAsset.id === asset.id;

    return (
      <li
        // prevent clicking on list item from triggering parent's focus
        onMouseDown={(e) => { e.preventDefault(); this.onAssetClick(asset, index); }}
        className={classNames('list-group-item list-group-item-action', { active: isSelected })}
        id={`asset-list-option-${index}`}
        aria-selected={isSelected}
        role="option"
        key={asset.display_name}
        tabIndex="-1"
        aria-labelledby={`name-header asset-name-${index} date-added-header asset-date-${index}`}
      >
        <div className="row">
          {this.getThumbnailElement(asset.thumbnail)}
          {this.getDisplayNameElement(asset.display_name, index)}
          {this.getDateAddedElement(asset.date_added, index)}
        </div>
      </li>
    );
  }

  getDateAddedElement = (dateAdded, index) => (
    <span id={`asset-date-${index}`} className="col-3" data-identifier="asset-date-added">{dateAdded}</span>
  );

  getDisplayNameElement = (displayName, index) => (
    <span id={`asset-name-${index}`} className="col-6" data-identifier="asset-file-name">{displayName}</span>
  );

  getImageThumbnail(thumbnail) {
    const baseUrl = this.props.courseDetails.base_url || '';

    return (
      <div className={styles['assets-list-image-preview-container']}>
        {
          thumbnail ?
            <img className={styles['assets-list-image-preview-image']} src={`${baseUrl}${thumbnail}`} alt="" data-identifier="asset-image-thumbnail" /> :
            <WrappedMessage message={messages.assetsListNoPreview} >
              {displayText => <span className={classNames('text-center')} data-identifier="asset-image-thumbnail">{displayText}</span>}
            </WrappedMessage>
        }
      </div>
    );
  }

  getSelectedAssetIndex = (assetsList, selectedAsset) => (assetsList.findIndex(
    asset => asset.id === selectedAsset.id));

  getThumbnailElement = thumbnail => (
    <span aria-hidden className="col">{this.getImageThumbnail(thumbnail)}</span>
  );

  handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown': {
        // prevent scrolling entire modal body with arrow keys
        e.preventDefault();

        if (this.state.selectedAssetIndex < this.props.paginationMetadata.pageSize - 1) {
          this.setState(
            (state, props) => ({
              selectedAssetIndex: this.state.selectedAssetIndex + 1,
              selectedAssetPage: props.paginationMetadata.page,
            }),
            () => { this.props.selectAsset(this.props.assetsList[this.state.selectedAssetIndex]); },
          );
        }
        break;
      }
      case 'ArrowUp': {
        // prevent scrolling entire modal body with arrow keys
        e.preventDefault();

        if (this.state.selectedAssetIndex > 0) {
          this.setState(
            (state, props) => ({
              selectedAssetIndex: this.state.selectedAssetIndex - 1,
              selectedAssetPage: props.paginationMetadata.page,
            }),
            () => { this.props.selectAsset(this.props.assetsList[this.state.selectedAssetIndex]); },
          );
        }
        break;
      }
      default:
    }
  }

  render = () => {
    const assetsListItems = this.props.assetsList.map((asset, index) =>
      this.getAssetListItem(asset, index));

    return (
      <React.Fragment>
        {this.getAssetsListHeader()}
        <ol
          aria-activedescendant={this.state.selectedAssetIndex > -1 ? `asset-list-option-${this.state.selectedAssetIndex}` : null}
          className="list-group"
          onFocus={this.onListBoxFocus}
          onKeyDown={this.handleKeyDown}
          role="listbox"
          tabIndex="0"
        >
          {assetsListItems}
        </ol>
      </React.Fragment>
    );
  };
}

AssetsList.propTypes = {
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
    base_url: PropTypes.string,
  }).isRequired,
  paginationMetadata: PropTypes.shape({
    start: PropTypes.number,
    end: PropTypes.number,
    page: PropTypes.number,
    pageSize: PropTypes.number,
    totalCount: PropTypes.number,
  }).isRequired,
  selectAsset: PropTypes.func.isRequired,
  selectedAsset: PropTypes.shape({
    display_name: PropTypes.string,
    content_type: PropTypes.string,
    url: PropTypes.string,
    date_added: PropTypes.string,
    id: PropTypes.string,
    portable_url: PropTypes.string,
    thumbnail: PropTypes.string,
    external_url: PropTypes.string,
  }).isRequired,
};
