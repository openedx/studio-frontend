import React from 'react';
import { CheckBox, Modal, InputText } from '@edx/paragon';

import EditImageModal from './index';
import messages from './displayMessages';
import rewriteStaticLinks from '../../utils/rewriteStaticLinks';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';
import { mountWithIntl } from '../../utils/i18n/enzymeHelper';

let wrapper = mountWithIntl(<EditImageModal />);
let modalBody;
let formContainer;
let insertImageButton;
let imageSourceURLInput;
let imageDescriptionContainer;
let imageDescriptionInput;
let imageDescriptionInputCheckBox;
let imageDimensionsContainer;
let imageDimensionsWidthInput;
let imageDimensionsHeightInput;
let imageDimensionsInputCheckBox;

const learnMoreLink = 'http://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/accessibility/best_practices_course_content_dev.html#use-best-practices-for-describing-images';

const sampleText = 'edx.jpg';

const sampleImgData = {
  naturalWidth: 100,
  naturalHeight: 200,
};
sampleImgData.aspectRatio = sampleImgData.naturalWidth / sampleImgData.naturalHeight;

const updateConsants = () => {
  wrapper.update();
  modalBody = wrapper.find('.modal-body');
  formContainer = modalBody.find('div.col form');

  insertImageButton = wrapper.find('.modal-footer button').first();

  imageSourceURLInput = formContainer.find(InputText).filterWhere(input => input.prop('name') === 'imageSourceURL');

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
  wrapper = mountWithIntl(<EditImageModal />);
  updateConsants();
};

/*
  NOTE: due to the use of refs in the EditImageModal, we use mountWithIntl instead of
  shallowWithIntl
*/
describe('EditImageModal', () => {
  updateConsants();

  describe('renders', () => {
    describe('modal', () => {
      it('a closed modal by default', () => {
        expect(wrapper.find('.modal')).toHaveLength(1);
        expect(wrapper.find('.modal-open .modal-backdrop .show')).toHaveLength(0);
      });

      it('an open modal when open', () => {
        wrapper.setState({ open: true });
        expect(wrapper.find('.modal')).toHaveLength(1);
        expect(wrapper.find('.modal .modal-open .modal-backdrop .show')).toHaveLength(1);

        resetWrapper();
      });

      it('modal title text', () => {
        const modalTitle = wrapper.find(Modal).find('.modal-title').find(WrappedMessage);
        expect(modalTitle.prop('message')).toEqual(messages.editImageModalTitle);
      });

      it('Insert Image button', () => {
        expect(insertImageButton).toHaveLength(1);

        const insertImageButtonText = insertImageButton.find(WrappedMessage);
        expect(insertImageButtonText.prop('message')).toEqual(messages.editImageModalInsertImageButton);
      });
    });

    describe('modal body', () => {
      describe('image preview', () => {
        const imagePreviewContainer = modalBody.find('div.row div.col-sm-4');
        const imagePreviewPlaceholder = imagePreviewContainer.find('div.image-preview');

        it('with image preview container', () => {
          expect(imagePreviewContainer).toHaveLength(1);
        });

        it('with image preview title', () => {
          const imagePreviewTitle = imagePreviewContainer.find('span').find(WrappedMessage);
          expect(imagePreviewTitle).toHaveLength(1);
          expect(imagePreviewTitle.prop('message')).toEqual(messages.editImageModalImagePreviewText);
        });

        it('with image preview placeholder', () => {
          expect(imagePreviewPlaceholder).toHaveLength(1);
        });

        it('with image preview placeholder text', () => {
          const imagePreviewPlaceholderText = imagePreviewPlaceholder.find(WrappedMessage);
          expect(imagePreviewPlaceholderText).toHaveLength(1);
          expect(imagePreviewPlaceholderText.prop('message')).toEqual(messages.editImageModalImagePreviewText);
        });
      });
    });

    describe('form', () => {
      it('with form', () => {
        expect(formContainer).toHaveLength(1);
      });

      describe('with imageSourceURL input', () => {
        it('with an InputText', () => {
          expect(imageSourceURLInput).toHaveLength(1);
        });

        it('with label', () => {
          const wrappedMessages = imageSourceURLInput.find(WrappedMessage);
          expect(wrappedMessages).toHaveLength(2);

          const imageSourceURLInputLabel = imageSourceURLInput.find('label').find(WrappedMessage);

          // make sure it appears first
          expect(wrappedMessages.at(0).html()).toEqual(imageSourceURLInputLabel.html());
          expect(imageSourceURLInputLabel.prop('message')).toEqual(messages.editImageModalImageSourceLabel);
        });

        it('with description', () => {
          const imageSourceURLInputDescription = imageSourceURLInput.find('small').find(WrappedMessage);
          expect(imageSourceURLInputDescription.prop('message')).toEqual(messages.editImageModalImageSourceDescription);
          expect(imageSourceURLInput.prop('type')).toEqual('text');
          expect(imageSourceURLInput.prop('id')).toEqual('imageSourceURL');
        });
      });

      describe('with imageDescription input', () => {
        it('with a fieldset', () => {
          expect(imageDescriptionContainer).toHaveLength(1);
        });

        it('with a legend', () => {
          expect(imageDescriptionContainer.find('legend').find(WrappedMessage).prop('message')).toEqual(messages.editImageModalImageDescriptionLegend);
        });

        it('with an InputText', () => {
          expect(imageDescriptionInput).toHaveLength(1);
        });

        it('with label', () => {
          const wrappedMessages = imageDescriptionInput.find(WrappedMessage);
          expect(wrappedMessages).toHaveLength(3);

          const imageDescriptionInputLabel = imageDescriptionInput.find('label').find(WrappedMessage);
          // make sure it appears first
          expect(wrappedMessages.at(0).html()).toEqual(imageDescriptionInputLabel.html());
          expect(imageDescriptionInputLabel.prop('message')).toEqual(messages.editImageModalImageDescriptionLabel);
        });

        it('with description', () => {
          const imageDescriptionInputDescription = imageDescriptionInput.find('small').find(WrappedMessage);
          expect(imageDescriptionInputDescription).toHaveLength(2);

          expect(imageDescriptionInputDescription.at(0).prop('message')).toEqual(messages.editImageModalImageDescriptionDescription);
          expect(imageDescriptionInputDescription.at(1).prop('message')).toEqual(messages.editImageModalLearnMore);
        });

        it('with Learn More link', () => {
          const imageDescriptionInputDescription = imageDescriptionInput.find('small').find(WrappedMessage);
          const learnMoreLinkElement = imageDescriptionInputDescription.at(1).find('a');
          expect(learnMoreLinkElement).toHaveLength(1);
          expect(learnMoreLinkElement.find({ href: learnMoreLink })).toHaveLength(1);
        });

        it('with correct InputText props', () => {
          expect(imageDescriptionInput.prop('type')).toEqual('text');
          expect(imageDescriptionInput.prop('id')).toEqual('imageDescription');
        });

        it('with a CheckBox', () => {
          expect(imageDescriptionInputCheckBox).toHaveLength(1);
        });

        it('with correct CheckBox props', () => {
          expect(imageDescriptionInputCheckBox.prop('id')).toEqual('isDecorative');
          expect(imageDescriptionInputCheckBox.prop('name')).toEqual('isDecorative');
        });

        it('with label', () => {
          const imageDescriptionInputCheckBoxLabel = imageDescriptionInputCheckBox.find('label').find(WrappedMessage);
          expect(imageDescriptionInputCheckBoxLabel.prop('message')).toEqual(messages.editImageModalImageIsDecorativeCheckboxLabel);
        });

        it('with description', () => {
          const imageDescriptionInputCheckBoxDescription = imageDescriptionInputCheckBox.find('small').find(WrappedMessage);
          expect(imageDescriptionInputCheckBoxDescription.at(0).prop('message')).toEqual(messages.editImageModalImageIsDecorativeCheckboxDescription);
          expect(imageDescriptionInputCheckBoxDescription.at(1).prop('message')).toEqual(messages.editImageModalLearnMore);
        });

        it('with "Learn more." link', () => {
          const imageDescriptionInputCheckBoxDescription = imageDescriptionInputCheckBox.find('small').find(WrappedMessage);
          const learnMoreLinkB = imageDescriptionInputCheckBoxDescription.at(1).find('a');
          expect(learnMoreLinkB).toHaveLength(1);
          expect(learnMoreLinkB.find({ href: learnMoreLink })).toHaveLength(1);
        });
      });

      describe('with imageDimensions input', () => {
        it('with a fieldset', () => {
          expect(imageDimensionsContainer).toHaveLength(1);
        });

        it('with a legend', () => {
          expect(imageDimensionsContainer.find('legend').find(WrappedMessage).prop('message')).toEqual(messages.editImageModalDimensionsLegend);
        });

        it('with a form-row', () => {
          expect(imageDimensionsContainer.find('div.form-row')).toHaveLength(1);
        });

        it('with legend and form-row as adjacent siblings', () => {
          expect(imageDimensionsContainer.find('legend + div.form-row')).toHaveLength(1);
        });

        it('with a width InputText', () => {
          expect(imageDimensionsWidthInput).toHaveLength(1);
        });

        it('with a height InputText', () => {
          expect(imageDimensionsHeightInput).toHaveLength(1);
        });

        it('with width label', () => {
          const imageWidthInputLabel = imageDimensionsWidthInput.find('label').find(WrappedMessage);
          expect(imageWidthInputLabel.prop('message')).toEqual(messages.editImageModalImageWidthLabel);
        });

        it('with height label', () => {
          const imageHeightInputLabel = imageDimensionsHeightInput.find('label').find(WrappedMessage);
          expect(imageHeightInputLabel.prop('message')).toEqual(messages.editImageModalImageHeightLabel);
        });

        it('with correct width InputText props', () => {
          expect(imageDimensionsWidthInput.prop('type')).toEqual('number');
          expect(imageDimensionsWidthInput.prop('id')).toEqual('imageWidth');
        });

        it('with correct height InputText props', () => {
          expect(imageDimensionsHeightInput.prop('type')).toEqual('number');
          expect(imageDimensionsHeightInput.prop('id')).toEqual('imageHeight');
        });

        it('with a CheckBox', () => {
          expect(imageDimensionsInputCheckBox).toHaveLength(1);
        });
        it('with correct CheckBox props', () => {
          expect(imageDimensionsInputCheckBox.prop('id')).toEqual('lockProportions');
          expect(imageDimensionsInputCheckBox.prop('name')).toEqual('lockProportions');
        });
        it('with label', () => {
          const imageDescriptionInputCheckBoxLabel = imageDimensionsInputCheckBox.find('label').find(WrappedMessage);
          expect(imageDescriptionInputCheckBoxLabel.prop('message')).toEqual(messages.editImageModalLockImageProportionsCheckboxLabel);
        });
      });
    });
  });

  describe('Modal', () => {
    it('this.state.open is false by default', () => {
      expect(wrapper.state('open')).toEqual(false);
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
      expect(wrapper.state('isImageDecorative')).toEqual(false);
      expect(wrapper.state('imageStyle')).toEqual('');
      expect(wrapper.state('imageSource')).toEqual('');
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
      expect(wrapper.state('open')).toEqual(true);

      resetWrapper();
    });
  });
  describe('Image Preview', () => {
    it('this.state.imageLoading is false by default', () => {
      expect(wrapper.state('imageLoading')).toEqual(false);
    });
    it('this.state.imageDimensions are set on image load', () => {
      // trigger img element to show
      imageSourceURLInput.find('input').simulate('change', { target: { value: sampleText } });
      imageSourceURLInput.find('input').simulate('blur');

      wrapper.find('img').simulate('load', { target: { ...sampleImgData } });

      expect(wrapper.state('imageDimensions')).toEqual({
        width: sampleImgData.naturalWidth,
        height: sampleImgData.naturalHeight,
        aspectRatio: sampleImgData.naturalWidth / sampleImgData.naturalHeight,
      });

      resetWrapper();
    });

    it('this.state.imageLoading is set on image load', () => {
      // trigger img element to show
      imageSourceURLInput.find('input').simulate('change', { target: { value: sampleText } });
      imageSourceURLInput.find('input').simulate('blur');

      wrapper.find('img').simulate('load', { target: { ...sampleImgData } });

      expect(wrapper.state('imageLoading')).toEqual(false);

      resetWrapper();
    });

    it('this.state.imageLoading is set on image error', () => {
      // trigger img element to show
      imageSourceURLInput.find('input').simulate('change', { target: { value: sampleText } });
      imageSourceURLInput.find('input').simulate('blur');

      wrapper.find('img').simulate('error');

      expect(wrapper.state('imageLoading')).toEqual(false);

      resetWrapper();
    });
  });

  describe('Image Source Input', () => {
    it('this.state.imageSource is empty string by default', () => {
      expect(wrapper.state('imageSource')).toEqual('');
    });

    it('value is empty string by default', () => {
      expect(imageSourceURLInput.prop('value')).toEqual('');
    });

    it('displays this.state.imageSource as value', () => {
      wrapper.setState({
        imageSource: sampleText,
      });

      updateConsants();

      expect(imageSourceURLInput.prop('value')).toEqual(sampleText);
      resetWrapper();
    });

    it('sets this.state.imageSource with value onBlur', () => {
      imageSourceURLInput.find('input').simulate('change', { target: { value: sampleText } });
      imageSourceURLInput.find('input').simulate('blur');

      expect(wrapper.state('imageSource')).toEqual(sampleText);
      resetWrapper();
    });

    it('sets this.state.imageLoading to true with non-empty imageSource', () => {
      imageSourceURLInput.find('input').simulate('change', { target: { value: sampleText } });
      imageSourceURLInput.find('input').simulate('blur');

      expect(wrapper.state('imageLoading')).toEqual(true);
      resetWrapper();
    });

    it('sets this.state.imageLoading to false with empty imageSource', () => {
      imageSourceURLInput.find('input').simulate('change', { target: { value: '' } });
      imageSourceURLInput.find('input').simulate('blur');

      expect(wrapper.state('imageLoading')).toEqual(false);
      resetWrapper();
    });

    it('displays image preview onBlur', () => {
      expect(wrapper.find('div.image-preview').length).toEqual(1);
      expect(wrapper.find('img').length).toEqual(0);

      imageSourceURLInput.find('input').simulate('change', { target: { value: sampleText } });
      imageSourceURLInput.find('input').simulate('blur');

      expect(wrapper.state('imageSource')).toEqual(sampleText);
      expect(wrapper.find('div.image-preview').length).toEqual(0);

      const imagePreview = wrapper.find('img');
      expect(imagePreview.length).toEqual(1);
      expect(wrapper.find('img').prop('src')).toEqual(sampleText);

      resetWrapper();
    });
  });

  describe('Image Description Input', () => {
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

      updateConsants();

      expect(imageDescriptionInput.prop('value')).toEqual(sampleText);
      resetWrapper();
    });

    it('sets this.state.imageSource with value onBlur', () => {
      imageDescriptionInput.find('input').simulate('change', { target: { value: sampleText } });
      imageDescriptionInput.find('input').simulate('blur');

      expect(wrapper.state('imageDescription')).toEqual(sampleText);
      resetWrapper();
    });

    it('sets this.state.isImageDecorative with value on checkbox onChange', () => {
      imageDescriptionInputCheckBox.find('input').simulate('change', { target: { value: true } });

      expect(wrapper.state('isImageDecorative')).toEqual(true);
      resetWrapper();
    });

    it('displays this.state.isImageDecorative as checkbox checked', () => {
      wrapper.setState({
        isImageDecorative: true,
      });

      updateConsants();
      expect(imageDescriptionInputCheckBox.prop('checked')).toEqual(true);

      resetWrapper();
    });

    it('toggles image description disabled prop via checkbox', () => {
      wrapper.setState({
        isImageDecorative: true,
      });

      updateConsants();
      expect(imageDescriptionInput.prop('disabled')).toEqual(true);

      wrapper.setState({
        isImageDecorative: false,
      });
      updateConsants();
      expect(imageDescriptionInput.prop('disabled')).toEqual(false);

      resetWrapper();
    });
  });

  describe('Image Dimensions Input', () => {
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

      resetWrapper();
    });

    it('displays this.state.areProportionsLocked as checkbox checked', () => {
      wrapper.setState({
        areProportionsLocked: true,
      });

      updateConsants();
      expect(imageDimensionsInputCheckBox.prop('checked')).toEqual(true);

      resetWrapper();
    });

    describe('this.state.imageDimensions responds correctly to locked proportions', () => {
      beforeEach(() => {
        imageSourceURLInput.find('input').simulate('change', { target: { value: sampleText } });
        imageSourceURLInput.find('input').simulate('blur');

        wrapper.find('img').simulate('load', { target: { ...sampleImgData } });
      });

      it('height responds to width change', () => {
        imageDimensionsWidthInput.find('input').simulate('change', { target: { value: '50' } });

        updateConsants();

        // issue with props in asInput expecting a string even if type is number
        expect(wrapper.state('imageDimensions')).toEqual({
          width: 50,
          height: 100,
          aspectRatio: sampleImgData.naturalWidth / sampleImgData.naturalHeight,
        });

        resetWrapper();
      });

      it('width responds to height change', () => {
        imageDimensionsHeightInput.find('input').simulate('change', { target: { value: '400' } });

        updateConsants();

        // issue with props in asInput expecting a string even if type is number
        expect(wrapper.state('imageDimensions')).toEqual({
          width: 200,
          height: 400,
          aspectRatio: sampleImgData.naturalWidth / sampleImgData.naturalHeight,
        });

        resetWrapper();
      });
    });
    describe('this.state.imageDimensions responds correctly to unlocked proportions', () => {
      beforeEach(() => {
        imageDimensionsInputCheckBox.find('input').simulate('change', { target: { value: false } });
        imageSourceURLInput.find('input').simulate('change', { target: { value: sampleText } });
        imageSourceURLInput.find('input').simulate('blur');

        wrapper.find('img').simulate('load', { target: { ...sampleImgData } });
      });

      it('height does not respond to width change', () => {
        imageDimensionsWidthInput.find('input').simulate('change', { target: { value: '50' } });

        updateConsants();

        // issue with props in asInput expecting a string even if type is number
        expect(wrapper.state('imageDimensions')).toEqual({
          width: 50,
          height: sampleImgData.naturalHeight,
          aspectRatio: sampleImgData.naturalWidth / sampleImgData.naturalHeight,
        });

        resetWrapper();
      });

      it('width does not respond to height change', () => {
        imageDimensionsHeightInput.find('input').simulate('change', { target: { value: '400' } });

        updateConsants();

        // issue with props in asInput expecting a string even if type is number
        expect(wrapper.state('imageDimensions')).toEqual({
          width: sampleImgData.naturalWidth,
          height: 400,
          aspectRatio: sampleImgData.naturalWidth / sampleImgData.naturalHeight,
        });

        resetWrapper();
      });
    });

    it('throws an Error for an unknown dimension type', () => {
      expect(() => wrapper.instance().onImageDimensionChange(sampleText)).toThrow(Error);
      expect(() => wrapper.instance().onImageDimensionChange(sampleText)).toThrow(`Unknown dimension type ${sampleText}.`);
    });
  });

  describe('Insert Image button', () => {
    let event;

    beforeEach(() => {
      const formRef = wrapper.instance().formRef;
      formRef.addEventListener('submitForm', (e) => { event = e; });
    });

    it('sends bubbles as true', () => {
      insertImageButton.simulate('click');
      expect(event.bubbles).toEqual(true);

      resetWrapper();
    });

    it('sends width in submitForm event', () => {
      imageDimensionsWidthInput.find('input').simulate('change', { target: { value: sampleImgData.naturalWidth } });

      insertImageButton.simulate('click');

      expect(event.detail.width).toEqual(sampleImgData.naturalWidth);

      resetWrapper();
    });

    it('sends height in submitForm event', () => {
      imageDimensionsHeightInput.find('input').simulate('change', { target: { value: sampleImgData.naturalHeight } });

      insertImageButton.simulate('click');

      expect(event.detail.height).toEqual(sampleImgData.naturalHeight);

      resetWrapper();
    });

    it('sends natural width in submitForm event if width is set to empty string/NaN (input cleared) ', () => {
      // set dummy imageRef data
      wrapper.instance().imgRef = { ...sampleImgData };

      imageDimensionsWidthInput.find('input').simulate('change', { target: { value: '' } });

      insertImageButton.simulate('click');

      expect(event.detail.width).toEqual(sampleImgData.naturalWidth);

      resetWrapper();
    });

    it('sends natural height in submitForm event if height is set to empty string/NaN (input cleared) ', () => {
      // set dummy imageRef data
      wrapper.instance().imgRef = { ...sampleImgData };

      imageDimensionsHeightInput.find('input').simulate('change', { target: { value: '' } });

      insertImageButton.simulate('click');

      expect(event.detail.height).toEqual(sampleImgData.naturalHeight);

      resetWrapper();
    });

    it('sends null in submitForm event if width is set to empty string/NaN (input cleared) but no imgRef ', () => {
      imageDimensionsWidthInput.find('input').simulate('change', { target: { value: '' } });

      insertImageButton.simulate('click');

      expect(event.detail.width).toEqual(null);

      resetWrapper();
    });

    it('sends natural height in submitForm event if height is set to empty string/NaN (input cleared) ', () => {
      imageDimensionsHeightInput.find('input').simulate('change', { target: { value: '' } });

      insertImageButton.simulate('click');

      expect(event.detail.height).toEqual(null);

      resetWrapper();
    });

    it('sends this.state.imageSource in submitForm event', () => {
      wrapper.setState({
        baseAssetURL: 'edx.org',
      });

      imageSourceURLInput.find('input').simulate('change', { target: { value: sampleText } });
      imageSourceURLInput.find('input').simulate('blur');

      insertImageButton.simulate('click');

      expect(event.detail.src).toEqual(rewriteStaticLinks(sampleText, '/static/', 'edx.org'));

      resetWrapper();
    });

    it('sends this.state.imageDescription in submitForm event if not this.state.imageIsDecorative', () => {
      imageDescriptionInput.find('input').simulate('change', { target: { value: sampleText } });
      imageDescriptionInput.find('input').simulate('blur');

      insertImageButton.simulate('click');

      expect(event.detail.alt).toEqual(sampleText);

      resetWrapper();
    });

    it('sends empty string in submitForm event if this.state.imageIsDecorative', () => {
      imageDescriptionInput.find('input').simulate('change', { target: { value: sampleText } });

      imageDescriptionInputCheckBox.find('input').simulate('change', { target: { value: true } });

      insertImageButton.simulate('click');

      expect(event.detail.alt).toEqual('');

      resetWrapper();
    });

    it('sends this.state.imageStyle in submitForm event', () => {
      wrapper.setState({
        imageStyle: sampleText,
      });

      insertImageButton.simulate('click');

      expect(event.detail.style).toEqual(sampleText);

      resetWrapper();
    });
  });
});
