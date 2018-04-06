import React from 'react';
import PropTypes from 'prop-types';
import { Button, CheckBox, Icon, InputText, Modal, StatusAlert } from '@edx/paragon';
import classNames from 'classnames';
import FontAwesomeStyles from 'font-awesome/css/font-awesome.min.css';

import messages from './displayMessages';
import styles from './EditImageModal.scss';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';
import rewriteStaticLinks from '../../utils/rewriteStaticLinks';

const LOADING_SPINNER_DELAY = 1000; // in milliseconds

const imageDescriptionID = 'imageDescription';
const imageSourceID = 'imageSource';

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
  isStatusAlertOpen: false,
  imageSource: '',
  imageStyle: '',
  open: false,
  currentValidationMessages: {},
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
    this.onInsertImageButtonClick = this.onInsertImageButtonClick.bind(this);
    this.onImageIsDecorativeClick = this.onImageIsDecorativeClick.bind(this);
    this.onImageLoad = this.onImageLoad.bind(this);
    this.onImageSourceBlur = this.onImageSourceBlur.bind(this);
    this.onStatusAlertClose = this.onStatusAlertClose.bind(this);
    this.validateImageDescription = this.validateImageDescription.bind(this);
    this.validateImageSource = this.validateImageSource.bind(this);

    this.formRef = null;
    this.imageSourceInputRef = null;
    this.imgRef = null;
    this.modalWrapperRef = null;
    this.statusAlertRef = null;
  }

  componentDidMount() {
    this.modalWrapperRef.addEventListener('openModal', this.handleOpenModal);
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

  onInsertImageButtonClick = () => {
    const isValidImageSource = this.validateImageSource();
    const isValidImageDescription = this.validateImageDescription();
    const isValidFormContent = isValidImageSource.isValid && isValidImageDescription.isValid;

    const currentValidationMessages = {};

    if (!isValidImageSource.isValid) {
      currentValidationMessages[imageSourceID] = isValidImageSource.validationMessage;
    }

    if (!isValidImageDescription.isValid) {
      currentValidationMessages[imageDescriptionID] = isValidImageDescription.validationMessage;
    }

    this.setState({
      isStatusAlertOpen: !isValidFormContent,
      currentValidationMessages,
    });

    if (isValidFormContent) {
      this.formRef.dispatchEvent(new CustomEvent('submitForm',
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
    this.imageSourceInputRef.focus();

    this.setState({
      isStatusAlertOpen: false,
    });
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
      inputRef={(input) => { this.imageSourceInputRef = input; }}
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
    <fieldset className="border p-3">
      <legend><WrappedMessage message={messages.editImageModalImageDescriptionLegend} /></legend>
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
    </fieldset>
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
    <fieldset className="border p-3">
      <legend><WrappedMessage message={messages.editImageModalDimensionsLegend} /></legend>
      <div className="form-row">
        <div className="col">
          <InputText
            name="imageWidth"
            label={
              <WrappedMessage
                message={messages.editImageModalImageWidthLabel}
              />
            }
            id="imageWidth"
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
            name="imageHeight"
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
    </fieldset>
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
      ref={(input) => { this.imgRef = input; }}
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
      ref={(input) => { this.statusAlertRef = input; }}
    />
  )

  getModalBody = () => (
    <React.Fragment>
      {this.getStatusAlert()}
      <div className="row">
        <div className="col-sm-4">
          {this.getImagePreview()}
        </div>
        <div className="col">
          <form ref={(input) => { this.formRef = input; }}>
            {this.getImageSourceInput()}
            {this.getImageDescriptionInput()}
            {this.getImageDimensionsInput()}
          </form>
        </div>
      </div>
    </React.Fragment>
  );

  getModalInsertImageButton = () => (
    <Button
      label={
        <WrappedMessage
          message={messages.editImageModalInsertImageButton}
        />
      }
      buttonType="primary"
      onClick={this.onInsertImageButtonClick}
    />
  )

  handleOpenModal = (event) => {
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
      imageSource: event.detail.src || '',
      imageStyle: event.detail.style || '',
      isImageDecorative: event.detail.alt === '',
      // if existing img had a source, assume it could be loaded and show the image preview
      isImageLoaded: !!event.detail.src,
      open: true,
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
      ref={(input) => { this.modalWrapperRef = input; }}
    >
      <Modal
        open={this.state.open}
        title={
          <WrappedMessage
            message={messages.editImageModalTitle}
          />
        }
        body={this.getModalBody()}
        onClose={this.onEditImageModalClose}
        buttons={[this.getModalInsertImageButton()]}
      />
    </div>
  );
}

EditImageModal.propTypes = {
  courseImageAccessibilityDocs: PropTypes.string.isRequired,
};
