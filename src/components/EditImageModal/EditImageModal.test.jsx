import React from 'react';
import { CheckBox, Modal, InputText, StatusAlert } from '@edx/paragon';

import EditImageModal from './index';
import messages from './displayMessages';
// import rewriteStaticLinks from '../../utils/rewriteStaticLinks';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';
import { mountWithIntl } from '../../utils/i18n/enzymeHelper';

const learnMoreLink = 'http://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/accessibility/best_practices_course_content_dev.html#use-best-practices-for-describing-images';

let wrapper = mountWithIntl(
  <EditImageModal
    courseImageAccessibilityDocs={learnMoreLink}
  />);
let modalBody;
let formContainer;
let nextPageButton;
let insertImageButton;
let imageSourceInput;
let imageDescriptionContainer;
let imageDescriptionInput;
let imageDescriptionInputCheckBox;
let imageDimensionsContainer;
let imageDimensionsWidthInput;
let imageDimensionsHeightInput;
let imageDimensionsInputCheckBox;
let imagePreviewRegion;
let imagePreviewContainer;
let imagePreviewPlaceholder;
let imagePreviewImage;

const sampleText = 'edx.jpg';

const sampleImgData = {
  naturalWidth: 100,
  naturalHeight: 200,
};
sampleImgData.aspectRatio = sampleImgData.naturalWidth / sampleImgData.naturalHeight;

const updateConstants = () => {
  wrapper.update();
  modalBody = wrapper.find('.modal-body');
  formContainer = modalBody.find('div.col form');

  nextPageButton = wrapper.find('.modal-footer button').first();
  insertImageButton = wrapper.find('.modal-footer button').first();

  imagePreviewRegion = modalBody.find('div.row div.col-sm-4');
  imagePreviewContainer = imagePreviewRegion.find('div.image-preview-container');
  imagePreviewPlaceholder = imagePreviewContainer.find('div.image-preview-placeholder');
  imagePreviewImage = imagePreviewPlaceholder.find('img.image-preview-image');

  imageSourceInput = formContainer.find(InputText).filterWhere(input => input.prop('name') === 'imageSource');

  imageDescriptionContainer = formContainer.find('fieldset').at(0);
  imageDescriptionInput = formContainer.find('fieldset').find(InputText).filterWhere(input => input.prop('name') === 'imageDescription');
  imageDescriptionInputCheckBox = imageDescriptionContainer.find(CheckBox);

  imageDimensionsContainer = formContainer.find('fieldset').at(1);
  imageDimensionsWidthInput = formContainer.find('fieldset .form-row .col').find(InputText).filterWhere(input => input.prop('name') === 'imageWidth');
  imageDimensionsHeightInput = formContainer.find('fieldset .form-row .col').find(InputText).filterWhere(input => input.prop('name') === 'imageHeight');
  imageDimensionsInputCheckBox = imageDimensionsContainer.find(CheckBox);
};

// use to remount the EditImageModal at the start of a test for a clean slate
const resetWrapper = () => {
  wrapper = mountWithIntl(
    <EditImageModal
      courseImageAccessibilityDocs={learnMoreLink}
    />);
  updateConstants();
};

/*
  NOTE: due to the use of refs in the EditImageModal, we use mountWithIntl instead of
  shallowWithIntl
*/
describe('EditImageModal', () => {
  updateConstants();

  describe('page 1 renders', () => {
    describe('a modal with', () => {
      it('a closed modal by default', () => {
        expect(wrapper.find('.modal')).toHaveLength(1);
        expect(wrapper.find('.modal-open .modal-backdrop .show')).toHaveLength(0);
      });

      it('an open modal when this.state.open is true', () => {
        wrapper.setState({ open: true });
        expect(wrapper.find('.modal')).toHaveLength(1);
        expect(wrapper.find('.modal .modal-open .modal-backdrop .show')).toHaveLength(1);

        resetWrapper();
      });

      it('modal title text', () => {
        const modalTitle = wrapper.find(Modal).find('.modal-title').find(WrappedMessage);
        expect(modalTitle.prop('message')).toEqual(messages.editImageModalInsertTitle);
      });

      it('a Next page button', () => {
        expect(nextPageButton).toHaveLength(1);

        const nextPageButtonText = nextPageButton.find(WrappedMessage);
        expect(nextPageButtonText.prop('message')).toEqual(messages.editImageModalNextPageButton);
      });
    });

    describe('a modal body with', () => {
      describe('a status alert with', () => {
        const statusAlert = modalBody.find(StatusAlert);

        it('a status alert', () => {
          expect(statusAlert).toHaveLength(1);
        });

        it('a status alert with danger alertType', () => {
          expect(statusAlert.prop('alertType')).toEqual('danger');
        });
      });
    });

    describe('a form with', () => {
      it('a form', () => {
        expect(formContainer).toHaveLength(1);
      });

      describe('an imageSource input with', () => {
        it('an InputText', () => {
          expect(imageSourceInput).toHaveLength(1);
        });

        it('a label', () => {
          const wrappedMessages = imageSourceInput.find(WrappedMessage);
          expect(wrappedMessages).toHaveLength(2);

          const imageSourceInputLabel = imageSourceInput.find('label').find(WrappedMessage);

          // make sure it appears first
          expect(wrappedMessages.at(0).html()).toEqual(imageSourceInputLabel.html());
          expect(imageSourceInputLabel.prop('message')).toEqual(messages.editImageModalImageSourceLabel);
        });

        it('a description', () => {
          const imageSourceInputDescription = imageSourceInput.find('small').find(WrappedMessage);
          expect(imageSourceInputDescription.prop('message')).toEqual(messages.editImageModalImageSourceDescription);
          expect(imageSourceInput.prop('type')).toEqual('text');
          expect(imageSourceInput.prop('id')).toEqual('imageSource');
        });
      });
    });
  });

  describe('page 2 renders', () => {
    beforeEach(() => {
      wrapper.setState({
        pageNumber: 2,
        shouldShowPreviousButton: true,
      });
      updateConstants();
    });
    afterEach(() => {
      resetWrapper();
    });
    describe('a modal with', () => {
      it('modal title text', () => {
        const modalTitle = wrapper.find(Modal).find('.modal-title').find(WrappedMessage);
        expect(modalTitle.prop('message')).toEqual(messages.editImageModalEditTitle);
      });

      it('an Insert Image button', () => {
        expect(insertImageButton).toHaveLength(1);

        const insertImageButtonText = insertImageButton.find(WrappedMessage);
        expect(insertImageButtonText.prop('message')).toEqual(messages.editImageModalInsertImageButton);
      });
    });

    describe('a modal body with', () => {
      describe('a status alert with', () => {
        beforeEach(() => {
          wrapper.setState({
            pageNumber: 2,
            shouldShowPreviousButton: true,
          });
          updateConstants();
        });
        afterEach(() => {
          resetWrapper();
        });
        const statusAlert = modalBody.find(StatusAlert);

        it('a status alert', () => {
          expect(statusAlert).toHaveLength(1);
        });

        it('a status alert with danger alertType', () => {
          expect(statusAlert.prop('alertType')).toEqual('danger');
        });
      });
    });

    describe('a form with', () => {
      it('a form', () => {
        expect(formContainer).toHaveLength(1);
      });

      describe('an imageDescription fieldset with', () => {
        it('a fieldset', () => {
          expect(imageDescriptionContainer).toHaveLength(1);
        });

        it('a legend', () => {
          expect(imageDescriptionContainer.find('legend').find(WrappedMessage).prop('message')).toEqual(messages.editImageModalImageDescriptionLegend);
        });

        it('an InputText', () => {
          expect(imageDescriptionInput).toHaveLength(1);
        });

        describe('an imageDescription input with', () => {
          it('a label', () => {
            const wrappedMessages = imageDescriptionInput.find(WrappedMessage);
            expect(wrappedMessages).toHaveLength(3);

            const imageDescriptionInputLabel = imageDescriptionInput.find('label').find(WrappedMessage);
            // make sure it appears first
            expect(wrappedMessages.at(0).html()).toEqual(imageDescriptionInputLabel.html());
            expect(imageDescriptionInputLabel.prop('message')).toEqual(messages.editImageModalImageDescriptionLabel);
          });

          it('a description', () => {
            const imageDescriptionInputDescription = imageDescriptionInput.find('small').find(WrappedMessage);
            expect(imageDescriptionInputDescription).toHaveLength(2);

            expect(imageDescriptionInputDescription.at(0).prop('message')).toEqual(messages.editImageModalImageDescriptionDescription);
            expect(imageDescriptionInputDescription.at(1).prop('message')).toEqual(messages.editImageModalLearnMore);
          });

          it('a Learn More link', () => {
            const imageDescriptionInputDescription = imageDescriptionInput.find('small').find(WrappedMessage);

            const learnMoreLinkElement = imageDescriptionInputDescription.at(1).find('a');
            expect(learnMoreLinkElement).toHaveLength(1);
            expect(learnMoreLinkElement.find({ href: learnMoreLink })).toHaveLength(1);
          });

          it('a correct InputText props', () => {
            expect(imageDescriptionInput.prop('type')).toEqual('text');
            expect(imageDescriptionInput.prop('id')).toEqual('imageDescription');
          });
        });

        describe('a CheckBox with', () => {
          it('a CheckBox', () => {
            expect(imageDescriptionInputCheckBox).toHaveLength(1);
          });

          it('correct CheckBox props', () => {
            expect(imageDescriptionInputCheckBox.prop('id')).toEqual('isDecorative');
            expect(imageDescriptionInputCheckBox.prop('name')).toEqual('isDecorative');
          });

          it('a label', () => {
            const imageDescriptionInputCheckBoxLabel = imageDescriptionInputCheckBox.find('label').find(WrappedMessage);
            expect(imageDescriptionInputCheckBoxLabel.prop('message')).toEqual(messages.editImageModalImageIsDecorativeCheckboxLabel);
          });

          it('a description', () => {
            const imageDescriptionInputCheckBoxDescription = imageDescriptionInputCheckBox.find('small').find(WrappedMessage);
            expect(imageDescriptionInputCheckBoxDescription.at(0).prop('message')).toEqual(messages.editImageModalImageIsDecorativeCheckboxDescription);
            expect(imageDescriptionInputCheckBoxDescription.at(1).prop('message')).toEqual(messages.editImageModalLearnMore);
          });

          it('a "Learn more." link', () => {
            const imageDescriptionInputCheckBoxDescription = imageDescriptionInputCheckBox.find('small').find(WrappedMessage);
            const learnMoreLinkElement = imageDescriptionInputCheckBoxDescription.at(1).find('a');
            expect(learnMoreLinkElement).toHaveLength(1);
            expect(learnMoreLinkElement.find({ href: learnMoreLink })).toHaveLength(1);
          });
        });
      });

      describe('an imageDimensions fieldset with', () => {
        it('a fieldset', () => {
          expect(imageDimensionsContainer).toHaveLength(1);
        });

        it('a legend', () => {
          expect(imageDimensionsContainer.find('legend').find(WrappedMessage).prop('message')).toEqual(messages.editImageModalDimensionsLegend);
        });

        it('a form-row', () => {
          expect(imageDimensionsContainer.find('div.form-row')).toHaveLength(1);
        });

        it('a legend and a form-row as adjacent siblings', () => {
          expect(imageDimensionsContainer.find('legend + div.form-row')).toHaveLength(1);
        });

        describe('an imageDimensionsWidth input with', () => {
          it('a width InputText', () => {
            expect(imageDimensionsWidthInput).toHaveLength(1);
          });

          it('a width label', () => {
            const imageWidthInputLabel = imageDimensionsWidthInput.find('label').find(WrappedMessage);
            expect(imageWidthInputLabel.prop('message')).toEqual(messages.editImageModalImageWidthLabel);
          });

          it('correct width InputText props', () => {
            expect(imageDimensionsWidthInput.prop('type')).toEqual('number');
            expect(imageDimensionsWidthInput.prop('id')).toEqual('imageWidth');
          });
        });

        describe('an imageDimensionsHeight input with', () => {
          it('a height InputText', () => {
            expect(imageDimensionsHeightInput).toHaveLength(1);
          });

          it('a height label', () => {
            const imageHeightInputLabel = imageDimensionsHeightInput.find('label').find(WrappedMessage);
            expect(imageHeightInputLabel.prop('message')).toEqual(messages.editImageModalImageHeightLabel);
          });

          it('correct height InputText props', () => {
            expect(imageDimensionsHeightInput.prop('type')).toEqual('number');
            expect(imageDimensionsHeightInput.prop('id')).toEqual('imageHeight');
          });
        });

        describe('an imageDimensionsHeight input with', () => {
          it('a CheckBox', () => {
            expect(imageDimensionsInputCheckBox).toHaveLength(1);
          });
          it('correct CheckBox props', () => {
            expect(imageDimensionsInputCheckBox.prop('id')).toEqual('lockProportions');
            expect(imageDimensionsInputCheckBox.prop('name')).toEqual('lockProportions');
          });
          it('a label', () => {
            const imageDescriptionInputCheckBoxLabel = imageDimensionsInputCheckBox.find('label').find(WrappedMessage);
            expect(imageDescriptionInputCheckBoxLabel.prop('message')).toEqual(messages.editImageModalLockImageProportionsCheckboxLabel);
          });
        });
      });
    });
  });

  describe('Modal', () => {
    it('this.state.open is false by default', () => {
      expect(wrapper.state('open')).toEqual(false);
    });

    it('modal is not open by default', () => {
      expect(wrapper.find(Modal).prop('open')).toEqual(false);
    });

    it('this.state.baseAssetURL is empty string by default', () => {
      expect(wrapper.state('baseAssetURL')).toEqual('');
    });

    it('openModal event listener sets correct state for empty event (inserting an image)', () => {
      const modalRef = wrapper.instance().modalWrapperRef;

      modalRef.dispatchEvent(new CustomEvent('openModal', { detail: {} }));

      expect(wrapper.state('baseAssetURL')).toEqual('');
      expect(wrapper.state('imageDescription')).toEqual('');
      expect(wrapper.state('imageDimensions')).toEqual({});
      expect(wrapper.state('imageStyle')).toEqual('');
      expect(wrapper.state('imageSource')).toEqual('');
      expect(wrapper.state('isImageDecorative')).toEqual(false);
      expect(wrapper.state('isImageLoaded')).toEqual(false);
      expect(wrapper.state('open')).toEqual(true);

      resetWrapper();
    });

    it('openModal event listener sets correct state for event with data (editing an image)', () => {
      const modalRef = wrapper.instance().modalWrapperRef;

      modalRef.dispatchEvent(new CustomEvent('openModal', {
        detail: {
          alt: sampleText,
          baseAssetUrl: sampleText,
          height: sampleImgData.naturalHeight,
          src: sampleText,
          style: sampleText,
          width: sampleImgData.naturalWidth,
        },
      }));

      expect(wrapper.state('baseAssetURL')).toEqual(sampleText);
      expect(wrapper.state('imageDescription')).toEqual(sampleText);
      expect(wrapper.state('imageDimensions')).toEqual({
        width: sampleImgData.naturalWidth,
        height: sampleImgData.naturalHeight,
        aspectRatio: sampleImgData.aspectRatio,
      });
      expect(wrapper.state('isImageDecorative')).toEqual(false);
      expect(wrapper.state('imageStyle')).toEqual(sampleText);
      expect(wrapper.state('imageSource')).toEqual(sampleText);
      expect(wrapper.state('isImageDecorative')).toEqual(false);
      expect(wrapper.state('isImageLoaded')).toEqual(true);
      expect(wrapper.state('open')).toEqual(true);

      resetWrapper();
    });

    it('onEditImageModalClose sets this.state.open to false', () => {
      const closeModalButton = wrapper.find('.modal-footer button').at(1);
      closeModalButton.simulate('click');

      expect(wrapper.state('open')).toEqual(false);

      resetWrapper();
    });
  });

  describe('Status Alert', () => {
    beforeEach(() => {
      wrapper.setState({
        pageNumber: 2,
        shouldShowPreviousButton: true,
      });
      updateConstants();
    });
    afterEach(() => {
      resetWrapper();
    });

    it('this.state.isStatusAlertOpen is false by default', () => {
      expect(wrapper.state('isStatusAlertOpen')).toEqual(false);
    });

    it('this.state.isStatusAlertOpen is true if invalid form submitted', () => {
      insertImageButton.simulate('click');

      expect(wrapper.state('isStatusAlertOpen')).toEqual(true);
    });

    it('this.state.isStatusAlertOpen is false when status alert is closed', () => {
      insertImageButton.simulate('click');

      const closeStatusAlertButton = wrapper.find(StatusAlert).find('button');
      closeStatusAlertButton.simulate('click');

      expect(wrapper.find(StatusAlert).prop('open')).toEqual(false);
    });

    it('status alert is not displayed by default', () => {
      expect(wrapper.find(StatusAlert).prop('open')).toEqual(false);
    });

    it('status alert is displayed if invalid form submitted', () => {
      insertImageButton.simulate('click');

      expect(wrapper.find(StatusAlert).prop('open')).toEqual(true);
    });

    it('this.state.currentValidationMessages is empty object by default', () => {
      expect(wrapper.state('currentValidationMessages')).toEqual({});
    });

    it('this.state.currentValidationMessages has correct validation messages when invalid form submitted', () => {
      insertImageButton.simulate('click');

      expect(wrapper.state('currentValidationMessages').imageSource.props.message).toEqual(messages.editImageModalFormValidImageSource);
      expect(wrapper.state('currentValidationMessages').imageDescription.props.message).toEqual(messages.editImageModalFormValidImageDescription);
    });

    it('this.state.currentValidationMessages has correct validation message when invalid image description submitted', () => {
      wrapper.setState({
        imageSource: sampleText,
      });
      insertImageButton.simulate('click');

      expect(wrapper.state('currentValidationMessages')).not.toHaveProperty('imageSource');
      expect(wrapper.state('currentValidationMessages').imageDescription.props.message).toEqual(messages.editImageModalFormValidImageDescription);
    });

    it('this.state.currentValidationMessages has correct validation message when invalid image source submitted', () => {
      wrapper.setState({
        imageDescription: sampleText,
      });
      insertImageButton.simulate('click');

      expect(wrapper.state('currentValidationMessages').imageSource.props.message).toEqual(messages.editImageModalFormValidImageSource);
      expect(wrapper.state('currentValidationMessages')).not.toHaveProperty('imageDescription');
    });

    it('this.state.currentValidationMessages has correct validation message when invalid image dimensions submitted', () => {
      wrapper.setState({
        imageSource: sampleText,
        imageDescription: sampleText,
        imageDimensions: {
          height: -100,
          width: -100,
        },
      });

      insertImageButton.simulate('click');

      expect(wrapper.state('currentValidationMessages').imageWidth.props.message).toEqual(messages.editImageModalFormValidImageDimensions);
      expect(wrapper.state('currentValidationMessages')).not.toHaveProperty('imageSource');
      expect(wrapper.state('currentValidationMessages')).not.toHaveProperty('imageDescription');

      resetWrapper();
    });

    it('this.state.currentValidationMessages is empty when valid form submitted', () => {
      wrapper.setState({
        imageSource: sampleText,
        imageDescription: sampleText,
      });
      insertImageButton.simulate('click');

      expect(wrapper.state('currentValidationMessages')).not.toHaveProperty('imageSource');
      expect(wrapper.state('currentValidationMessages')).not.toHaveProperty('imageDescription');
    });

    it('status alert has correct validation messages when invalid form submitted', () => {
      wrapper.setState({
        imageDimensions: {
          height: -100,
          width: -100,
        },
      });

      insertImageButton.simulate('click');

      const statusAlert = wrapper.find(StatusAlert);

      expect(statusAlert.find(WrappedMessage).first().prop('message')).toEqual(messages.editImageModalFormErrorMissingFields);

      const statusAlertListBullets = statusAlert.find('div ul.bullet-list').find(WrappedMessage);
      expect(statusAlertListBullets).toHaveLength(3);

      expect(statusAlert.find('div ul.bullet-list').find(WrappedMessage).first().prop('message')).toEqual(messages.editImageModalFormValidImageSource);
      expect(statusAlert.find('div ul.bullet-list').find(WrappedMessage).at(1).prop('message')).toEqual(messages.editImageModalFormValidImageDescription);
      expect(statusAlert.find('div ul.bullet-list').find(WrappedMessage).at(2).prop('message')).toEqual(messages.editImageModalFormValidImageDimensions);

      resetWrapper();
    });

    it('validation messages are hyperlinks that navigate to appropriate form elements', () => {
      wrapper.setState({
        imageDimensions: {
          height: -100,
          width: -100,
        },
      });

      insertImageButton.simulate('click');

      const statusAlert = wrapper.find(StatusAlert);

      const statusAlertListItems = statusAlert.find('div ul.bullet-list li a');
      expect(statusAlertListItems).toHaveLength(3);

      expect(statusAlertListItems.first().prop('href')).toEqual('#imageSource');
      expect(statusAlertListItems.at(1).prop('href')).toEqual('#imageDescription');
      expect(statusAlertListItems.at(2).prop('href')).toEqual('#imageWidth');

      resetWrapper();
    });

    it('status alert has correct validation message when invalid image description submitted', () => {
      wrapper.setState({
        imageSource: sampleText,
      });
      insertImageButton.simulate('click');

      const statusAlert = wrapper.find(StatusAlert);

      expect(statusAlert.find(WrappedMessage).first().prop('message')).toEqual(messages.editImageModalFormErrorMissingFields);

      const statusAlertListBullets = statusAlert.find('div ul.bullet-list').find(WrappedMessage);
      expect(statusAlertListBullets).toHaveLength(1);
      expect(statusAlert.find('div ul.bullet-list').find(WrappedMessage).first().prop('message')).toEqual(messages.editImageModalFormValidImageDescription);
    });

    it('status alert has correct validation message when invalid image source submitted', () => {
      wrapper.setState({
        imageDescription: sampleText,
      });
      insertImageButton.simulate('click');

      const statusAlert = wrapper.find(StatusAlert);

      expect(statusAlert.find(WrappedMessage).first().prop('message')).toEqual(messages.editImageModalFormErrorMissingFields);

      const statusAlertListBullets = statusAlert.find('div ul.bullet-list').find(WrappedMessage);
      expect(statusAlertListBullets).toHaveLength(1);
      expect(statusAlert.find('div ul.bullet-list').find(WrappedMessage).first().prop('message')).toEqual(messages.editImageModalFormValidImageSource);
    });

    // needs updated so that clicking next triggers the status alert
    // it('focus on page 1 is moved to imageSourceInput when status alert is closed', () => {
    //   wrapper.setState({ pageNumber: 1 });
    //   updateConstants();
    //   insertImageButton.simulate('click');

    //   const closeStatusAlertButton = wrapper.find(StatusAlert).find('button');
    //   closeStatusAlertButton.simulate('click');

    //   expect(document.activeElement).toEqual(wrapper.instance().imageSourceInputRef);
    // });

    it('focus on page 2 is moved to previous button when status alert is closed', () => {
      insertImageButton.simulate('click');

      const closeStatusAlertButton = wrapper.find(StatusAlert).find('button');
      closeStatusAlertButton.simulate('click');

      expect(document.activeElement).toEqual(wrapper.instance().previousPageButtonRef);
    });
  });

  describe('Validation Messages', () => {
    it('isValid states for each field is false if invalid form data submitted', () => {
      wrapper.setState({
        imageDimensions: {
          height: -100,
          width: -100,
        },
        pageNumber: 2,
        shouldShowPreviousButton: true,
      });
      updateConstants();

      insertImageButton.simulate('click');

      expect(wrapper.state('isImageValid')).toEqual(false);
      expect(wrapper.state('isImageDescriptionValid')).toEqual(false);
      expect(wrapper.state('isImageDimensionsValid')).toEqual(false);
      resetWrapper();
    });

    it('input and fieldsets show validation messages if invalid form data submitted', () => {
      wrapper.setState({
        imageDimensions: {
          height: -100,
          width: -100,
        },
        pageNumber: 2,
        shouldShowPreviousButton: true,
      });
      updateConstants();

      insertImageButton.simulate('click');
      /* eslint-disable max-len */
      // Commenting out tests as workflow has changed
      // const imageSourceValidation = wrapper.find('#error-imageSource').find(WrappedMessage);
      // expect(imageSourceValidation).toHaveLength(2); // first is the danger icon description
      // expect(imageSourceValidation.at(1).prop('message')).toEqual(messages.editImageModalImageNotFoundError);
      /* eslint-enable max-len */
      const imageDescriptionValidation = wrapper.find('#error-imageDescriptionFieldset').find(WrappedMessage);
      expect(imageDescriptionValidation).toHaveLength(2);
      expect(imageDescriptionValidation.at(1).prop('message')).toEqual(messages.editImageModalFormValidImageDescription);

      const imageDimensionsValidation = wrapper.find('#error-imageDimensionsFieldset').find(WrappedMessage);
      expect(imageDimensionsValidation).toHaveLength(2);
      expect(imageDimensionsValidation.at(1).prop('message')).toEqual(messages.editImageModalFormValidImageDimensions);

      resetWrapper();
    });
  });

  // commented out tests need to rethink how to test this workflow
  // as it should be loaded by the time user gets to this page
  // onclick of next button on page 1
  describe('Image Preview', () => {
    afterEach(() => {
      resetWrapper();
    });
    // it('this.state.imageDimensions are set on image load', () => {
    //   // trigger img element to show
    //   imageSourceInput.find('input').simulate('change', { target: { value: sampleText } });
    //   imageSourceInput.find('input').simulate('blur');

    //   wrapper.find('img').simulate('load', { target: { ...sampleImgData } });

    //   expect(wrapper.state('imageDimensions')).toEqual({
    //     width: sampleImgData.naturalWidth,
    //     height: sampleImgData.naturalHeight,
    //     aspectRatio: sampleImgData.naturalWidth / sampleImgData.naturalHeight,
    //   });
    // });

    it('this.state.isImageLoading is false by default', () => {
      expect(wrapper.state('isImageLoading')).toEqual(false);
    });

    // it('this.state.isImageLoading is set on image load', () => {
    //   // trigger img element to show
    //   imageSourceInput.find('input').simulate('change', { target: { value: sampleText } });
    //   imageSourceInput.find('input').simulate('blur');

    //   wrapper.find('img').simulate('load', { target: { ...sampleImgData } });

    //   expect(wrapper.state('isImageLoading')).toEqual(false);
    // });

    // it('this.state.isImageLoading is set on image error', () => {
    //   // trigger img element to show
    //   imageSourceInput.find('input').simulate('change', { target: { value: sampleText } });
    //   imageSourceInput.find('input').simulate('blur');

    //   wrapper.find('img').simulate('error');

    //   expect(wrapper.state('isImageLoading')).toEqual(false);
    // });

    it('this.state.isImageLoaded is false by default', () => {
      expect(wrapper.state('isImageLoaded')).toEqual(false);
    });

    it('with visible image preview image when this.state.isImageLoaded is false (default)', () => {
      wrapper.setState({
        imageSource: sampleText,
        pageNumber: 2,
        shouldShowPreviousButton: true,
      });

      updateConstants();

      expect(imagePreviewImage.prop('className')).toEqual(expect.stringContaining('invisible'));
    });

    it('with visible image preview image when this.state.isImageLoaded is true ', () => {
      wrapper.setState({
        imageSource: sampleText,
        isImageLoaded: true,
        pageNumber: 2,
        shouldShowPreviousButton: true,
      });

      updateConstants();

      // TODO: replace this with asymmetric matcher expect.not.stringContaining when released
      expect(imagePreviewImage.prop('className').includes('invisible')).toEqual(false);
    });

    it('with visible image preview placeholder text when this.state.isImageLoaded is false (default)', () => {
      wrapper.setState({
        pageNumber: 2,
        shouldShowPreviousButton: true,
      });
      updateConstants();
      const imagePreviewPlaceholderText = imagePreviewPlaceholder.find(WrappedMessage).find('FormattedMessage').find('span');
      expect(imagePreviewPlaceholderText).toHaveLength(1);
      // TODO: replace this with asymmetric matcher expect.not.stringContaining when released
      expect(imagePreviewPlaceholderText.prop('className').includes('invisible')).toEqual(false);
    });

    it('with invisible image preview placeholder text when this.state.isImageLoaded is true', () => {
      wrapper.setState({
        isImageLoaded: true,
        pageNumber: 2,
        shouldShowPreviousButton: true,
      });

      updateConstants();

      const imagePreviewPlaceholderText = imagePreviewPlaceholder.find(WrappedMessage).find('FormattedMessage').find('span');
      expect(imagePreviewPlaceholderText).toHaveLength(1);
      expect(imagePreviewPlaceholderText.prop('className')).toEqual(expect.stringContaining('invisible'));
    });
  });

  // Commenting this out for now as we're going to create a new way to insert images
  // and workflow changes to test here
  /* eslint-disable max-len */
  // describe('Image Source Input', () => {
  //   afterEach(() => {
  //     resetWrapper();
  //   });
  //   it('this.state.imageSource is empty string by default', () => {
  //     expect(wrapper.state('imageSource')).toEqual('');
  //   });

  //   it('value is empty string by default', () => {
  //     expect(imageSourceInput.prop('value')).toEqual('');
  //   });

  //   it('displays this.state.imageSource as value', () => {
  //     wrapper.setState({
  //       imageSource: sampleText,
  //     });

  //     updateConstants();

  //     expect(imageSourceInput.prop('value')).toEqual(sampleText);
  //   });

  //   it('sets this.state.imageSource with value onBlur', () => {
  //     imageSourceInput.find('input').simulate('change', { target: { value: sampleText } });
  //     imageSourceInput.find('input').simulate('blur');

  //     expect(wrapper.state('imageSource')).toEqual(sampleText);
  //   });

  //   it('sets this.state.imageDimensions to empty object when image source is empty string onBlur', () => {
  //     imageSourceInput.find('input').simulate('change', { target: { value: '' } });
  //     imageSourceInput.find('input').simulate('blur');

  //     expect(wrapper.state('imageDimensions')).toEqual({});
  //   });

  //   it('sets this.state.isImageLoaded to empty object when image source is empty string onBlur', () => {
  //     imageSourceInput.find('input').simulate('change', { target: { value: '' } });
  //     imageSourceInput.find('input').simulate('blur');

  //     expect(wrapper.state('isImageLoaded')).toEqual(false);
  //   });

  //   it('sets this.state.isImageLoaded to empty object when image source is empty string onBlur', () => {
  //     imageSourceInput.find('input').simulate('change', { target: { value: '' } });
  //     imageSourceInput.find('input').simulate('blur');

  //     expect(wrapper.state('isImageValid')).toEqual(false);
  //   });

  //   it('sets this.state.isImageLoaded to empty object when image source is empty string onBlur', () => {
  //     imageSourceInput.find('input').simulate('change', { target: { value: '' } });
  //     imageSourceInput.find('input').simulate('blur');

  //     expect(wrapper.state('isImageValid')).toEqual(false);
  //   });

  //   it('sets this.state.isImageLoading to true and displays spinner with non-empty imageSource', () => {
  //     jest.useFakeTimers();
  //     imageSourceInput.find('input').simulate('change', { target: { value: sampleText } });
  //     imageSourceInput.find('input').simulate('blur');

  //     expect(wrapper.state('isImageLoading')).toEqual(true);

  //     jest.runAllTimers();
  //     updateConstants();
  //     expect(wrapper.state('displayLoadingSpinner')).toEqual(true);
  //     expect(imageSourceInput.find('.fa-spinner').length).toEqual(1);
  //   });

  //   it('sets this.state.isImageLoading to false and does not display spinner with empty imageSource', () => {
  //     jest.useFakeTimers();
  //     imageSourceInput.find('input').simulate('change', { target: { value: '' } });
  //     imageSourceInput.find('input').simulate('blur');

  //     expect(wrapper.state('isImageLoading')).toEqual(false);

  //     jest.runAllTimers();
  //     updateConstants();
  //     expect(wrapper.state('displayLoadingSpinner')).toEqual(false);
  //     expect(imageSourceInput.find('.fa-spinner').length).toEqual(0);
  //   });

  //   it('sets this.state.isImageLoading to false and does not display spinner when new imageSource value equals existing value', () => {
  //     jest.useFakeTimers();
  //     wrapper.setState({
  //       imageSource: sampleText,
  //     });
  //     imageSourceInput.find('input').simulate('change', { target: { value: sampleText } });
  //     imageSourceInput.find('input').simulate('blur');

  //     expect(wrapper.state('isImageLoading')).toEqual(false);

  //     jest.runAllTimers();
  //     updateConstants();
  //     expect(wrapper.state('displayLoadingSpinner')).toEqual(false);
  //     expect(imageSourceInput.find('.fa-spinner').length).toEqual(0);
  //   });

  //   it('sets isImageLoading to false, isImageLoaded to true, and isValid to true when image preview loads successfully', () => {
  //     imageSourceInput.find('input').simulate('change', { target: { value: sampleText } });
  //     imageSourceInput.find('input').simulate('blur');

  //     wrapper.find('img').simulate('load', { target: { ...sampleImgData } });

  //     expect(wrapper.state('isImageLoading')).toEqual(false);
  //     expect(wrapper.state('isImageLoaded')).toEqual(true);
  //     expect(wrapper.state('isImageValid')).toEqual(true);
  //   });

  //   it('sets isImageLoading to false, isImageLoaded to false, and isValid to false when image preview load errors', () => {
  //     imageSourceInput.find('input').simulate('change', { target: { value: sampleText } });
  //     imageSourceInput.find('input').simulate('blur');

  //     wrapper.find('img').simulate('error');

  //     expect(wrapper.state('isImageLoading')).toEqual(false);
  //     expect(wrapper.state('isImageLoaded')).toEqual(false);
  //     expect(wrapper.state('isImageValid')).toEqual(false);
  //   });
  // });
  /* eslint-enable max-len */
  describe('Image Description Input', () => {
    beforeEach(() => {
      wrapper.setState({
        pageNumber: 2,
        shouldShowPreviousButton: true,
      });
      updateConstants();
    });
    afterEach(() => {
      resetWrapper();
    });
    it('this.state.imageDescription is empty string by default', () => {
      expect(wrapper.state('imageDescription')).toEqual('');
    });

    it('this.state.isImageDecorative is false by default', () => {
      expect(wrapper.state('isImageDecorative')).toEqual(false);
    });

    it('value is empty string by default', () => {
      expect(imageDescriptionInput.prop('value')).toEqual('');
    });

    it('checkbox is unchecked by default', () => {
      expect(imageDescriptionInputCheckBox.prop('checked')).toEqual(false);
    });

    it('displays this.state.imageSource as value', () => {
      wrapper.setState({
        imageDescription: sampleText,
      });
      updateConstants();
      expect(imageDescriptionInput.prop('value')).toEqual(sampleText);
    });

    it('sets this.state.imageSource with value onBlur', () => {
      imageDescriptionInput.find('input').simulate('change', { target: { value: sampleText } });
      imageDescriptionInput.find('input').simulate('blur');

      expect(wrapper.state('imageDescription')).toEqual(sampleText);
    });

    it('sets this.state.isImageDecorative with value on checkbox onChange', () => {
      imageDescriptionInputCheckBox.find('input').simulate('change', { target: { value: true } });

      expect(wrapper.state('isImageDecorative')).toEqual(true);
    });

    it('displays this.state.isImageDecorative as checkbox checked', () => {
      wrapper.setState({
        isImageDecorative: true,
      });
      updateConstants();
      expect(imageDescriptionInputCheckBox.prop('checked')).toEqual(true);
    });

    it('toggles image description disabled prop via checkbox', () => {
      wrapper.setState({
        isImageDecorative: true,
      });
      updateConstants();
      expect(imageDescriptionInput.prop('disabled')).toEqual(true);

      wrapper.setState({
        isImageDecorative: false,
      });
      updateConstants();
      expect(imageDescriptionInput.prop('disabled')).toEqual(false);
    });

    it('returns correct feedback for invalid description (uses initial state)', () => {
      const feedback = wrapper.instance().validateImageDescription();

      expect(feedback.isValid).toEqual(false);
      expect(feedback.validationMessage.props.message)
        .toEqual(messages.editImageModalFormValidImageDescription);
      expect(feedback.dangerIconDescription.props.message)
        .toEqual(messages.editImageModalFormError);
    });

    it('returns correct feedback for valid description (with non-empty description)', () => {
      wrapper.setState({
        imageDescription: sampleText,
      });

      const feedback = wrapper.instance().validateImageDescription();

      expect(feedback.isValid).toEqual(true);
      expect(feedback.validationMessage).toBeUndefined();
      expect(feedback.dangerIconDescription).toBeUndefined();
    });

    it('returns correct feedback for valid description (with checked checkbox)', () => {
      wrapper.setState({
        isImageDecorative: true,
      });

      const feedback = wrapper.instance().validateImageDescription();

      expect(feedback.isValid).toEqual(true);
      expect(feedback.validationMessage).toBeUndefined();
      expect(feedback.dangerIconDescription).toBeUndefined();
    });
  });

  describe('Image Dimensions Input', () => {
    beforeEach(() => {
      wrapper.setState({
        pageNumber: 2,
        shouldShowPreviousButton: true,
      });
      updateConstants();
    });
    afterEach(() => {
      resetWrapper();
    });
    it('this.state.imageDimensions is empty object by default', () => {
      expect(wrapper.state('imageDimensions')).toEqual({});
    });

    it('this.state.areProportionsLocked is true by default', () => {
      expect(wrapper.state('areProportionsLocked')).toEqual(true);
    });

    it('width input value is empty string by default', () => {
      expect(imageDimensionsWidthInput.prop('value')).toEqual('');
    });

    it('height input value is empty string by default', () => {
      expect(imageDimensionsHeightInput.prop('value')).toEqual('');
    });

    it('checkbox is unchecked by default', () => {
      expect(imageDimensionsInputCheckBox.prop('checked')).toEqual(true);
    });

    it('sets this.state.isImageDecorative with value on checkbox onChange', () => {
      imageDimensionsInputCheckBox.find('input').simulate('change', { target: { value: true } });

      expect(wrapper.state('areProportionsLocked')).toEqual(true);
    });

    it('displays this.state.areProportionsLocked as checkbox checked', () => {
      wrapper.setState({
        areProportionsLocked: true,
      });

      updateConstants();
      expect(imageDimensionsInputCheckBox.prop('checked')).toEqual(true);
    });
    /* eslint-disable max-len */
    // commenting these out as there will be a new workflow and they need reworked anyway
    // describe('this.state.imageDimensions responds correctly to locked proportions', () => {
    //   beforeEach(() => {
    //     imageSourceInput.find('input').simulate('change', { target: { value: sampleText } });
    //     imageSourceInput.find('input').simulate('blur');

    //     wrapper.find('img').simulate('load', { target: { ...sampleImgData } });
    //   });

    //   it('height responds to width change', () => {
    //     imageDimensionsWidthInput.find('input').simulate('change', { target: { value: 50 } });

    //     updateConstants();

    //     expect(wrapper.state('imageDimensions')).toEqual({
    //       width: 50,
    //       height: 100,
    //       aspectRatio: sampleImgData.naturalWidth / sampleImgData.naturalHeight,
    //     });
    //   });

    //   it('width responds to height change', () => {
    //     imageDimensionsHeightInput.find('input').simulate('change', { target: { value: 400 } });

    //     updateConstants();

    //     expect(wrapper.state('imageDimensions')).toEqual({
    //       width: 200,
    //       height: 400,
    //       aspectRatio: sampleImgData.naturalWidth / sampleImgData.naturalHeight,
    //     });
    //   });
    // });

    // describe('this.state.imageDimensions responds correctly to unlocked proportions', () => {
    //   beforeEach(() => {
    //     imageDimensionsInputCheckBox.find('input').simulate('change', { target: { value: false } });
    //     imageSourceInput.find('input').simulate('change', { target: { value: sampleText } });
    //     imageSourceInput.find('input').simulate('blur');

    //     wrapper.find('img').simulate('load', { target: { ...sampleImgData } });
    //   });
    //   afterEach(() => {
    //     resetWrapper();
    //   });

    //   it('height does not respond to width change', () => {
    //     imageDimensionsWidthInput.find('input').simulate('change', { target: { value: 50 } });

    //     updateConstants();

    //     expect(wrapper.state('imageDimensions')).toEqual({
    //       width: 50,
    //       height: sampleImgData.naturalHeight,
    //       aspectRatio: sampleImgData.naturalWidth / sampleImgData.naturalHeight,
    //     });
    //   });

    //   it('width does not respond to height change', () => {
    //     imageDimensionsHeightInput.find('input').simulate('change', { target: { value: 400 } });

    //     updateConstants();

    //     expect(wrapper.state('imageDimensions')).toEqual({
    //       width: sampleImgData.naturalWidth,
    //       height: 400,
    //       aspectRatio: sampleImgData.naturalWidth / sampleImgData.naturalHeight,
    //     });
    //   });
    // });
    /* eslint-enable max-len */
    it('throws an Error for an unknown dimension type', () => {
      expect(() => wrapper.instance().onImageDimensionChange(sampleText)).toThrow(Error);
      expect(() => wrapper.instance().onImageDimensionChange(sampleText)).toThrow(`Unknown dimension type ${sampleText}.`);
    });
  });

  describe('Insert Image button', () => {
    let event;
    let validationMock;

    beforeEach(() => {
      event = null;
      wrapper.setState({
        pageNumber: 2,
        shouldShowPreviousButton: true,
      });
      updateConstants();

      const imageFormRef = wrapper.instance().imageFormRef;
      imageFormRef.addEventListener('submitForm', (e) => { event = e; });

      /*
        Let's make form valid by default. The reason we mock the validation
        functions instead of setting valid input for the appropriate fields
        is to avoid the creation of imgRef when imageSource is not falsy,
        which messes with some of the tests.
      */
      validationMock = jest.fn();
      validationMock.mockReturnValue({ isValid: true });

      wrapper.instance().validateImageSource = validationMock;
      wrapper.instance().validateImageDescription = validationMock;
    });
    afterEach(() => {
      resetWrapper();
    });

    it('sends bubbles as true', () => {
      insertImageButton.simulate('click');
      expect(event.bubbles).toEqual(true);
    });

    it('sends width in submitForm event', () => {
      imageDimensionsWidthInput.find('input').simulate('change', { target: { value: sampleImgData.naturalWidth } });

      insertImageButton.simulate('click');

      expect(event.detail.width).toEqual(sampleImgData.naturalWidth);
    });

    it('sends height in submitForm event', () => {
      imageDimensionsHeightInput.find('input').simulate('change', { target: { value: sampleImgData.naturalHeight } });

      insertImageButton.simulate('click');

      expect(event.detail.height).toEqual(sampleImgData.naturalHeight);
    });

    it('sends width as null in submitForm event if width is set to empty string/NaN (input cleared) and imgRef is falsy', () => {
      imageDimensionsWidthInput.find('input').simulate('change', { target: { value: '' } });

      insertImageButton.simulate('click');

      expect(event.detail.width).toEqual(null);
    });

    it('sends height as null in submitForm event if height is set to empty string/NaN (input cleared) and imgRef is falsy', () => {
      imageDimensionsHeightInput.find('input').simulate('change', { target: { value: '' } });

      insertImageButton.simulate('click');

      expect(event.detail.height).toEqual(null);
    });

    it('sends natural width in submitForm event if width is set to empty string/NaN (input cleared) ', () => {
      // set mocked imageRef data
      wrapper.instance().imgRef = { ...sampleImgData };

      imageDimensionsWidthInput.find('input').simulate('change', { target: { value: '' } });

      insertImageButton.simulate('click');

      expect(event.detail.width).toEqual(sampleImgData.naturalWidth);
    });

    it('sends natural height in submitForm event if height is set to empty string/NaN (input cleared) ', () => {
      // set mocked imageRef data
      wrapper.instance().imgRef = { ...sampleImgData };

      imageDimensionsHeightInput.find('input').simulate('change', { target: { value: '' } });

      insertImageButton.simulate('click');

      expect(event.detail.height).toEqual(sampleImgData.naturalHeight);
    });

    it('sends null in submitForm event if width is set to empty string/NaN (input cleared) but no imgRef ', () => {
      imageDimensionsWidthInput.find('input').simulate('change', { target: { value: '' } });

      insertImageButton.simulate('click');

      expect(event.detail.width).toEqual(null);
    });

    it('sends natural height in submitForm event if height is set to empty string/NaN (input cleared) ', () => {
      imageDimensionsHeightInput.find('input').simulate('change', { target: { value: '' } });

      insertImageButton.simulate('click');

      expect(event.detail.height).toEqual(null);
    });
    // commenting out due to upcoming workflow changes for 2 page modal
    // it('sends this.state.imageSource in submitForm event', () => {
    //   wrapper.setState({
    //     baseAssetURL: 'edx.org',
    //   });

    //   imageSourceInput.find('input').simulate('change', { target: { value: sampleText } });
    //   imageSourceInput.find('input').simulate('blur');

    //   insertImageButton.simulate('click');

    //   expect(event.detail.src).toEqual(rewriteStaticLinks(sampleText, '/static/', 'edx.org'));
    // });

    it('sends this.state.imageDescription in submitForm event if not this.state.imageIsDecorative', () => {
      imageDescriptionInput.find('input').simulate('change', { target: { value: sampleText } });
      imageDescriptionInput.find('input').simulate('blur');

      insertImageButton.simulate('click');

      expect(event.detail.alt).toEqual(sampleText);
    });

    it('sends empty string in submitForm event if this.state.imageIsDecorative', () => {
      imageDescriptionInput.find('input').simulate('change', { target: { value: sampleText } });

      imageDescriptionInputCheckBox.find('input').simulate('change', { target: { value: true } });

      insertImageButton.simulate('click');

      expect(event.detail.alt).toEqual('');
    });

    it('sends this.state.imageStyle in submitForm event', () => {
      wrapper.setState({
        imageStyle: sampleText,
      });

      insertImageButton.simulate('click');

      expect(event.detail.style).toEqual(sampleText);
    });

    it('does not dispatch event if form is invalid', () => {
      validationMock.mockReturnValue({ isValid: false });

      wrapper.setState({
        imageDescription: '',
        imageSource: sampleText,
      });

      insertImageButton.simulate('click');
      expect(event).toBeNull();

      wrapper.setState({
        imageDescription: sampleText,
        imageSource: '',
      });

      insertImageButton.simulate('click');
      expect(event).toBeNull();

      wrapper.setState({
        imageDescription: '',
        imageSource: '',
      });

      insertImageButton.simulate('click');
      expect(event).toBeNull();
    });
  });
});
