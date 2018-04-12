import React from 'react';
import { Button, CheckBox, Icon, InputText, Modal } from '@edx/paragon';
import FontAwesomeStyles from 'font-awesome/css/font-awesome.min.css';

import messages from './displayMessages';
import './EditImageModal.scss';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';
import rewriteStaticLinks from '../../utils/rewriteStaticLinks';

const LOADING_SPINNER_DELAY = 1000; // in milliseconds


export default class EditImageModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      areProportionsLocked: true,
      baseAssetURL: '',
      displayLoadingSpinner: false,
      imageDescription: '',
      imageDimensions: {},
      isImageDecorative: false,
      isImageValid: true,
      imageLoading: false,
      imageSource: '',
      imageStyle: '',
      open: false,
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.onConstrainProportionsClick = this.onConstrainProportionsClick.bind(this);
    this.onImageDescriptionBlur = this.onImageDescriptionBlur.bind(this);
    this.onInsertImageButtonClick = this.onInsertImageButtonClick.bind(this);
    this.onImageIsDecorativeClick = this.onImageIsDecorativeClick.bind(this);
    this.onImageLoad = this.onImageLoad.bind(this);
    this.onImageSourceBlur = this.onImageSourceBlur.bind(this);

    this.formRef = {};
    this.imgRef = null;
    this.modalWrapperRef = null;
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
      imageLoading: false,
      isImageValid: true,
    });
  }

  onImageError = () => {
    this.setState({
      displayLoadingSpinner: false,
      imageDimensions: {},
      imageLoading: false,
      isImageValid: false,
    });
  }

  onImageSourceBlur = (imageSource) => {
    this.setState({
      imageSource,
      imageLoading: imageSource.length > 0 && (this.state.imageSource !== imageSource),
    });

    setTimeout(() => {
      if (this.state.imageLoading) {
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
      name="imageSourceURL"
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
      id="imageSourceURL"
      type="text"
      value={this.state.imageSource}
      onBlur={this.onImageSourceBlur}
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
        description={this.getImageDescriptionDescription()}
        id="imageDescription"
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
            href={'http://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/accessibility/best_practices_course_content_dev.html#use-best-practices-for-describing-images'}
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
      src={this.getImageAssetSource()}
      onLoad={this.onImageLoad}
      onError={this.onImageError}
      ref={(input) => { this.imgRef = input; }}
    />
  );

  getImagePreviewPlaceholder = () => (
    <div className="image-preview"><WrappedMessage message={messages.editImageModalImagePreviewText} /></div>
  );


  getImagePreview = () => (
    <React.Fragment>
      <div className="row">
        <span><WrappedMessage message={messages.editImageModalImagePreviewText} /></span>
      </div>
      {this.state.imageSource ? this.getImage() : this.getImagePreviewPlaceholder()}
    </React.Fragment>
  );

  getModalBody = () => (
    <React.Fragment>
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
      open: true,
    });
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
        onClose={() => { }}
        buttons={[this.getModalInsertImageButton()]}
      />
    </div>
  );
}
