import React from 'react';
import PropTypes from 'prop-types';
import { Button, CheckBox, Fieldset, Icon, InputText, Modal, StatusAlert, Variant } from '@edx/paragon';
import classNames from 'classnames';
import FontAwesomeStyles from 'font-awesome/css/font-awesome.min.css';

import messages from './displayMessages';
import styles from './EditImageModal.scss';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';
import rewriteStaticLinks from '../../utils/rewriteStaticLinks';

const LOADING_SPINNER_DELAY = 1000; // in milliseconds

const imageDescriptionID = 'imageDescription';
const imageDescriptionFieldsetID = 'imageDescriptionFieldset';
const imageDimensionsFieldsetID = 'imageDimensionsFieldset';
const imageHeightID = 'imageHeight';
const imageSourceID = 'imageSource';
const imageWidthID = 'imageWidth';

const initialEditImageModalState = {
  areProportionsLocked: true,
  baseAssetURL: '',
  displayLoadingSpinner: false,
  imageDescription: '',
  imageDimensions: {},
  isImageDecorative: false,
  isImageLoaded: false,
  isImageLoading: false,
  isImageValid: true,
  isImageDescriptionValid: true,
  isImageDimensionsValid: true,
  isStatusAlertOpen: false,
  imageSource: '',
  imageStyle: '',
  open: false,
  currentValidationMessages: {},
  pageNumber: 1,
  shouldShowPreviousButton: false,
};

export default class EditImageModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...initialEditImageModalState };

    this.getStatusAlert = this.getStatusAlert.bind(this);
    this.getStatusAlertDialog = this.getStatusAlertDialog.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.onConstrainProportionsClick = this.onConstrainProportionsClick.bind(this);
    this.onEditImageModalClose = this.onEditImageModalClose.bind(this);
    this.onImageDescriptionBlur = this.onImageDescriptionBlur.bind(this);
    this.onImageIsDecorativeClick = this.onImageIsDecorativeClick.bind(this);
    this.onInsertImageButtonClick = this.onInsertImageButtonClick.bind(this);
    this.onImageLoad = this.onImageLoad.bind(this);
    this.onImageSourceBlur = this.onImageSourceBlur.bind(this);
    this.onNextPageButtonClick = this.onNextPageButtonClick.bind(this);
    this.onPreviousPageButtonClick = this.onPreviousPageButtonClick.bind(this);
    this.onStatusAlertClose = this.onStatusAlertClose.bind(this);
    this.validateImageDescription = this.validateImageDescription.bind(this);
    this.validateImageSource = this.validateImageSource.bind(this);
    // Create ref setters to minimize anonymous inline functions
    this.setImageDescriptionInputRef = this.setImageDescriptionInputRef.bind(this);
    this.setImageFormRef = this.setImageFormRef.bind(this);
    this.setImagePreviewRef = this.setImagePreviewRef.bind(this);
    this.setImageSourceInputRef = this.setImageSourceInputRef.bind(this);
    this.setModalWrapperRef = this.setModalWrapperRef.bind(this);
    this.setStatusAlertRef = this.setStatusAlertRef.bind(this);
    this.setPreviousButtonRef = this.setPreviousButtonRef.bind(this);

    this.imageDescriptionInputRef = null;
    this.imageFormRef = null;
    this.imageSourceInputRef = null;
    this.imgRef = null;
    this.inputDescriptionRef = null;
    this.modalWrapperRef = null;
    this.previousPageButtonRef = null;
    this.statusAlertRef = null;
  }

  componentDidMount() {
    this.modalWrapperRef.addEventListener('openModal', this.handleOpenModal);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.pageNumber === 1 && prevState.pageNumber === 2) {
      this.imageSourceInputRef.focus();
    }

    if (this.state.pageNumber === 2 && prevState.pageNumber === 1
      && this.state.shouldShowPreviousButton) {
      this.previousPageButtonRef.focus();
    }
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
      open: false,
    });
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
      isImageValid: true,
    });
  }

  onImageError = () => {
    this.setState({
      displayLoadingSpinner: false,
      imageDimensions: {},
      isImageLoading: false,
      isImageValid: false,
      isImageLoaded: false,
    });
  }

  onImageSourceBlur = (imageSource) => {
    const isImageSourceEmpty = imageSource.length === 0;

    /*
      Because we do not render the img when image source is empty string, we cannot
      rely on onImageError to be called, which typically would set imageDimensions,
      isImageLoaded, and isImageValid correctly, so we have to do it here as well.
      If the image source is not empty string, we allow onImageLoad or onImageError to
      determine the value of these variables instead.
    */
    const imageDimensions = isImageSourceEmpty ? {} : this.state.imageDimensions;
    const isImageLoaded = isImageSourceEmpty ? false : this.state.isImageLoaded;
    const isImageValid = !isImageSourceEmpty && this.state.isImageValid;

    this.setState({
      imageDimensions,
      imageSource,
      isImageLoading: imageSource.length > 0 && (this.state.imageSource !== imageSource),
      isImageLoaded,
      isImageValid,
    });

    setTimeout(() => {
      if (this.state.isImageLoading) {
        // show loading spinner when image is taking a long time to load
        this.setState({
          displayLoadingSpinner: true,
        });
      }
    }, LOADING_SPINNER_DELAY);
  }

  onImageDescriptionBlur = (imageDescription) => {
    this.setState({
      imageDescription,
    });
  }

  onImageDimensionChange = (dimensionType) => {
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
    this.setState({
      pageNumber: 2,
    });
  }

  onPreviousPageButtonClick = () => {
    this.setState({
      pageNumber: 1,
    });
  }

  onInsertImageButtonClick = () => {
    const isValidImageSource = this.validateImageSource();
    const isValidImageDescription = this.validateImageDescription();
    const isValidImageDimensions = this.validateImageDimensions();
    const isValidFormContent = isValidImageSource.isValid && isValidImageDescription.isValid &&
      isValidImageDimensions.isValid;

    const currentValidationMessages = {};

    if (!isValidImageSource.isValid) {
      currentValidationMessages[imageSourceID] = isValidImageSource.validationMessage;
    }

    if (!isValidImageDescription.isValid) {
      currentValidationMessages[imageDescriptionID] = isValidImageDescription.validationMessage;
    }

    if (!isValidImageDimensions.isValid) {
      currentValidationMessages[imageWidthID] = isValidImageDimensions.validationMessage;
    }

    this.setState({
      isStatusAlertOpen: !isValidFormContent,
      isImageValid: isValidImageSource.isValid,
      isImageDescriptionValid: isValidImageDescription.isValid,
      isImageDimensionsValid: isValidImageDimensions.isValid,
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
        open: false,
      });
    } else {
      this.statusAlertRef.focus();
    }
  }

  onStatusAlertClose = () => {
    if (this.state.pageNumber === 1) {
      this.imageSourceInputRef.focus();
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

  setImageDescriptionInputRef(input) {
    this.imageDescriptionInputRef = input;
  }

  setImageFormRef(input) {
    this.imageFormRef = input;
  }

  setImagePreviewRef(input) {
    this.imgRef = input;
  }

  setImageSourceInputRef(input) {
    this.imageSourceInputRef = input;
  }

  setModalWrapperRef(input) {
    this.modalWrapperRef = input;
  }

  setPreviousButtonRef(input) {
    this.previousPageButtonRef = input;
  }

  setStatusAlertRef(input) {
    this.statusAlertRef = input;
  }

  getNaturalDimension = (dimensionType) => {
    if (this.imgRef) {
      // if value is unparsable (NaN), reset to natural value
      const naturalDimensions = {
        width: this.imgRef.naturalWidth,
        height: this.imgRef.naturalHeight,
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

  getImageSourceInput = () => (
    <InputText
      name="imageSource"
      className={[]}
      label={<WrappedMessage message={messages.editImageModalImageSourceLabel} />}
      description={
        <WrappedMessage
          message={messages.editImageModalImageSourceDescription}
          values={{
            link: '"http://example.url.com/imageName.png"',
          }}
        />
      }
      id={imageSourceID}
      type="text"
      value={this.state.imageSource}
      onBlur={this.onImageSourceBlur}
      inputRef={this.setImageSourceInputRef}
      isValid={this.state.isImageValid}
      validationMessage={<WrappedMessage message={messages.editImageModalImageNotFoundError} />}
      themes={['danger']}
      dangerIconDescription={
        <WrappedMessage message={messages.editImageModalFormError} />
      }
      inputGroupAppend={this.state.displayLoadingSpinner ? (
        <div className="input-group-text">
          <WrappedMessage message={messages.editImageModalImageLoadingIcon}>
            { displayText => (
              <Icon
                id="spinner"
                className={[
                  FontAwesomeStyles.fa,
                  FontAwesomeStyles['fa-spinner'],
                  FontAwesomeStyles['fa-spin'],
                ]}
                screenReaderText={displayText}
              />
            )}
          </WrappedMessage>
        </div>
      ) : null}
    />
  );

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
      isValid={this.state.isImageDimensionsValid}
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
            onChange={this.onImageDimensionChange('width')}
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
            onChange={this.onImageDimensionChange('height')}
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
      ref={this.setImagePreviewRef}
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
      { this.state.imageSource && this.getImage() }
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

  getStatusAlertDialog = () => (
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

  getImageSelectionModalBody = () => (
    <React.Fragment>
      {this.getStatusAlert()}
      <div className="row">
        <div className="col">
          <form ref={this.setImageFormRef}>
            {this.getImageSourceInput()}
          </form>
        </div>
      </div>
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

  handleOpenModal = (event) => {
    const eventSource = event.detail.src;
    let isEventSourceEmpty = true;
    if (eventSource) {
      isEventSourceEmpty = false;
    }

    this.setState({
      // reset state to initial and then add in overrides
      ...initialEditImageModalState,
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
      open: true,
      pageNumber: isEventSourceEmpty ? 1 : 2,
      shouldShowPreviousButton: isEventSourceEmpty,
    });
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

  isPositiveIntegerOrEmpty = (val) => {
    if (val === '' || val === undefined) {
      return true;
    }
    if (Number.isInteger(val) && val > 0) {
      return true;
    }
    return false;
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

  validateImageSource = () => {
    let feedback = { isValid: true };
    const { imageSource, isImageValid } = this.state;

    if (!imageSource || !isImageValid) {
      feedback = {
        isValid: false,
        validationMessage:
          (<WrappedMessage
            message={messages.editImageModalFormValidImageSource}
          />),
        dangerIconDescription: <WrappedMessage message={messages.editImageModalFormError} />,
      };
    }
    return feedback;
  }

  render = () => (
    <div
      ref={this.setModalWrapperRef}
    >
      <Modal
        open={this.state.open}
        title={this.getModalHeader()}
        body={this.getModalBody()}
        closeText="Cancel"
        onClose={this.onEditImageModalClose}
        buttons={[this.getModalButtons()]}
      />
    </div>
  );
}

EditImageModal.propTypes = {
  courseImageAccessibilityDocs: PropTypes.string.isRequired,
};
