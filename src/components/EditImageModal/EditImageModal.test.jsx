import { Button, CheckBox, Fieldset, Modal, InputText, StatusAlert } from '@edx/paragon';
import { IntlProvider, FormattedMessage } from 'react-intl';
import { Provider } from 'react-redux';
import React from 'react';

import EditImageModal from './index';
import { assetActions } from '../../data/constants/actionTypes';
import { getMockStore } from '../../utils/testConstants';
import messages from './displayMessages';
import mockModalPortal from '../../utils/mockModalPortal';
import mockQuerySelector from '../../utils/mockQuerySelector';
import rewriteStaticLinks from '../../utils/rewriteStaticLinks';
import { shallowWithIntl } from '../../utils/i18n/enzymeHelper';
import WrappedEditImageModal from './container';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';

const learnMoreLink = 'http://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/accessibility/best_practices_course_content_dev.html#use-best-practices-for-describing-images';

const store = getMockStore({
  help_tokens: {
    image_accessibility: learnMoreLink,
  },
});

const intlProvider = new IntlProvider({ locale: 'en', messages: {} }, {});
const { intl } = intlProvider.getChildContext();

const getEditImageModal = wrapper =>
  (wrapper.find('Connect(EditImageModal)').dive({ context: { store, intl } }).find(EditImageModal).dive({ context: { store, intl } }));
const getModal = editImageModal => (editImageModal.find(Modal).dive({ context: { store, intl } }));
const getModalBody = editImageModal => (getModal(editImageModal).find('.modal-body'));
const getModalFooter = editImageModal => (getModal(editImageModal).find('.modal-footer'));
const getFormContainer = editImageModal => (getModalBody(editImageModal).find('div.col form'));
const getStatusAlert = editImageModal => (getModalBody(editImageModal).find(StatusAlert));
const getCloseStatusAlertButton = editImageModal =>
  (getStatusAlert(editImageModal).dive({ context: { store, intl } }).find(Button));
const getInsertImageButton = editImageModal =>
  (getModalFooter(editImageModal).find(Button).first());
const getNextButton = editImageModal =>
  (getModalFooter(editImageModal).find(Button).first());
const getPreviousButton = editImageModal => (getModalBody(editImageModal).find(Button));

const getImageDescriptionFieldset = editImageModal =>
  (getFormContainer(editImageModal).find(Fieldset).at(0));
const getImageDescriptionInput = editImageModal =>
  (getImageDescriptionFieldset(editImageModal).find(InputText));
const getImageDescriptionInputCheckBox = editImageModal =>
  (getImageDescriptionFieldset(editImageModal).find(CheckBox));

const getImageDimensionsFieldset = editImageModal =>
  (getFormContainer(editImageModal).find(Fieldset).at(1));
const getImageDimensionsWidthInput = editImageModal =>
  (getImageDimensionsFieldset(editImageModal)
    .dive({ context: { store, intl } }).find(InputText).at(0));

const getImageDimensionsHeightInput = editImageModal =>
  (getImageDimensionsFieldset(editImageModal)
    .dive({ context: { store, intl } }).find(InputText).at(1));
const getImageDimensionsCheckBox = editImageModal =>
  (getImageDimensionsFieldset(editImageModal).dive({ context: { store, intl } }).find(CheckBox));

const wrapper = shallowWithIntl(
  <Provider store={store}>
    <WrappedEditImageModal />
  </Provider>,
  { disableLifecycleMethods: true },
);

const sampleText = 'edx.jpg';

const sampleImgData = {
  naturalWidth: 100,
  naturalHeight: 200,
};
sampleImgData.aspectRatio = sampleImgData.naturalWidth / sampleImgData.naturalHeight;

let editImageModal;

describe('EditImageModal', () => {
  beforeEach(() => {
    mockQuerySelector.init();
    mockModalPortal.init();

    editImageModal = getEditImageModal(wrapper);
  });

  afterEach(() => {
    mockModalPortal.reset();
    mockQuerySelector.reset();
  });

  describe('page 1 renders', () => {
    describe('a modal with', () => {
      it('a closed modal by default', () => {
        const modal = getModal(editImageModal);
        expect(modal.find('.modal')).toHaveLength(1);
        expect(modal.find('.modal.show')).toHaveLength(0);
        expect(modal.find('.modal-backdrop.show')).toHaveLength(0);
      });

      it('an open modal when this.state.isModalOpen is true', () => {
        editImageModal.setState({ isModalOpen: true });
        const modal = getModal(editImageModal);

        expect(modal.find('.modal')).toHaveLength(1);
        expect(modal.find('.modal.show')).toHaveLength(1);
        expect(modal.find('.modal-backdrop.show')).toHaveLength(1);
      });

      it('modal title text', () => {
        const modalTitle = getModal(editImageModal).find('.modal-title').find(WrappedMessage);
        expect(modalTitle.prop('message')).toEqual(messages.editImageModalInsertTitle);
      });

      it('a Next page button', () => {
        const nextPageButton = getModal(editImageModal).find('.modal-footer').find(Button).first();
        expect(nextPageButton).toHaveLength(1);

        const nextPageButtonText = nextPageButton
          .dive({ context: { store, intl } }).find(WrappedMessage);
        expect(nextPageButtonText.prop('message')).toEqual(messages.editImageModalNextPageButton);
      });
    });

    describe('a modal body with', () => {
      describe('a status alert with', () => {
        it('a status alert', () => {
          expect(getStatusAlert(editImageModal)).toHaveLength(1);
        });

        it('a status alert with danger alertType', () => {
          expect(getStatusAlert(editImageModal).prop('alertType')).toEqual('danger');
        });
      });
    });
  });

  describe('page 2 renders', () => {
    beforeEach(() => {
      editImageModal.setState({
        open: true,
        pageNumber: 2,
        shouldShowPreviousButton: true,
      });
    });

    describe('a modal with', () => {
      it('modal title text', () => {
        const modalTitle = getModal(editImageModal).find('.modal-title').find(WrappedMessage);
        expect(modalTitle.prop('message')).toEqual(messages.editImageModalEditTitle);
      });

      it('an Insert Image button', () => {
        const insertImageButton = getInsertImageButton(editImageModal);
        expect(insertImageButton).toHaveLength(1);

        const insertImageButtonText = insertImageButton.dive({ context: { store, intl } })
          .find(WrappedMessage);
        expect(insertImageButtonText.prop('message')).toEqual(messages.editImageModalInsertImageButton);
      });
    });

    describe('a modal body with', () => {
      describe('a status alert with', () => {
        it('a status alert', () => {
          expect(getStatusAlert(editImageModal)).toHaveLength(1);
        });

        it('a status alert with danger alertType', () => {
          expect(getStatusAlert(editImageModal).prop('alertType')).toEqual('danger');
        });
      });
    });

    describe('a form with', () => {
      it('a form', () => {
        expect(getFormContainer(editImageModal)).toHaveLength(1);
      });

      describe('an imageDescription Fieldset with', () => {
        it('a fieldset', () => {
          expect(getImageDescriptionFieldset(editImageModal)).toHaveLength(1);
        });

        it('a legend', () => {
          const imageDescriptionFieldsetLegend = getImageDescriptionFieldset(editImageModal).prop('legend');
          expect(imageDescriptionFieldsetLegend.props.message)
            .toEqual(messages.editImageModalImageDescriptionLegend);
        });

        it('an InputText', () => {
          expect(getImageDescriptionInput(editImageModal)).toHaveLength(1);
        });

        describe('an imageDescription input with', () => {
          it('a label', () => {
            const imageDescriptionInputLabel = getImageDescriptionInput(editImageModal).prop('label');
            expect(imageDescriptionInputLabel.props.message)
              .toEqual(messages.editImageModalImageDescriptionLabel);
          });

          it('a description', () => {
            const imageDescriptionInputDescription = getImageDescriptionInput(editImageModal).prop('description');

            expect(imageDescriptionInputDescription.props.children[0].props.message)
              .toEqual(messages.editImageModalImageDescriptionDescription);
            expect(imageDescriptionInputDescription.props.children[1]).toEqual(' ');
            expect(imageDescriptionInputDescription.props.children[2].props.message)
              .toEqual(messages.editImageModalLearnMore);
          });

          it('a Learn More link', () => {
            const imageDescriptionInputDescription = getImageDescriptionInput(editImageModal).prop('description');
            expect(imageDescriptionInputDescription.props.children[2].props.children().type).toEqual('a');
            expect(imageDescriptionInputDescription.props.message).toEqual(messages.learnMoreLink);
          });

          it('a correct InputText props', () => {
            const imageDescriptionInput = getImageDescriptionInput(editImageModal);
            expect(imageDescriptionInput.prop('type')).toEqual('text');
            expect(imageDescriptionInput.prop('id')).toEqual('imageDescription');
          });
        });

        describe('a CheckBox with', () => {
          it('a CheckBox', () => {
            expect(getImageDescriptionInputCheckBox(editImageModal)).toHaveLength(1);
          });

          it('correct CheckBox props', () => {
            const imageDescriptionInputCheckBox = getImageDescriptionInputCheckBox(editImageModal);
            expect(imageDescriptionInputCheckBox.prop('id')).toEqual('isDecorative');
            expect(imageDescriptionInputCheckBox.prop('name')).toEqual('isDecorative');
          });

          it('a label', () => {
            const imageDescriptionInputCheckBoxLabel = getImageDescriptionInputCheckBox(editImageModal).prop('label');
            expect(imageDescriptionInputCheckBoxLabel.props.message)
              .toEqual(messages.editImageModalImageIsDecorativeCheckboxLabel);
          });

          it('a description', () => {
            const imageDescriptionInputCheckBoxDescription = getImageDescriptionInputCheckBox(editImageModal).prop('description');
            expect(imageDescriptionInputCheckBoxDescription.props.children[0].props.message)
              .toEqual(messages.editImageModalImageIsDecorativeCheckboxDescription);
            expect(imageDescriptionInputCheckBoxDescription.props.children[1]).toEqual(' ');
            expect(imageDescriptionInputCheckBoxDescription.props.children[2].props.message)
              .toEqual(messages.editImageModalLearnMore);
          });

          it('a "Learn more." link', () => {
            const imageDescriptionInputCheckBoxDescription = getImageDescriptionInputCheckBox(editImageModal).prop('description');
            expect(imageDescriptionInputCheckBoxDescription.props.children[2].props.children().type).toEqual('a');
            expect(imageDescriptionInputCheckBoxDescription.props.message)
              .toEqual(messages.learnMoreLink);
          });
        });
      });

      describe('an imageDimensions Fieldset with', () => {
        it('a fieldset', () => {
          expect(getImageDimensionsFieldset(editImageModal)).toHaveLength(1);
        });

        it('a legend', () => {
          const imageDimensionsFieldsetLegend = getImageDimensionsFieldset(editImageModal).prop('legend');
          expect(imageDimensionsFieldsetLegend.props.message)
            .toEqual(messages.editImageModalDimensionsLegend);
        });

        it('a form-row', () => {
          expect(getImageDimensionsFieldset(editImageModal).find('div.form-row')).toHaveLength(1);
        });

        describe('an imageDimensionsWidth input with', () => {
          it('a width InputText', () => {
            expect(getImageDimensionsWidthInput(editImageModal)).toHaveLength(1);
          });

          it('a width label', () => {
            const imageWidthInputLabel = getImageDimensionsWidthInput(editImageModal).prop('label');
            expect(imageWidthInputLabel.props.message)
              .toEqual(messages.editImageModalImageWidthLabel);
          });

          it('correct width InputText props', () => {
            const imageDimensionsWidthInput = getImageDimensionsWidthInput(editImageModal);
            expect(imageDimensionsWidthInput.prop('type')).toEqual('number');
            expect(imageDimensionsWidthInput.prop('id')).toEqual('imageWidth');
          });
        });

        describe('an imageDimensionsHeight input with', () => {
          it('a height InputText', () => {
            expect(getImageDimensionsHeightInput(editImageModal)).toHaveLength(1);
          });

          it('a height label', () => {
            const imageHeightInputLabel = getImageDimensionsHeightInput(editImageModal).prop('label');
            expect(imageHeightInputLabel.props.message)
              .toEqual(messages.editImageModalImageHeightLabel);
          });

          it('correct height InputText props', () => {
            const imageDimensionsHeightInput = getImageDimensionsHeightInput(editImageModal);
            expect(imageDimensionsHeightInput.prop('type')).toEqual('number');
            expect(imageDimensionsHeightInput.prop('id')).toEqual('imageHeight');
          });
        });

        describe('an imageDimensionsHeight input with', () => {
          it('a CheckBox', () => {
            expect(getImageDimensionsCheckBox(editImageModal)).toHaveLength(1);
          });
          it('correct CheckBox props', () => {
            const imageDimensionsInputCheckBox = getImageDimensionsCheckBox(editImageModal);
            expect(imageDimensionsInputCheckBox.prop('id')).toEqual('lockProportions');
            expect(imageDimensionsInputCheckBox.prop('name')).toEqual('lockProportions');
          });
          it('a label', () => {
            const imageDimensionsInputCheckBoxLabel = getImageDimensionsCheckBox(editImageModal).prop('label');
            expect(imageDimensionsInputCheckBoxLabel.props.message)
              .toEqual(messages.editImageModalLockImageProportionsCheckboxLabel);
          });
        });
      });
    });
  });

  describe('Modal', () => {
    it('this.state.isModalOpen is false by default', () => {
      expect(editImageModal.state('isModalOpen')).toEqual(false);
    });

    it('modal is not open by default', () => {
      /*
        In order to access the props of the modal, we need a reference
        to the modal before we have dove on it.
      */
      const modal = editImageModal.find(Modal);
      expect(modal.prop('open')).toEqual(false);
    });

    it('this.state.baseAssetURL is empty string by default', () => {
      expect(editImageModal.state('baseAssetURL')).toEqual('');
    });

    it('handleOpenModal sets correct state for empty event (inserting an image)', () => {
      editImageModal.instance().handleOpenModal(new CustomEvent('openModal', { detail: {} }));

      expect(editImageModal.state('baseAssetURL')).toEqual('');
      expect(editImageModal.state('imageDescription')).toEqual('');
      expect(editImageModal.state('imageDimensions')).toEqual({});
      expect(editImageModal.state('imageStyle')).toEqual('');
      expect(editImageModal.state('imageSource')).toEqual('');
      expect(editImageModal.state('isImageDecorative')).toEqual(false);
      expect(editImageModal.state('isImageLoaded')).toEqual(false);
      expect(editImageModal.state('isModalOpen')).toEqual(true);
    });

    it('handleOpenModal sets correct state for event with data (editing an image)', () => {
      editImageModal.instance().handleOpenModal(new CustomEvent('openModal', {
        detail: {
          alt: sampleText,
          baseAssetUrl: sampleText,
          height: sampleImgData.naturalHeight,
          src: sampleText,
          style: sampleText,
          width: sampleImgData.naturalWidth,
        },
      }));

      expect(editImageModal.state('baseAssetURL')).toEqual(sampleText);
      expect(editImageModal.state('imageDescription')).toEqual(sampleText);
      expect(editImageModal.state('imageDimensions')).toEqual({
        width: sampleImgData.naturalWidth,
        height: sampleImgData.naturalHeight,
        aspectRatio: sampleImgData.aspectRatio,
      });
      expect(editImageModal.state('isImageDecorative')).toEqual(false);
      expect(editImageModal.state('imageStyle')).toEqual(sampleText);
      expect(editImageModal.state('imageSource')).toEqual(sampleText);
      expect(editImageModal.state('isImageDecorative')).toEqual(false);
      expect(editImageModal.state('isImageLoaded')).toEqual(true);
      expect(editImageModal.state('isModalOpen')).toEqual(true);
    });

    it('onEditImageModalClose sets this.state.isModalOpen to false', () => {
      editImageModal.setState({
        pageNumber: 2,
        shouldShowPreviousButton: true,
      });

      const focusSpy = jest.fn();
      editImageModal.instance().setModalWrapperRef({
        dispatchEvent: jest.fn(),
      });
      editImageModal.instance().setStatusAlertRef({
        focus: focusSpy,
      });

      const closeModalButton = getModal(editImageModal).find('.modal-footer').find(Button).first();
      closeModalButton.simulate('click');

      expect(editImageModal.state('isModalOpen')).toEqual(false);
      expect(focusSpy).toHaveBeenCalledTimes(1);
    });

    describe('Status Alert: Page 1', () => {
      beforeEach(() => {
        const refMock = {
          focus: jest.fn(),
        };

        editImageModal.instance().setDropZoneButtonRef(refMock);
        editImageModal.instance().setStatusAlertRef(refMock);

        editImageModal.setState({
          pageNumber: 1,
          shouldShowPreviousButton: true,
        });
      });

      it('this.state.isStatusAlertOpen is false by default', () => {
        expect(getStatusAlert(editImageModal).prop('open')).toEqual(false);
        expect(editImageModal.state('isStatusAlertOpen')).toEqual(false);
      });

      it('opens statusAlert and focuses', () => {
        const focusSpy = jest.fn();
        editImageModal.instance().setStatusAlertRef({
          focus: focusSpy,
        });

        editImageModal.setProps({
          assetsStatus: {
            type: assetActions.upload.UPLOAD_EXCEED_MAX_COUNT_ERROR,
          },
        });
        const statusAlert = getStatusAlert(editImageModal);
        expect(statusAlert.prop('open')).toEqual(true);

        editImageModal.instance().componentDidUpdate({}, {});
        expect(focusSpy).toHaveBeenCalledTimes(1);
      });

      it('displays statusAlert on too many files uploaded', () => {
        editImageModal.setProps({
          assetsStatus: {
            type: assetActions.upload.UPLOAD_EXCEED_MAX_COUNT_ERROR,
          },
        });
        const statusAlert = getStatusAlert(editImageModal);
        expect(statusAlert.prop('open')).toEqual(true);
        /*
          Due to Enzyme issue #1213, we must wrap React Fragments in a div in order
          to succesfully shallow them. Once Enzyme introduces support for React Fragments,
          we can remove the extraneous div.
        */
        const statusAlertDialog =
          shallowWithIntl(<div>{statusAlert.prop('dialog')}</div>).find(WrappedMessage);
        expect(statusAlertDialog.prop('message')).toEqual(messages.editImageModalTooManyFiles);
      });

      it('displays statusAlert on invalid file type uploaded', () => {
        editImageModal.setProps({
          assetsStatus: {
            type: assetActions.upload.UPLOAD_INVALID_FILE_TYPE_ERROR,
          },
        });
        const statusAlert = getStatusAlert(editImageModal);
        expect(statusAlert.prop('open')).toEqual(true);
        /*
          Due to Enzyme issue #1213, we must wrap React Fragments in a div in order
          to succesfully shallow them. Once Enzyme introduces support for React Fragments,
          we can remove the extraneous div.
        */
        const statusAlertDialog =
          shallowWithIntl(<div>{statusAlert.prop('dialog')}</div>).find(WrappedMessage);
        expect(statusAlertDialog.prop('message')).toEqual(messages.editImageModalInvalidFileType);
      });

      it('focus on page 1 is moved to dropZone browse button when status alert is closed', () => {
        editImageModal.setProps({
          assetsStatus: {
            type: assetActions.upload.UPLOAD_INVALID_FILE_TYPE_ERROR,
          },
        });
        const focusSpy = jest.fn();
        editImageModal.instance().setDropZoneButtonRef({
          focus: focusSpy,
        });
        getCloseStatusAlertButton(editImageModal).simulate('click');

        expect(focusSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('Status Alert: Page 2', () => {
      beforeEach(() => {
        const refMock = {
          focus: jest.fn(),
        };

        editImageModal.instance().setPreviousButtonRef(refMock);
        editImageModal.instance().setStatusAlertRef(refMock);

        editImageModal.setState({
          pageNumber: 2,
          shouldShowPreviousButton: true,
        });
      });

      it('this.state.isStatusAlertOpen is false by default', () => {
        expect(getStatusAlert(editImageModal).prop('open')).toEqual(false);
        expect(editImageModal.state('isStatusAlertOpen')).toEqual(false);
      });

      it('this.state.isStatusAlertOpen is true if invalid form submitted', () => {
        getInsertImageButton(editImageModal).simulate('click');

        expect(editImageModal.state('isStatusAlertOpen')).toEqual(true);
      });

      it('StatusAlert open prop is false when status alert is closed', () => {
        getInsertImageButton(editImageModal).simulate('click');

        getCloseStatusAlertButton(editImageModal).simulate('click');

        expect(getStatusAlert(editImageModal).prop('open')).toEqual(false);
      });

      it('status alert is not displayed by default', () => {
        expect(getStatusAlert(editImageModal).prop('open')).toEqual(false);
      });

      it('status alert is displayed if invalid form submitted', () => {
        getInsertImageButton(editImageModal).simulate('click');

        editImageModal.update();

        expect(getStatusAlert(editImageModal).prop('open')).toEqual(true);
      });

      it('this.state.currentValidationMessages is empty object by default', () => {
        expect(editImageModal.state('currentValidationMessages')).toEqual({});
      });

      it('this.state.currentValidationMessages has correct validation messages when invalid form submitted', () => {
        getInsertImageButton(editImageModal).simulate('click');

        expect(editImageModal.state('currentValidationMessages').imageDescription.props.message).toEqual(messages.editImageModalFormValidImageDescription);
        // TODO: add image dimensions
      });

      it('this.state.currentValidationMessages has correct validation message when invalid image description submitted', () => {
        editImageModal.setState({
          imageSource: sampleText,
        });

        getInsertImageButton(editImageModal).simulate('click');

        expect(editImageModal.state('currentValidationMessages')).not.toHaveProperty('imageSource');
        expect(editImageModal.state('currentValidationMessages').imageDescription.props.message).toEqual(messages.editImageModalFormValidImageDescription);
      });

      // TODO: invalid image dimensions

      it('this.state.currentValidationMessages has correct validation message when invalid image dimensions submitted', () => {
        editImageModal.setState({
          imageSource: sampleText,
          imageDescription: sampleText,
          imageDimensions: {
            height: -100,
            width: -100,
          },
        });

        getInsertImageButton(editImageModal).simulate('click');

        expect(editImageModal.state('currentValidationMessages').imageWidth.props.message).toEqual(messages.editImageModalFormValidImageDimensions);
        expect(editImageModal.state('currentValidationMessages')).not.toHaveProperty('imageSource');
        expect(editImageModal.state('currentValidationMessages')).not.toHaveProperty('imageDescription');
      });

      it('this.state.currentValidationMessages is empty when valid form submitted', () => {
        editImageModal.setState({
          imageDimensions: {
            width: 100,
            height: 100,
          },
          imageDescription: sampleText,
        });

        editImageModal.instance().setImageFormRef({
          dispatchEvent: jest.fn(),
        });

        getInsertImageButton(editImageModal).simulate('click');

        expect(editImageModal.state('currentValidationMessages')).not.toHaveProperty('imageSource');
        expect(editImageModal.state('currentValidationMessages')).not.toHaveProperty('imageDescription');
      });

      // TODO: check image description?

      it('status alert has correct validation messages when invalid form submitted', () => {
        editImageModal.setState({
          imageDimensions: {
            height: -100,
            width: -100,
          },
        });

        getInsertImageButton(editImageModal).simulate('click');

        editImageModal.update();

        const statusAlertListItems = getStatusAlert(editImageModal).dive({ context: { store, intl } }).find('div ul.bullet-list li a');
        expect(statusAlertListItems).toHaveLength(2);
        expect(statusAlertListItems.at(0).find(WrappedMessage).prop('message')).toEqual(messages.editImageModalFormValidImageDescription);
        expect(statusAlertListItems.at(1).find(WrappedMessage).prop('message')).toEqual(messages.editImageModalFormValidImageDimensions);
      });

      it('validation messages are hyperlinks that navigate to appropriate form elements', () => {
        editImageModal.setState({
          imageDimensions: {
            height: -100,
            width: -100,
          },
        });

        getInsertImageButton(editImageModal).simulate('click');

        // force re-render to make sure validation messages are rendered
        editImageModal.update();

        const statusAlertListItems = getStatusAlert(editImageModal).dive({ context: { store, intl } }).find('div ul.bullet-list li a');
        expect(statusAlertListItems).toHaveLength(2);
        expect(statusAlertListItems.at(0).prop('href')).toEqual('#imageDescription');
        expect(statusAlertListItems.at(1).prop('href')).toEqual('#imageWidth');
      });

      it('status alert has correct validation message when invalid image description submitted', () => {
        editImageModal.setState({
          imageSource: sampleText,
        });

        getModalBody(editImageModal).find('img').simulate('load', { target: { ...sampleImgData } });

        getInsertImageButton(editImageModal).simulate('click');

        editImageModal.update();

        const statusAlert = getStatusAlert(editImageModal);

        const validationMessages = statusAlert
          .dive({ context: { store, intl } }).find(WrappedMessage);
        expect(validationMessages).toHaveLength(2);
        expect(validationMessages.at(0).prop('message')).toEqual(messages.editImageModalFormErrorMissingFields);
        expect(validationMessages.at(1).prop('message')).toEqual(messages.editImageModalFormValidImageDescription);

        const statusAlertListItems = statusAlert.dive({ context: { store, intl } }).find('div ul.bullet-list li a');
        expect(statusAlertListItems).toHaveLength(1);
        expect(statusAlertListItems.at(0).find(WrappedMessage).prop('message')).toEqual(messages.editImageModalFormValidImageDescription);
      });

      it('status alert has correct validation message when invalid image dimensions submitted', () => {
        editImageModal.setState({
          imageDescription: sampleText,
          imageDimensions: {
            height: (-1 * sampleImgData.naturalHeight),
            width: (-1 * sampleImgData.naturalWidth),
          },
        });

        getInsertImageButton(editImageModal).simulate('click');

        editImageModal.update();

        const statusAlertListItems = getStatusAlert(editImageModal).dive({ context: { store, intl } }).find('div ul.bullet-list li a');
        expect(statusAlertListItems).toHaveLength(1);
        expect(statusAlertListItems.at(0).find(WrappedMessage).prop('message')).toEqual(messages.editImageModalFormValidImageDimensions);
      });

      it('focus on page 2 is moved to previous button when status alert is closed', () => {
        const focusSpy = jest.fn();

        editImageModal.instance().setPreviousButtonRef({
          focus: focusSpy,
        });

        getInsertImageButton(editImageModal).simulate('click');

        getCloseStatusAlertButton(editImageModal).simulate('click');

        expect(focusSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('Validation Messages', () => {
      beforeEach(() => {
        editImageModal.instance().setStatusAlertRef({
          focus: jest.fn(),
        });

        editImageModal.setState({
          pageNumber: 2,
          shouldShowPreviousButton: true,
        });
      });

      it('isValid states for each field is false if invalid form data submitted', () => {
        editImageModal.setState({
          imageDimensions: {
            height: -100,
            width: -100,
          },
        });

        getInsertImageButton(editImageModal).simulate('click');

        expect(editImageModal.state('isImageDescriptionValid')).toEqual(false);
        expect(editImageModal.state('isImageDimensionsValid')).toEqual(false);
      });

      it('fieldsets show validation messages if invalid form data submitted', () => {
        editImageModal.setState({
          imageDimensions: {
            height: -100,
            width: -100,
          },
          pageNumber: 2,
          shouldShowPreviousButton: true,
        });

        getInsertImageButton(editImageModal).simulate('click');

        editImageModal.update();

        const imageDescriptionFieldset = getImageDescriptionFieldset(editImageModal);
        expect(imageDescriptionFieldset.prop('isValid')).toEqual(false);
        expect(imageDescriptionFieldset.prop('invalidMessage').props.message).toEqual(messages.editImageModalFormValidImageDescription);

        const imageDimensionsFieldset = getImageDimensionsFieldset(editImageModal);
        expect(imageDimensionsFieldset.prop('isValid')).toEqual(false);
        expect(imageDimensionsFieldset.prop('invalidMessage').props.message).toEqual(messages.editImageModalFormValidImageDimensions);
      });
    });
  });

  describe('Upload Image', () => {
    beforeEach(() => {
      const refMock = {
        focus: jest.fn(),
      };

      editImageModal.instance().setDropZoneButtonRef(refMock);
      editImageModal.instance().setPreviousButtonRef(refMock);
      editImageModal.instance().setStatusAlertRef(refMock);

      editImageModal.setState({
        pageNumber: 1,
        shouldShowPreviousButton: true,
      });
    });

    it('state updated correctly on upload success', () => {
      const assetsStatusMock = {
        type: assetActions.upload.UPLOAD_ASSET_SUCCESS,
        response: {
          asset: {
            portable_url: 'foo',
          },
        },
      };
      const clearAssetsStatusSpy = jest.fn();
      const selectAssetSpy = jest.fn();
      editImageModal.setProps({
        assetsStatus: assetsStatusMock,
        clearAssetsStatus: clearAssetsStatusSpy,
        selectAsset: selectAssetSpy,

      });

      expect(selectAssetSpy).toHaveBeenCalledTimes(1);
      expect(selectAssetSpy).toHaveBeenCalledWith(assetsStatusMock.response.asset, 0);
      expect(clearAssetsStatusSpy).toHaveBeenCalledTimes(1);
      expect(editImageModal.state('pageNumber')).toEqual(2);
    });
  });

  describe('Image Preview', () => {
    beforeEach(() => {
      editImageModal.setState({
        pageNumber: 2,
        shouldShowPreviousButton: true,
      });
    });

    it('this.state.imageDimensions are set on image load', () => {
      editImageModal.setState({
        imageSource: sampleText,
      });

      getModalBody(editImageModal).find('img').simulate('load', { target: { ...sampleImgData } });

      expect(editImageModal.state('imageDimensions')).toEqual({
        width: sampleImgData.naturalWidth,
        height: sampleImgData.naturalHeight,
        aspectRatio: sampleImgData.naturalWidth / sampleImgData.naturalHeight,
      });
    });

    it('this.state.isImageLoading is false by default', () => {
      expect(editImageModal.state('isImageLoading')).toEqual(false);
    });

    it('this.state.isImageLoading is set on image load', () => {
      editImageModal.setState({
        imageSource: sampleText,
      });

      getModalBody(editImageModal).find('img').simulate('load', { target: { ...sampleImgData } });

      expect(editImageModal.state('isImageLoading')).toEqual(false);
    });

    it('this.state.isImageLoading is set on image error', () => {
      editImageModal.setState({
        imageSource: sampleText,
      });

      getModalBody(editImageModal).find('img').simulate('error');

      expect(editImageModal.state('isImageLoading')).toEqual(false);
    });

    it('this.state.isImageLoaded is false by default', () => {
      expect(editImageModal.state('isImageLoaded')).toEqual(false);
    });

    it('with visible image preview image when this.state.isImageLoaded is false (default)', () => {
      editImageModal.setState({
        imageSource: sampleText,
      });

      const img = getModalBody(editImageModal).find('img');

      expect(img.prop('className')).toEqual(expect.stringContaining('invisible'));
    });

    it('with visible image preview image when this.state.isImageLoaded is true ', () => {
      editImageModal.setState({
        imageSource: sampleText,
        isImageLoaded: true,
      });

      const img = getModalBody(editImageModal).find('img');

      // TODO: replace this with asymmetric matcher expect.not.stringContaining when released
      expect(img.prop('className').includes('invisible')).toEqual(false);
    });

    it('with visible image preview placeholder text when this.state.isImageLoaded is false (default)', () => {
      const imagePreviewPlaceholderText = getModalBody(editImageModal).find('.image-preview-placeholder').find(WrappedMessage);

      const imagePreviewPlaceholderTextMessage = imagePreviewPlaceholderText
        .dive({ context: { store, intl } })
        .dive({ context: { store, intl } }).find(FormattedMessage)
        .dive({ context: { store, intl } });

      // TODO: replace this with asymmetric matcher expect.not.stringContaining when released
      expect(imagePreviewPlaceholderTextMessage.prop('className').includes('invisible')).toEqual(false);
    });

    it('with invisible image preview placeholder text when this.state.isImageLoaded is true', () => {
      editImageModal.setState({
        isImageLoaded: true,
        pageNumber: 2,
        shouldShowPreviousButton: true,
      });

      const imagePreviewPlaceholderText = getModalBody(editImageModal).find('.image-preview-placeholder').find(WrappedMessage);

      const imagePreviewPlaceholderTextMessage = imagePreviewPlaceholderText
        .dive({ context: { store, intl } })
        .dive({ context: { store, intl } }).find(FormattedMessage)
        .dive({ context: { store, intl } });

      expect(imagePreviewPlaceholderTextMessage.prop('className')).toEqual(expect.stringContaining('invisible'));
    });
  });

  // Commenting this out for now as we're going to create a new way to insert images
  // and workflow changes to test here
  describe('Image Source Input', () => {
    beforeEach(() => {
      editImageModal.setState({
        pageNumber: 2,
        shouldShowPreviousButton: true,
      });
    });

    it('this.state.imageSource is empty string by default', () => {
      expect(editImageModal.state('imageSource')).toEqual('');
    });

    // TODO: duplicate of above
    it('sets isImageLoading to false and isImageLoaded to true when image preview loads successfully', () => {
      editImageModal.setState({
        imageSource: sampleText,
      });

      getModalBody(editImageModal).find('img').simulate('load', { target: { ...sampleImgData } });

      expect(editImageModal.state('isImageLoading')).toEqual(false);
      expect(editImageModal.state('isImageLoaded')).toEqual(true);
    });

    it('sets isImageLoading to false and isImageLoaded to false when image preview load errors', () => {
      editImageModal.setState({
        imageSource: sampleText,
      });

      getModalBody(editImageModal).find('img').simulate('error');

      expect(editImageModal.state('isImageLoading')).toEqual(false);
      expect(editImageModal.state('isImageLoaded')).toEqual(false);
    });
  });

  describe('Image Description Input', () => {
    beforeEach(() => {
      const refMock = {
        focus: jest.fn(),
      };

      editImageModal.instance().setImageDescriptionInputRef(refMock);
      editImageModal.instance().setPreviousButtonRef(refMock);
      editImageModal.instance().setStatusAlertRef(refMock);

      editImageModal.setState({
        pageNumber: 2,
        shouldShowPreviousButton: true,
      });
    });

    it('this.state.imageDescription is empty string by default', () => {
      expect(editImageModal.state('imageDescription')).toEqual('');
    });

    it('this.state.isImageDecorative is false by default', () => {
      expect(editImageModal.state('isImageDecorative')).toEqual(false);
    });

    it('value is empty string by default', () => {
      expect(getImageDescriptionInput(editImageModal).prop('value')).toEqual('');
    });

    it('checkbox is unchecked by default', () => {
      expect(getImageDescriptionInputCheckBox(editImageModal).prop('checked')).toEqual(false);
    });

    it('displays this.state.imageSource as value', () => {
      editImageModal.setState({
        imageDescription: sampleText,
      });

      expect(getImageDescriptionInput(editImageModal).prop('value')).toEqual(sampleText);
    });

    it('sets this.state.isImageDecorative with value on checkbox onChange', () => {
      getImageDescriptionInputCheckBox(editImageModal).simulate('change', true);

      expect(editImageModal.state('isImageDecorative')).toEqual(true);
    });

    it('displays this.state.isImageDecorative as checkbox checked', () => {
      editImageModal.setState({
        isImageDecorative: true,
      });

      expect(getImageDescriptionInputCheckBox(editImageModal).prop('checked')).toEqual(true);
    });

    it('toggles image description disabled prop via checkbox', () => {
      editImageModal.setState({
        isImageDecorative: true,
      });

      let imageDescriptionInput = getImageDescriptionInput(editImageModal);

      expect(imageDescriptionInput.prop('disabled')).toEqual(true);

      editImageModal.setState({
        isImageDecorative: false,
      });

      imageDescriptionInput = getImageDescriptionInput(editImageModal);

      expect(imageDescriptionInput.prop('disabled')).toEqual(false);
    });

    it('returns correct feedback for invalid description (uses initial state)', () => {
      const feedback = editImageModal.instance().validateImageDescription();

      expect(feedback.isValid).toEqual(false);
      expect(feedback.validationMessage.props.message)
        .toEqual(messages.editImageModalFormValidImageDescription);
      expect(feedback.dangerIconDescription.props.message)
        .toEqual(messages.editImageModalFormError);
    });

    it('returns correct feedback for valid description (with non-empty description)', () => {
      editImageModal.setState({
        imageDescription: sampleText,
      });

      const feedback = editImageModal.instance().validateImageDescription();

      expect(feedback.isValid).toEqual(true);
      expect(feedback.validationMessage).toBeUndefined();
      expect(feedback.dangerIconDescription).toBeUndefined();
    });

    it('returns correct feedback for valid description (with checked checkbox)', () => {
      editImageModal.setState({
        isImageDecorative: true,
      });

      const feedback = editImageModal.instance().validateImageDescription();

      expect(feedback.isValid).toEqual(true);
      expect(feedback.validationMessage).toBeUndefined();
      expect(feedback.dangerIconDescription).toBeUndefined();
    });
  });

  describe('Image Dimensions Input', () => {
    beforeEach(() => {
      editImageModal.setState({
        pageNumber: 2,
        shouldShowPreviousButton: true,
      });
    });

    it('this.state.imageDimensions is empty object by default', () => {
      expect(editImageModal.state('imageDimensions')).toEqual({});
    });

    it('this.state.areProportionsLocked is true by default', () => {
      expect(editImageModal.state('areProportionsLocked')).toEqual(true);
    });

    it('width input value is empty string by default', () => {
      expect(getImageDimensionsWidthInput(editImageModal).prop('value')).toEqual('');
    });

    it('height input value is empty string by default', () => {
      expect(getImageDimensionsHeightInput(editImageModal).prop('value')).toEqual('');
    });

    it('checkbox is unchecked by default', () => {
      expect(getImageDescriptionInputCheckBox(editImageModal).prop('checked')).toEqual(false);
    });

    it('sets this.state.isImageDecorative with value on checkbox onChange', () => {
      getImageDescriptionInputCheckBox(editImageModal).simulate('change', true);

      expect(editImageModal.state('areProportionsLocked')).toEqual(true);
    });

    it('displays this.state.areProportionsLocked as checkbox checked', () => {
      editImageModal.setState({
        areProportionsLocked: true,
      });

      editImageModal.update();

      expect(getImageDimensionsCheckBox(editImageModal).prop('checked')).toEqual(true);
    });

    describe('this.state.imageDimensions responds correctly to locked proportions', () => {
      beforeEach(() => {
        editImageModal.setState({
          imageSource: sampleText,
          pageNumber: 2,
          shouldShowPreviousButton: true,
        });

        getModalBody(editImageModal).find('img').simulate('load', { target: { ...sampleImgData } });
        editImageModal.update();
      });

      it('height responds to width change', () => {
        getImageDimensionsWidthInput(editImageModal).simulate('blur', 50);

        expect(editImageModal.state('imageDimensions')).toEqual({
          width: 50,
          height: 100,
          aspectRatio: sampleImgData.naturalWidth / sampleImgData.naturalHeight,
        });
      });

      it('width responds to height change', () => {
        getImageDimensionsHeightInput(editImageModal).simulate('blur', 400);

        expect(editImageModal.state('imageDimensions')).toEqual({
          width: 200,
          height: 400,
          aspectRatio: sampleImgData.naturalWidth / sampleImgData.naturalHeight,
        });
      });
    });

    describe('this.state.imageDimensions responds correctly to unlocked proportions', () => {
      beforeEach(() => {
        editImageModal.setState({
          imageSource: sampleText,
          pageNumber: 2,
          shouldShowPreviousButton: true,
        });

        getImageDimensionsCheckBox(editImageModal).simulate('change', false);

        getModalBody(editImageModal).find('img').simulate('load', { target: { ...sampleImgData } });

        editImageModal.update();
      });

      it('height does not respond to width change', () => {
        getImageDimensionsWidthInput(editImageModal).simulate('blur', 50);

        expect(editImageModal.state('imageDimensions')).toEqual({
          width: 50,
          height: sampleImgData.naturalHeight,
          aspectRatio: sampleImgData.naturalWidth / sampleImgData.naturalHeight,
        });
      });

      it('width does not respond to height change', () => {
        getImageDimensionsHeightInput(editImageModal).simulate('blur', 400);

        expect(editImageModal.state('imageDimensions')).toEqual({
          width: sampleImgData.naturalWidth,
          height: 400,
          aspectRatio: sampleImgData.naturalWidth / sampleImgData.naturalHeight,
        });
      });

      it('throws an Error for an unknown dimension type', () => {
        expect(() => editImageModal.instance().onImageDimensionBlur(sampleText)).toThrow(Error);
        expect(() => editImageModal.instance().onImageDimensionBlur(sampleText)).toThrow(`Unknown dimension type ${sampleText}.`);
      });
    });
  });

  describe('Next button', () => {
    beforeEach(() => {
      editImageModal.setState({
        pageNumber: 1,
        shouldShowPreviousButton: true,
      });

      editImageModal.setProps({
        selectedAsset: {
          portable_url: 'foo',
        },
      });
      const refMock = {
        focus: jest.fn(),
      };

      editImageModal.instance().setPreviousButtonRef(refMock);
    });

    it('goes to page 2', () => {
      const clearAssetsStatusSpy = jest.fn();
      editImageModal.setProps({
        clearAssetsStatus: clearAssetsStatusSpy,
      });

      getNextButton(editImageModal).simulate('click');
      editImageModal.update();

      expect(editImageModal.state('isStatusAlertOpen')).toEqual(false);
      expect(editImageModal.state('pageNumber')).toEqual(2);
      expect(editImageModal.state('uploadErrorMessageBody')).toBeUndefined();
      expect(clearAssetsStatusSpy).toHaveBeenCalledTimes(1);
    });

    it('focuses on Previous/Back button', () => {
      const focusSpy = jest.fn();
      editImageModal.instance().setPreviousButtonRef({
        focus: focusSpy,
      });

      getNextButton(editImageModal).simulate('click');
      editImageModal.update();

      editImageModal.instance().componentDidUpdate({}, { pageNumber: 1 });
      expect(focusSpy).toHaveBeenCalledTimes(1);
    });

    it('closes statusAlert', () => {
      editImageModal.setProps({
        assetsStatus: {
          type: assetActions.upload.UPLOAD_EXCEED_MAX_COUNT_ERROR,
        },
      });
      let statusAlert = getStatusAlert(editImageModal);
      expect(statusAlert.prop('open')).toEqual(true);

      getNextButton(editImageModal).simulate('click');
      editImageModal.update();

      statusAlert = getStatusAlert(editImageModal);
      expect(statusAlert.prop('open')).toEqual(false);
    });
  });

  describe('Previous/Back button', () => {
    beforeEach(() => {
      editImageModal.setState({
        pageNumber: 2,
        shouldShowPreviousButton: true,
      });
      const refMock = {
        focus: jest.fn(),
      };

      editImageModal.instance().setDropZoneButtonRef(refMock);
    });

    it('goes to page 1', () => {
      getPreviousButton(editImageModal).simulate('click');
      editImageModal.update();

      expect(editImageModal.state('pageNumber')).toEqual(1);
    });

    it('focuses on Upload button', () => {
      const focusSpy = jest.fn();
      editImageModal.instance().setDropZoneButtonRef({
        focus: focusSpy,
      });

      getPreviousButton(editImageModal).simulate('click');
      editImageModal.update();

      editImageModal.instance().componentDidUpdate({}, { isModalOpen: true, pageNumber: 2 });
      expect(focusSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Insert Image button', () => {
    let validationMock;
    let dispatchEventSpy;

    beforeEach(() => {
      editImageModal.setState({
        pageNumber: 2,
        shouldShowPreviousButton: true,
      });

      dispatchEventSpy = jest.fn();

      editImageModal.instance().setImageFormRef({
        dispatchEvent: dispatchEventSpy,
      });

      /*
        Let's make form valid by default. The reason we mock the validation
        functions instead of setting valid input for the appropriate fields
        is to avoid the creation of imgRef when imageSource is not falsy,
        which messes with some of the tests.
      */
      validationMock = jest.fn();
      validationMock.mockReturnValue({ isValid: true });

      editImageModal.instance().validateImageSource = validationMock;
      editImageModal.instance().validateImageDescription = validationMock;
    });


    it('sends bubbles as true', () => {
      getInsertImageButton(editImageModal).simulate('click');
      expect(dispatchEventSpy.mock.calls[0][0].bubbles).toEqual(true);
    });

    it('sends width in submitForm event', () => {
      getImageDimensionsWidthInput(editImageModal).simulate('blur', sampleImgData.naturalWidth);

      getInsertImageButton(editImageModal).simulate('click');

      expect(dispatchEventSpy.mock.calls[0][0].detail.width).toEqual(sampleImgData.naturalWidth);
    });

    it('sends height in submitForm event', () => {
      getImageDimensionsHeightInput(editImageModal).simulate('blur', sampleImgData.naturalHeight);

      getInsertImageButton(editImageModal).simulate('click');

      expect(dispatchEventSpy.mock.calls[0][0].detail.height).toEqual(sampleImgData.naturalHeight);
    });

    it('sends width as null in submitForm event if width is set to empty string/NaN (input cleared) and imgRef is falsy', () => {
      getImageDimensionsWidthInput(editImageModal).simulate('blur', '');

      getInsertImageButton(editImageModal).simulate('click');

      expect(dispatchEventSpy.mock.calls[0][0].detail.width).toEqual(null);
    });

    it('sends height as null in submitForm event if height is set to empty string/NaN (input cleared) and imgRef is falsy', () => {
      getImageDimensionsHeightInput(editImageModal).simulate('blur', '');

      getInsertImageButton(editImageModal).simulate('click');

      expect(dispatchEventSpy.mock.calls[0][0].detail.height).toEqual(null);
    });

    it('sends natural width in submitForm event if width is set to empty string/NaN (input cleared) ', () => {
      // set mocked imageRef data
      editImageModal.instance().setImageRef({ ...sampleImgData });

      getImageDimensionsWidthInput(editImageModal).simulate('blur', '');

      getInsertImageButton(editImageModal).simulate('click');

      expect(dispatchEventSpy.mock.calls[0][0].detail.width).toEqual(sampleImgData.naturalWidth);
    });

    it('sends natural height in submitForm event if height is set to empty string/NaN (input cleared) ', () => {
      // set mocked imageRef data
      editImageModal.instance().setImageRef({ ...sampleImgData });

      getImageDimensionsHeightInput(editImageModal).simulate('blur', '');

      getInsertImageButton(editImageModal).simulate('click');

      expect(dispatchEventSpy.mock.calls[0][0].detail.height).toEqual(sampleImgData.naturalHeight);
    });

    it('sends null in submitForm event if width is set to empty string/NaN (input cleared) but no imgRef ', () => {
      getImageDimensionsWidthInput(editImageModal).simulate('blur', '');

      getInsertImageButton(editImageModal).simulate('click');

      expect(dispatchEventSpy.mock.calls[0][0].detail.width).toEqual(null);
    });

    it('sends natural height in submitForm event if height is set to empty string/NaN (input cleared) but no imgRef', () => {
      getImageDimensionsHeightInput(editImageModal).simulate('blur', '');

      getInsertImageButton(editImageModal).simulate('click');

      expect(dispatchEventSpy.mock.calls[0][0].detail.height).toEqual(null);
    });

    it('sends this.state.imageSource in submitForm event', () => {
      editImageModal.setState({
        baseAssetURL: 'edx.org',
        imageSource: sampleText,
      });

      getInsertImageButton(editImageModal).simulate('click');

      expect(dispatchEventSpy.mock.calls[0][0].detail.src).toEqual(rewriteStaticLinks(sampleText, '/static/', 'edx.org'));
    });

    it('sends this.state.imageDescription in submitForm event if not this.state.imageIsDecorative', () => {
      getImageDescriptionInput(editImageModal).simulate('blur', sampleText);

      editImageModal.update();

      getInsertImageButton(editImageModal).simulate('click');

      expect(dispatchEventSpy.mock.calls[0][0].detail.alt).toEqual(sampleText);
    });

    it('sends empty string in submitForm event if this.state.imageIsDecorative', () => {
      getImageDescriptionInput(editImageModal).simulate('blur', sampleText);

      getImageDescriptionInputCheckBox(editImageModal).simulate('change', true);

      getInsertImageButton(editImageModal).simulate('click');

      expect(dispatchEventSpy.mock.calls[0][0].detail.alt).toEqual('');
    });

    it('sends this.state.imageStyle in submitForm event', () => {
      editImageModal.setState({
        imageStyle: sampleText,
      });

      getInsertImageButton(editImageModal).simulate('click');

      expect(dispatchEventSpy.mock.calls[0][0].detail.style).toEqual(sampleText);
    });

    it('does not dispatch event if form is invalid', () => {
      validationMock.mockReturnValue({ isValid: false });

      editImageModal.instance().setStatusAlertRef({
        focus: jest.fn(),
      });

      editImageModal.setState({
        imageDescription: '',
        imageSource: sampleText,
      });

      const insertImageButton = getInsertImageButton(editImageModal);

      insertImageButton.simulate('click');
      expect(dispatchEventSpy).toHaveBeenCalledTimes(0);

      editImageModal.setState({
        imageDescription: sampleText,
        imageSource: '',
      });

      insertImageButton.simulate('click');
      expect(dispatchEventSpy).toHaveBeenCalledTimes(0);

      editImageModal.setState({
        imageDescription: '',
        imageSource: '',
      });

      insertImageButton.simulate('click');
      expect(dispatchEventSpy).toHaveBeenCalledTimes(0);
    });
  });
});
