import { Button, CheckBox, Fieldset, Icon, InputText, Modal, StatusAlert, Variant } from '@edx/paragon';
import classNames from 'classnames';
import { connect } from 'react-redux';
import FontAwesomeStyles from 'font-awesome/css/font-awesome.min.css';
import PropTypes from 'prop-types';
import React from 'react';

import { assetActions } from '../../data/constants/actionTypes';
import AssetsResultsCount from '../AssetsResultsCount/index';
import { getPageType, pageTypes } from '../../utils/getAssetsPageType';
import messages from './displayMessages';
import rewriteStaticLinks from '../../utils/rewriteStaticLinks';
import styles from './EditImageModal.scss';
import WrappedAssetsClearSearchButton from '../AssetsClearSearchButton/container';
import WrappedAssetsDropZone from '../AssetsDropZone/container';
import WrappedAssetsList from '../AssetsList/container';
import WrappedAssetsSearch from '../AssetsSearch/container';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';
import WrappedPagination from '../Pagination/container';


// Create an AssetsResultsCount that is not aware of the Images filter.
// This is so that the message will initially say "out of N total files" instead of "out of N
// possible matches".
const WrappedAssetsResultsCount = connect((state) => {
  const { Images, ...typesWithoutImages } = state.metadata.filters.assetTypes;
  const filtersWithoutImages = { ...state.metadata.filters, assetTypes: typesWithoutImages };
  return {
    filtersMetadata: filtersWithoutImages,
    paginationMetadata: state.metadata.pagination,
    searchMetadata: state.metadata.search,
  };
})(AssetsResultsCount);

const imageDescriptionID = 'imageDescription';
const imageDescriptionFieldsetID = 'imageDescriptionFieldset';
const imageDimensionsFieldsetID = 'imageDimensionsFieldset';
const imageHeightID = 'imageHeight';
const imageWidthID = 'imageWidth';
const modalWrapperID = 'modalWrapper';

const initialEditImageModalState = {
  areImageDimensionsValid: true,
  areProportionsLocked: true,
  assetsPageType: pageTypes.SKELETON,
  baseAssetURL: '',
  currentUploadErrorMessage: null,
  currentValidationMessages: {},
  displayLoadingSpinner: false,
  imageDescription: '',
  imageDimensions: {},
  imageSource: '',
  imageStyle: '',
  isImageDecorative: false,
  isImageDescriptionValid: true,
  isImageLoaded: false,
  isImageLoading: false,
  isImageDimensionsValid: true,
  isModalOpen: false,
  isStatusAlertOpen: false,
  pageNumber: 1,
  shouldShowPreviousButton: false,
};

export default class EditImageModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...initialEditImageModalState };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.onConstrainProportionsClick = this.onConstrainProportionsClick.bind(this);
    this.onEditImageModalClose = this.onEditImageModalClose.bind(this);
    this.onImageDescriptionBlur = this.onImageDescriptionBlur.bind(this);
    this.onImageDimensionBlur = this.onImageDimensionBlur.bind(this);
    this.onInsertImageButtonClick = this.onInsertImageButtonClick.bind(this);
    this.onImageIsDecorativeClick = this.onImageIsDecorativeClick.bind(this);
    this.onImageLoad = this.onImageLoad.bind(this);
    this.onNextPageButtonClick = this.onNextPageButtonClick.bind(this);
    this.onPreviousPageButtonClick = this.onPreviousPageButtonClick.bind(this);
    this.onStatusAlertClose = this.onStatusAlertClose.bind(this);
    // Create ref setters to minimize anonymous inline functions
    this.setDropZoneButtonRef = this.setDropZoneButtonRef.bind(this);
    this.setImageDescriptionInputRef = this.setImageDescriptionInputRef.bind(this);
    this.setImageFormRef = this.setImageFormRef.bind(this);
    this.setImageRef = this.setImageRef.bind(this);
    this.setModalWrapperRef = this.setModalWrapperRef.bind(this);
    this.setPreviousButtonRef = this.setPreviousButtonRef.bind(this);
    this.setStatusAlertRef = this.setStatusAlertRef.bind(this);

    this.dropZoneButtonRef = null;
    this.imageDescriptionInputRef = null;
    this.imageFormRef = null;
    this.imageRef = null;
    this.previousPageButtonRef = null;
    this.modalWrapperRef = null;
    this.statusAlertRef = null;
  }

  componentDidMount() {
    this.modalWrapperRef.addEventListener('openModal', this.handleOpenModal);
  }

  componentWillReceiveProps(nextProps) {
    const newState = {};
    switch (nextProps.assetsStatus.type) {
      case assetActions.upload.UPLOAD_ASSET_SUCCESS: {
        const uploadedAsset = nextProps.assetsStatus.response.asset;
        nextProps.selectAsset(uploadedAsset, 0);
        nextProps.clearAssetsStatus();
        newState.currentUploadErrorMessage = null;
        newState.isStatusAlertOpen = false;
        newState.pageNumber = 2;
        break;
      }
      case assetActions.upload.UPLOAD_EXCEED_MAX_COUNT_ERROR: {
        newState.currentUploadErrorMessage = messages.editImageModalTooManyFiles;
        newState.isStatusAlertOpen = true;
        break;
      }
      case assetActions.upload.UPLOAD_INVALID_FILE_TYPE_ERROR: {
        newState.currentUploadErrorMessage = messages.editImageModalInvalidFileType;
        newState.isStatusAlertOpen = true;
        break;
      }
      default: {
        if (nextProps.selectedAsset.portable_url) {
          newState.imageSource = nextProps.selectedAsset.portable_url;
        }
        break;
      }
    }
    this.setState(state => ({
      ...newState,
      assetsPageType: getPageType(nextProps, state.assetsPageType),
    }));
  }

  componentDidUpdate(prevProps, prevState) {
    this.didStatusAlertOpen(prevState);
    this.wasNextButtonClicked(prevState);
    this.wasPreviousButtonClicked(prevState);
  }

  componentWillUnmount() {
    this.modalWrapperRef.removeEventListener('openModal', this.handleOpenModal);
  }

  onConstrainProportionsClick = (checked) => {
    this.setState({
      areProportionsLocked: checked,
    });
  }

  onEditImageModalClose = () => {
    this.setState({
      isModalOpen: false,
    });

    this.props.clearSearch(this.props.courseDetails);
    this.resetImageSelection();
    this.modalWrapperRef.dispatchEvent(new CustomEvent('closeModal',
      {
        bubbles: true,
      },
    ));
  }

  onImageIsDecorativeClick = (checked) => {
    this.setState({
      isImageDecorative: checked,
    });
  }

  onImageLoad = (event) => {
    const img = event.target;

    this.setState({
      displayLoadingSpinner: false,
      imageDimensions: {
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: img.naturalWidth / img.naturalHeight,
      },
      isImageLoaded: true,
      isImageLoading: false,
    });
  }

  onImageError = () => {
    this.setState({
      displayLoadingSpinner: false,
      imageDimensions: {},
      isImageLoading: false,
      isImageLoaded: false,
    });
  }

  onImageDescriptionBlur = (imageDescription) => {
    this.setState({
      imageDescription,
    });
  }

  onImageDimensionBlur = (dimensionType) => {
    let aspectRatio;
    let newDimensionType;

    if (dimensionType === 'height') {
      aspectRatio = this.state.imageDimensions.aspectRatio;
      newDimensionType = 'width';
    } else if (dimensionType === 'width') {
      aspectRatio = (1 / this.state.imageDimensions.aspectRatio);
      newDimensionType = 'height';
    } else {
      throw new Error(`Unknown dimension type ${dimensionType}.`);
    }

    return (dimensionValue) => {
      const newImageDimensions = { ...this.state.imageDimensions };
      const parsedDimensionValue = parseInt(dimensionValue, 10);

      newImageDimensions[dimensionType] = isNaN(parsedDimensionValue) ? '' : parsedDimensionValue;

      if (this.state.areProportionsLocked) {
        const newDimensionValue = Math.round(parsedDimensionValue * aspectRatio);
        newImageDimensions[newDimensionType] = isNaN(newDimensionValue) ? '' : newDimensionValue;
      }
      this.setState({ imageDimensions: newImageDimensions });
    };
  }

  onNextPageButtonClick = () => {
    if (this.isAssetSelected()) {
      this.setState({
        currentUploadErrorMessage: null,
        isStatusAlertOpen: false,
        pageNumber: 2,
      });
      this.props.clearAssetsStatus();
    }
  }

  onPreviousPageButtonClick = () => {
    this.setState({
      currentValidationMessages: {},
      isImageDescriptionValid: true,
      isImageDimensionsValid: true,
      isStatusAlertOpen: false,
      pageNumber: 1,
    });
  }

  onInsertImageButtonClick = () => {
    const isValidImageDescription = this.validateImageDescription();
    const isValidImageDimensions = this.validateImageDimensions();
    const isValidFormContent = isValidImageDescription.isValid && isValidImageDimensions.isValid;

    const currentValidationMessages = {};

    if (!isValidImageDescription.isValid) {
      currentValidationMessages[imageDescriptionID] = isValidImageDescription.validationMessage;
    }

    if (!isValidImageDimensions.isValid) {
      currentValidationMessages[imageWidthID] = isValidImageDimensions.validationMessage;
    }

    this.setState({
      isStatusAlertOpen: !isValidFormContent,
      isImageDescriptionValid: isValidImageDescription.isValid,
      areImageDimensionsValid: isValidImageDimensions.isValid,
      currentValidationMessages,
    });

    if (isValidFormContent) {
      this.imageFormRef.dispatchEvent(new CustomEvent('submitForm',
        {
          bubbles: true,
          detail: {
            height: this.getDimensionStateOrNatural('height'),
            width: this.getDimensionStateOrNatural('width'),
            src: this.state.imageSource,
            alt: this.state.isImageDecorative ? '' : this.state.imageDescription,
            style: this.state.imageStyle,
          },
        },
      ));

      this.setState({
        isModalOpen: false,
      });

      this.resetImageSelection();
    } else {
      this.statusAlertRef.focus();
    }
  }

  onStatusAlertClose = () => {
    if (this.state.pageNumber === 1) {
      this.props.clearAssetsStatus();
      this.dropZoneButtonRef.focus();
    } else if (this.state.pageNumber === 2) {
      if (this.state.shouldShowPreviousButton) {
        this.previousPageButtonRef.focus();
      } else {
        this.imageDescriptionInputRef.focus();
      }
    }

    this.setState({
      isStatusAlertOpen: false,
    });
  }

  setDropZoneButtonRef(ref) {
    this.dropZoneButtonRef = ref;
  }

  setImageDescriptionInputRef(ref) {
    this.imageDescriptionInputRef = ref;
  }

  setImageFormRef(ref) {
    this.imageFormRef = ref;
  }

  setImageRef(ref) {
    this.imageRef = ref;
  }

  setModalWrapperRef(ref) {
    this.modalWrapperRef = ref;
  }

  setPreviousButtonRef(ref) {
    this.previousPageButtonRef = ref;
  }

  setStatusAlertRef(ref) {
    this.statusAlertRef = ref;
  }

  getNaturalDimension = (dimensionType) => {
    if (this.imageRef) {
      // if value is unparsable (NaN), reset to natural value
      const naturalDimensions = {
        width: this.imageRef.naturalWidth,
        height: this.imageRef.naturalHeight,
      };
      return naturalDimensions[dimensionType];
    }
    return null;
  }

  getDimensionStateOrNatural = (dimensionType) => {
    if (!this.state.imageDimensions[dimensionType]) {
      return this.getNaturalDimension(dimensionType);
    }
    return this.state.imageDimensions[dimensionType];
  }

  getImageDescriptionInput = () => (
    <Fieldset
      legend={<WrappedMessage message={messages.editImageModalImageDescriptionLegend} />}
      id={imageDescriptionFieldsetID}
      invalidMessage={<WrappedMessage message={messages.editImageModalFormValidImageDescription} />}
      isValid={this.state.isImageDescriptionValid}
      variant={{
        status: Variant.status.DANGER,
      }}
      variantIconDescription={<WrappedMessage message={messages.editImageModalFormError} />}
    >
      <InputText
        name="imageDescription"
        label={
          <WrappedMessage
            message={messages.editImageModalImageDescriptionLabel}
          />
        }
        describedBy={`#Error-${imageDescriptionID}`}
        description={this.getImageDescriptionDescription()}
        id={imageDescriptionID}
        type="text"
        value={this.state.imageDescription}
        disabled={this.state.isImageDecorative}
        onBlur={this.onImageDescriptionBlur}
        inputRef={this.setImageDescriptionInputRef}
      />
      <div className="or-fields">
        <WrappedMessage
          message={messages.editImageModalImageOrFields}
        />
      </div>
      <CheckBox
        id="isDecorative"
        name="isDecorative"
        label={
          <WrappedMessage
            message={messages.editImageModalImageIsDecorativeCheckboxLabel}
          />
        }
        description={this.getImageIsDecorativeDescription()}
        checked={this.state.isImageDecorative}
        onChange={this.onImageIsDecorativeClick}
      />
    </Fieldset>
  );

  getLearnMoreLink = () => (
    <WrappedMessage message={messages.editImageModalLearnMore}>
      {
        displayText => (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={this.props.courseImageAccessibilityDocs}
          >
            {displayText}
          </a>
        )
      }
    </WrappedMessage>
  );

  getImageDescriptionDescription = () => (
    <React.Fragment>
      <WrappedMessage message={messages.editImageModalImageDescriptionDescription} />
      {' '}
      {this.getLearnMoreLink()}
    </React.Fragment>
  );

  getImageIsDecorativeDescription = () => (
    <React.Fragment>
      <WrappedMessage message={messages.editImageModalImageIsDecorativeCheckboxDescription} />
      {' '}
      {this.getLearnMoreLink()}
    </React.Fragment>
  );

  getImageDimensionsInput = () => (
    <Fieldset
      legend={<WrappedMessage message={messages.editImageModalDimensionsLegend} />}
      id={imageDimensionsFieldsetID}
      invalidMessage={<WrappedMessage message={messages.editImageModalFormValidImageDimensions} />}
      isValid={this.state.areImageDimensionsValid}
      variant={{
        status: Variant.status.DANGER,
      }}
      variantIconDescription={<WrappedMessage message={messages.editImageModalFormError} />}
    >
      <div className="form-row">
        <div className="col">
          <InputText
            name="imageWidth"
            label={
              <WrappedMessage
                message={messages.editImageModalImageWidthLabel}
              />
            }
            id={imageWidthID}
            type="number"
            value={'width' in this.state.imageDimensions ? this.state.imageDimensions.width : ''}
            onBlur={this.onImageDimensionBlur('width')}
          />
        </div>
        <div className="col-1 my-auto image-dimensions-x">
          <Icon className={['fa', 'fa-times']} />
        </div>
        <div className="col">
          <InputText
            name={imageHeightID}
            label={
              <WrappedMessage
                message={messages.editImageModalImageHeightLabel}
              />
            }
            id="imageHeight"
            type="number"
            value={'height' in this.state.imageDimensions ? this.state.imageDimensions.height : ''}
            onBlur={this.onImageDimensionBlur('height')}
          />
        </div>
      </div>
      <CheckBox
        id="lockProportions"
        name="lockProportions"
        label={
          <WrappedMessage
            message={messages.editImageModalLockImageProportionsCheckboxLabel}
          />
        }
        checked={this.state.areProportionsLocked}
        onChange={this.onConstrainProportionsClick}
      />
    </Fieldset>
  );

  getImageAssetSource = () => (
    rewriteStaticLinks(this.state.imageSource, '/static/', this.state.baseAssetURL)
  );

  getImage = () => (
    <img
      alt=""
      className={classNames(styles['image-preview-image'], { invisible: !this.state.isImageLoaded })}
      src={this.getImageAssetSource()}
      onLoad={this.onImageLoad}
      onError={this.onImageError}
      ref={this.setImageRef}
    />
  );

  /*
    image is conditionally displayed so that onImageError is not called on initial
    modal open, when image source is empty string
  */
  getImagePreviewPlaceholder = () => (
    <div className={styles['image-preview-placeholder']}>
      <WrappedMessage message={messages.editImageModalImagePreviewText} >
        {displayText =>
          (<span className={classNames({ invisible: this.state.isImageLoaded })}>
            {displayText}
          </span>)}
      </WrappedMessage>
      {this.state.imageSource && this.getImage()}
    </div>
  );

  getImagePreview = () => (
    // image preview is decorative
    <div aria-hidden>
      <WrappedMessage message={messages.editImageModalImagePreviewText} />
      <div className={styles['image-preview-container']}>
        {this.getImagePreviewPlaceholder()}
      </div>
    </div>
  );

  getStatusAlertDialog = () => {
    let dialog;

    if (this.state.pageNumber === 1) {
      dialog = (
        <React.Fragment>
          {this.getUploadErrorStatusMessage()}
        </React.Fragment>
      );
    } else if (this.state.pageNumber === 2) {
      dialog = (
        <div>
          <WrappedMessage
            message={messages.editImageModalFormErrorMissingFields}
            tagName="div"
          />
          <div className="mt-3">
            <ul className="bullet-list">
              {(Object.keys(this.state.currentValidationMessages).reduce((accumulator, current) => {
                const value = this.state.currentValidationMessages[current];

                if (value) {
                  const errorMessage = <li key={`Error-${current}`}>{<a href={`#${current}`}>{value} </a>}</li>;
                  accumulator.push(errorMessage);
                }

                return accumulator;
              }, [])
              )}
            </ul>
          </div>
        </div>
      );
    }
    return dialog;
  };

  getStatusAlert = () => (
    <StatusAlert
      alertType="danger"
      dialog={this.getStatusAlertDialog()}
      onClose={this.onStatusAlertClose}
      open={this.state.isStatusAlertOpen}
      ref={this.setStatusAlertRef}
    />
  )

  getModalHeader = () => {
    let header;
    if (this.state.pageNumber === 1) {
      header = (
        <WrappedMessage
          message={messages.editImageModalInsertTitle}
        />
      );
    } else if (this.state.pageNumber === 2) {
      header = (
        <WrappedMessage
          message={messages.editImageModalEditTitle}
        />
      );
    }
    return (
      <div aria-live="polite">
        { header }
      </div>
    );
  }

  getModalBody = () => {
    let body;
    if (this.state.pageNumber === 1) {
      body = this.getImageSelectionModalBody();
    } else if (this.state.pageNumber === 2) {
      body = this.getImageSettingsModalBody();
    }
    return body;
  }

  getImageSelectionModalBodyAssetsList = (type) => {
    switch (type) {
      case pageTypes.NORMAL:
        return (<WrappedAssetsList />);
      case pageTypes.NO_ASSETS:
        return (
          <div className="mt-3">
            <WrappedMessage message={messages.editImageModalAssetsListNoAssetsMessage} tagName="h3" />
          </div>
        );
      case pageTypes.NO_RESULTS:
        return (
          <React.Fragment>
            <WrappedMessage message={messages.editImageModalAssetsListNoResultsMessage} tagName="h3" />
            <WrappedAssetsClearSearchButton />
          </React.Fragment>
        );
      case pageTypes.SKELETON:
        return (
          <div className="text-center mt-3">
            <span className="fa-icon-spacing" aria-hidden>
              <span
                className={classNames([
                  FontAwesomeStyles.fa,
                  FontAwesomeStyles['fa-spinner'],
                  FontAwesomeStyles['fa-spin'],
                ])}
              />
            </span>
            <WrappedMessage message={messages.editImageModalAssetsListLoadingSpinner} />
          </div>
        );
      default:
        throw new Error(`Unknown pageType ${type}.`);
    }
  }

  getImageSelectionModalBody = () => (
    <React.Fragment>
      <div className="row">
        <div className="col">
          {this.getStatusAlert()}
        </div>
      </div>
      <div className="row mb-5">
        <div className="col">
          <WrappedAssetsDropZone
            maxFileCount={1}
            maxFileSizeMB={10}
            acceptedFileTypes={'image/*'}
            compactStyle
            buttonRef={this.setDropZoneButtonRef}
          />
        </div>
      </div>
      <div className="row no-gutters">
        <div className="col">
          <WrappedMessage message={messages.editImageModalInsertHeader} tagName="h3" />
        </div>
      </div>
      <div className="row">
        <div className="col-6 order-2">
          {(this.state.assetsPageType === pageTypes.NORMAL ||
            this.state.assetsPageType === pageTypes.NO_RESULTS) && (
            <WrappedAssetsSearch />
          )}
        </div>
        <div className="col-6 order-1">
          {this.state.assetsPageType === pageTypes.NORMAL && (
            <div aria-hidden>
              <WrappedAssetsResultsCount />
            </div>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col">
          {this.getImageSelectionModalBodyAssetsList(this.state.assetsPageType)}
        </div>
      </div>
      {this.state.assetsPageType === pageTypes.NORMAL && (
        <div className="row mt-3 no-gutters">
          <div className="col">
            <WrappedPagination />
          </div>
        </div>
      )}
    </React.Fragment>
  );

  getImageSettingsModalBody = () => (
    <React.Fragment>
      {this.getStatusAlert()}
      <div className="row">
        {this.state.shouldShowPreviousButton && this.getPreviousPageButton()}
      </div>
      <div className="row">
        <div className="col-sm-4">
          {this.getImagePreview()}
        </div>
        <div className="col">
          <form ref={this.setImageFormRef}>
            {this.getImageDescriptionInput()}
            {this.getImageDimensionsInput()}
          </form>
        </div>
      </div>
    </React.Fragment>
  );

  getModalButtons = () => {
    let buttons;
    if (this.state.pageNumber === 1) {
      buttons = this.getNextPageButton();
    } else if (this.state.pageNumber === 2) {
      buttons = this.getInsertImageButton();
    }
    return buttons;
  }

  getNextPageButton = () => (
    <Button
      label={
        <WrappedMessage
          message={messages.editImageModalNextPageButton}
        />
      }
      buttonType="primary"
      disabled={!this.isAssetSelected()}
      onClick={this.onNextPageButtonClick}
    />
  );

  getPreviousPageButton = () => (
    <Button
      label={
        <WrappedMessage
          message={messages.editImageModalPreviousPageButton}
        />
      }
      buttonType="link"
      onClick={this.onPreviousPageButtonClick}
      inputRef={this.setPreviousButtonRef}
    />
  );

  getInsertImageButton = () => (
    <Button
      label={
        <WrappedMessage
          message={messages.editImageModalInsertImageButton}
        />
      }
      buttonType="primary"
      onClick={this.onInsertImageButtonClick}
    />
  );

  getUploadErrorStatusMessage = () => {
    let message;

    if (this.state.currentUploadErrorMessage) {
      message = (
        <WrappedMessage
          message={this.state.currentUploadErrorMessage}
        />
      );
    }

    return message;
  };

  resetImageSelection = () => {
    this.props.updatePage(0, this.props.courseDetails);
    this.props.clearSelectedAsset();
  }

  handleOpenModal = (event) => {
    const eventSource = event.detail.src;
    let isEventSourceEmpty = true;
    if (eventSource) {
      isEventSourceEmpty = false;
    }

    this.setState((state, props) => ({
      // reset state to initial and then add in overrides
      ...initialEditImageModalState,
      assetsPageType: getPageType(props, state.assetsPageType),
      baseAssetURL: event.detail.baseAssetUrl || '',
      imageDescription: event.detail.alt || '',
      imageDimensions: (event.detail.width && event.detail.height) ? {
        width: event.detail.width,
        height: event.detail.height,
        aspectRatio: event.detail.width / event.detail.height,
      } : {},
      imageSource: eventSource || '',
      imageStyle: event.detail.style || '',
      isImageDecorative: event.detail.alt === '',
      // if existing img had a source, assume it could be loaded and show the image preview
      isImageLoaded: !!eventSource,
      isModalOpen: true,
      pageNumber: isEventSourceEmpty ? 1 : 2,
      shouldShowPreviousButton: isEventSourceEmpty,
    }));

    if (this.props.assetsList.length === 0) {
      this.props.getAssets({ assetTypes: { Images: true }, pageSize: 4 }, this.props.courseDetails);
    }
  }

  validateImageDescription = () => {
    let feedback = { isValid: true };
    const { imageDescription, isImageDecorative } = this.state;

    if (!imageDescription && !isImageDecorative) {
      feedback = {
        isValid: false,
        validationMessage:
          (<WrappedMessage
            message={messages.editImageModalFormValidImageDescription}
          />),
        dangerIconDescription: <WrappedMessage message={messages.editImageModalFormError} />,
      };
    }
    return feedback;
  }

  validateImageDimensions = () => {
    let feedback = { isValid: true };
    const { height, width } = this.state.imageDimensions;

    if (!this.isPositiveIntegerOrEmpty(height) || !this.isPositiveIntegerOrEmpty(width)) {
      feedback = {
        isValid: false,
        validationMessage:
          (<WrappedMessage
            message={messages.editImageModalFormValidImageDimensions}
          />),
        dangerIconDescription: <WrappedMessage message={messages.editImageModalFormError} />,
      };
    }
    return feedback;
  }

  didStatusAlertOpen = (prevState) => {
    if (this.state.isStatusAlertOpen && !prevState.isStatusAlertOpen) {
      this.statusAlertRef.focus();
    }
  }

  isAssetSelected = () => (this.props.selectedAsset
    && Object.keys(this.props.selectedAsset).length !== 0);

  isPositiveIntegerOrEmpty = (val) => {
    if (val === '' || val === undefined) {
      return true;
    }
    if (Number.isInteger(val) && val > 0) {
      return true;
    }
    return false;
  }

  wasNextButtonClicked = (prevState) => {
    if (this.state.pageNumber === 2 && prevState.pageNumber === 1
      && this.state.shouldShowPreviousButton) {
      this.previousPageButtonRef.focus();
    }
  }

  wasPreviousButtonClicked = (prevState) => {
    if (this.state.pageNumber === 1 && prevState.pageNumber === 2
      && prevState.isModalOpen) {
      this.dropZoneButtonRef.focus();
    }
  }

  render = () => (
    <div
      ref={this.setModalWrapperRef}
      id={modalWrapperID}
    >
      <div
        aria-atomic
        aria-live={this.state.isModalOpen ? 'polite' : 'off'}
        aria-relevant="text"
        className="sr-only"
      >
        <WrappedAssetsResultsCount />
      </div>
      <Modal
        open={this.state.isModalOpen}
        title={this.getModalHeader()}
        body={this.getModalBody()}
        closeText={<WrappedMessage message={messages.editImageModalCancelButton} />}
        onClose={this.onEditImageModalClose}
        buttons={[this.getModalButtons()]}
        parentSelector={`#${modalWrapperID}`}
      />
    </div>
  );
}

EditImageModal.propTypes = {
  assetsList: PropTypes.arrayOf(PropTypes.object).isRequired,
  assetsStatus: PropTypes.shape({
    response: PropTypes.object,
    type: PropTypes.string,
  }).isRequired,
  clearAssetsStatus: PropTypes.func.isRequired,
  clearSearch: PropTypes.func.isRequired,
  clearSelectedAsset: PropTypes.func.isRequired,
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
  courseImageAccessibilityDocs: PropTypes.string.isRequired,
  getAssets: PropTypes.func.isRequired,
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
  updatePage: PropTypes.func.isRequired,
};
