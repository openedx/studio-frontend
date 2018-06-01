import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Modal, Variant } from '@edx/paragon';
import classNames from 'classnames';

import FontAwesomeStyles from 'font-awesome/css/font-awesome.min.css';
import styles from './AssetsTable.scss';
import { assetLoading } from '../../data/constants/loadingTypes';
import CopyButton from '../CopyButton';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';
import messages from './displayMessages';

const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
const modalWrapperID = 'modalWrapper';

export default class AssetsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copyButtonIsClicked: false,
      elementToFocusOnModalClose: {},
      modalOpen: false,
    };

    this.columns = {
      image_preview: {
        label: (<WrappedMessage message={messages.assetsTablePreviewLabel} />),
        key: 'image_preview',
        columnSortable: false,
        hideHeader: true,
        width: 'col-2',
      },
      display_name: {
        label: (<WrappedMessage message={messages.assetsTableNameLabel} />),
        key: 'display_name',
        columnSortable: true,
        width: 'col-3',
      },
      content_type: {
        label: (<WrappedMessage message={messages.assetsTableTypeLable} />),
        key: 'content_type',
        columnSortable: true,
        width: 'col-2',
      },
      date_added: {
        label: (<WrappedMessage message={messages.assetsTableDateLabel} />),
        key: 'date_added',
        columnSortable: true,
        width: 'col-2',
      },
      urls: {
        label: (<WrappedMessage message={messages.assetsTableCopyLabel} />),
        key: 'urls',
        columnSortable: false,
        width: 'col',
      },
      delete_asset: {
        label: (<WrappedMessage message={messages.assetsTableDeleteLabel} />),
        key: 'delete_asset',
        columnSortable: false,
        hideHeader: true,
        width: 'col',
      },
      lock_asset: {
        label: (<WrappedMessage message={messages.assetsTableLockLabel} />),
        key: 'lock_asset',
        columnSortable: false,
        hideHeader: true,
        width: 'col',
      },
    };

    this.trashcanRefs = {};

    this.addSupplementalTableElements = this.addSupplementalTableElements.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.deleteAsset = this.deleteAsset.bind(this);
    this.getAssetDeleteButtonRef = this.getAssetDeleteButtonRef.bind(this);
    this.onCopyButtonClick = this.onCopyButtonClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
  }

  onSortClick(columnKey) {
    const sortedColumn = this.props.assetsSortMetadata.sort;
    const sortedDirection = this.props.assetsSortMetadata.direction;

    let newDirection = 'desc';

    if (sortedColumn === columnKey) {
      newDirection = sortedDirection === 'desc' ? 'asc' : 'desc';
    }

    this.props.updateSort(columnKey, newDirection, this.props.courseDetails);
  }

  onDeleteClick(index) {
    const assetToDelete = this.props.assetsList[index];

    this.props.stageAssetDeletion(assetToDelete, index);

    this.setState({
      elementToFocusOnModalClose: this.trashcanRefs[assetToDelete.id],
      modalOpen: true,
    });
  }

  onLockClick = (e) => {
    const assetId = e.currentTarget.getAttribute('data-asset-id');
    const clickedAsset = this.props.assetsList.find(asset => (asset.id === assetId));
    this.props.toggleLockAsset(clickedAsset, this.props.courseDetails);
  }

  onCopyButtonClick(isClicked) {
    this.setState({
      copyButtonIsClicked: isClicked,
    });
  }

  getImageThumbnail(thumbnail) {
    const baseUrl = this.props.courseDetails.base_url || '';
    if (thumbnail) {
      return (
        <WrappedMessage message={messages.assetsTableNoDescription} >
          { displayText => (<img src={`${baseUrl}${thumbnail}`} alt={displayText} data-identifier="asset-image-thumbnail" />) }
        </WrappedMessage>
      );
    }
    return (
      <WrappedMessage message={messages.assetsTableNoPreview} >
        { displayText => <div className={styles['no-image-preview']} data-identifier="asset-image-thumbnail">{displayText}</div> }
      </WrappedMessage>
    );
  }

  getLockButton(asset) {
    const classes = [FontAwesomeStyles.fa, 'btn-outline-primary'];
    let lockStateMessage;
    if (asset.locked) {
      lockStateMessage = messages.assetsTableUnlockedObject;
      classes.push(FontAwesomeStyles['fa-lock']);
    } else {
      lockStateMessage = messages.assetsTableUnlockedObject;
      classes.push(FontAwesomeStyles['fa-unlock']);
    }
    return (
      <WrappedMessage message={lockStateMessage} values={{ object: asset.display_name }}>
        { displayText =>
          (<Button
            className={classes}
            label={''}
            data-asset-id={asset.id}
            aria-label={displayText}
            onClick={this.onLockClick}
            data-identifier="asset-lock-button"
          />)
        }
      </WrappedMessage>
    );
  }

  getLoadingLockButton(asset) {
    // spinner classes are applied to the span to keep the whole button from spinning
    const spinnerClasses = [FontAwesomeStyles.fa, FontAwesomeStyles['fa-spinner'], FontAwesomeStyles['fa-spin']];
    return (
      <WrappedMessage
        message={messages.assetsTableUpdateLock}
        values={{ assetName: asset.display_name }}
      >
        { displayText =>
          (<Button
            className={['btn-outline-primary']}
            label={(<span className={classNames(...spinnerClasses)} />)}
            aria-label={displayText}
            data-identifier="asset-locking-button"
          />)
        }
      </WrappedMessage>
    );
  }

  getCopyUrlButtons(assetDisplayName, studioUrl, webUrl) {
    return (
      <span>
        {
          studioUrl && this.getCopyUrlButton(
            assetDisplayName,
            studioUrl,
            messages.assetsTableStudioLink,
            [styles['studio-copy-button']],
          )
        }
        {
          webUrl && this.getCopyUrlButton(
            assetDisplayName,
            webUrl,
            messages.assetsTableWebLink,
          )
        }
      </span>
    );
  }

  getCopyUrlButton(assetDisplayName, url, labelMessage, classes = []) {
    const buttonLabel = (
      <span>
        <span className={classNames(FontAwesomeStyles.fa, FontAwesomeStyles['fa-files-o'], styles['copy-icon'])} aria-hidden />
        <WrappedMessage message={labelMessage} />
      </span>
    );

    const onCopyLabel = (
      <WrappedMessage message={messages.assetsTableCopiedStatus} data-identifier={`asset-copy-${labelMessage}-url-button-copy-label`} />
    );

    return (
      <WrappedMessage
        message={messages.assetsTableDetailedCopyLink}
        values={{
          displayName: assetDisplayName,
          label: (<WrappedMessage message={labelMessage} />),
        }}
      >
        {
          displayText =>
            (<CopyButton
              label={buttonLabel}
              className={classes}
              textToCopy={url}
              onCopyButtonClick={this.onCopyButtonClick}
              ariaLabel={displayText}
              onCopyLabel={onCopyLabel}
              data-identifier={`asset-copy-${labelMessage.defaultMessage.toLowerCase()}-url-button`}
            />)
        }
      </WrappedMessage>
    );
  }

  getAssetDeleteButtonRef(ref, currentAsset) {
    this.trashcanRefs[currentAsset.id] = ref;
    this.props.deleteButtonRefs(ref, currentAsset);
  }

  getTableCaption() {
    return (
      <span className="sr-only">
        <WrappedMessage message={messages.assetsTableCaption} />
      </span>
    );
  }

  getTableColumns() {
    let columns = Object.keys(this.columns);
    let expandedColumns = {};

    if (!this.props.isImagePreviewEnabled) {
      columns = columns.filter(column => column !== 'image_preview');
      // expand columns to occupy the col-2 void
      expandedColumns = {
        content_type: {
          width: 'col-3',
        },
        date_added: {
          width: 'col-3',
        },
      };
    }

    return columns.map(columnKey => ({
      ...this.columns[columnKey],
      ...expandedColumns[columnKey],
      onSort: () => this.onSortClick(columnKey),
    }));
  }

  addSupplementalTableElements() {
    const newAssetsList = this.props.assetsList.map((asset, index) => {
      const currentAsset = Object.assign({}, asset);

      const deleteButton = (
        <WrappedMessage
          message={messages.assetsTableDeleteObject}
          values={{ displayName: currentAsset.display_name }}
        >
          { displayText =>
            (<Button
              key={currentAsset.id}
              className={[FontAwesomeStyles.fa, FontAwesomeStyles['fa-trash'], 'btn-outline-primary']}
              label={''}
              aria-label={displayText}
              onClick={() => { this.onDeleteClick(index); }}
              inputRef={ref => this.getAssetDeleteButtonRef(ref, currentAsset)}
              data-identifier="asset-delete-button"
            />)
          }
        </WrappedMessage>
      );

      const isLoadingLock = currentAsset.loadingFields &&
        currentAsset.loadingFields.includes(assetLoading.LOCK);

      currentAsset.delete_asset = deleteButton;

      currentAsset.lock_asset = isLoadingLock ?
        this.getLoadingLockButton(currentAsset) : this.getLockButton(currentAsset);

      /*
        TODO: we will have to add functionality to actually have the alt tag be the
        image description accompanying the image; we should also give a visual indicator
        of when the image description is missing to the course team and an ability to
        add a description at that point
      */
      currentAsset.image_preview = this.getImageThumbnail(currentAsset.thumbnail);

      currentAsset.urls = this.getCopyUrlButtons(
        currentAsset.display_name,
        currentAsset.portable_url,
        currentAsset.external_url,
      );

      currentAsset.display_name = (
        <span data-identifier="asset-file-name">{currentAsset.display_name}</span>
      );

      currentAsset.content_type = (
        <span data-identifier="asset-content-type">{currentAsset.content_type}</span>
      );

      currentAsset.date_added = (
        <span data-identifier="asset-date-added">{currentAsset.date_added}</span>
      );

      return currentAsset;
    });
    return newAssetsList;
  }

  closeModal() {
    this.state.elementToFocusOnModalClose.focus();
    this.props.unstageAssetDeletion();

    this.setState({
      elementToFocusOnModalClose: {},
      modalOpen: false,
    });
  }

  deleteAsset() {
    this.props.deleteAsset(this.props.assetToDelete, this.props.courseDetails);

    this.setState({
      elementToFocusOnModalClose: {},
      modalOpen: false,
    });
  }

  renderModal() {
    return (
      <div id={modalWrapperID}>
        <Modal
          open={this.state.modalOpen}
          title={(<WrappedMessage
            message={messages.assetsTableDeleteObject}
            values={{
              displayName: this.props.assetToDelete.display_name,
            }}
          />)}
          body={this.renderModalBody()}
          closeText={<WrappedMessage message={messages.assetsTableCancel} />}
          onClose={this.closeModal}
          buttons={[
            <Button
              label={<WrappedMessage message={messages.assetsTablePermaDelete} />}
              buttonType="primary"
              onClick={this.deleteAsset}
              data-identifier="asset-confirm-delete-button"
            />,
          ]}
          variant={{ status: Variant.status.WARNING }}
          parentSelector={`#${modalWrapperID}`}
        />
      </div>
    );
  }

  renderModalBody() {
    const learnMoreLink = (
      <WrappedMessage tagName="a" message={messages.assetsTableLearnMore}>
        {
          displayText => (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={this.props.courseFilesDocs}
            >
              {displayText}
            </a>
          )
        }
      </WrappedMessage>
    );

    return (
      <React.Fragment>
        <WrappedMessage
          message={messages.assetsTableDeleteWarning}
          tagName="p"
          values={{
            displayName: <b className={styles['wrap-text']}>{this.props.assetToDelete.display_name}</b>,
          }}
        />
        <WrappedMessage
          message={messages.assetsTableDeleteConsequences}
          tagName="p"
          values={{
            link: learnMoreLink,
          }}
        />
      </React.Fragment>
    );
  }

  render() {
    return (
      <React.Fragment>
        <Table
          caption={this.getTableCaption()}
          className={['table-responsive']}
          columns={this.getTableColumns()}
          data={this.addSupplementalTableElements(this.props.assetsList)}
          tableSortable
          defaultSortedColumn="date_added"
          defaultSortDirection="desc"
          hasFixedColumnWidths={!isIE11}
        />
        {this.renderModal()}
        <span className="sr" aria-live="assertive" id="copy-status">
          {
            this.state.copyButtonIsClicked
              ? (<WrappedMessage message={messages.assetsTableCopiedStatus} />)
              : ''
          }
        </span>
      </React.Fragment>
    );
  }
}

AssetsTable.propTypes = {
  assetsList: PropTypes.arrayOf(PropTypes.object).isRequired,
  assetsSortMetadata: PropTypes.shape({
    sort: PropTypes.string,
    direction: PropTypes.string,
  }).isRequired,
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
  courseFilesDocs: PropTypes.string.isRequired,
  deleteAsset: PropTypes.func.isRequired,
  deleteButtonRefs: PropTypes.func,
  isImagePreviewEnabled: PropTypes.bool.isRequired,
  updateSort: PropTypes.func.isRequired,
  toggleLockAsset: PropTypes.func.isRequired,
  stageAssetDeletion: PropTypes.func.isRequired,
  unstageAssetDeletion: PropTypes.func.isRequired,
  assetToDelete: PropTypes.shape({
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

AssetsTable.defaultProps = {
  deleteButtonRefs: () => {},
};
