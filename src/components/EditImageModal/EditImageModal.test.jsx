import { Button, CheckBox, Fieldset, Modal, InputText, StatusAlert, Variant } from '@edx/paragon';
import { IntlProvider, FormattedMessage } from 'react-intl';
import { Provider } from 'react-redux';
import React from 'react';

import { assetActions } from '../../data/constants/actionTypes';
import { courseDetails, getMockStore, testAssetsList } from '../../utils/testConstants';
import EditImageModal from './index';
import messages from './displayMessages';
import mockModalPortal from '../../utils/mockModalPortal';
import mockQuerySelector from '../../utils/mockQuerySelector';
import { pageTypes } from '../../utils/getAssetsPageType';
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
const getModal = editImageModal => (editImageModal.find(Modal));
const getModalContent = editImageModal =>
  (getModal(editImageModal).dive({ context: { store, intl } }));
const getModalBody = editImageModal => (getModalContent(editImageModal).find('.modal-body'));
const getModalFooter = editImageModal => (getModalContent(editImageModal).find('.modal-footer'));
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

const getNextPageButton = editImageModal => (getModalFooter(editImageModal).find(Button).first());

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

  describe('renders', () => {
    describe('page 1', () => {
      describe('a modal with', () => {
        it('correct initial props', () => {
          const modal = getModal(editImageModal);
          expect(modal.prop('open')).toEqual(false);
          expect(shallowWithIntl(modal.prop('title')).find(WrappedMessage).prop('message')).toEqual(messages.editImageModalInsertTitle);
          expect(shallowWithIntl(modal.prop('closeText')).prop('message')).toEqual(messages.editImageModalCancelButton);
        });

        describe('buttons', () => {
          Object.values(pageTypes).forEach((type) => {
            beforeEach(() => {
              editImageModal.setState({
                assetsPageType: type,
              });
            });

            it('a Next page button', () => {
              expect(getNextPageButton(editImageModal)).toHaveLength(1);
            });

            it('a Next page button with correct label', () => {
              const nextPageButton = getNextPageButton(editImageModal);

              const nextPageButtonText = shallowWithIntl(nextPageButton.prop('label'));
              expect(nextPageButtonText.prop('message')).toEqual(messages.editImageModalNextPageButton);
            });

            it('a disabled Next page button', () => {
              const nextPageButton = getNextPageButton(editImageModal);

              expect(nextPageButton.prop('disabled')).toEqual(true);
            });

            it('a not disabled Next page button when asset selected', () => {
              editImageModal.setProps({
                selectedAsset: testAssetsList[0],
              });

              const nextPageButton = getNextPageButton(editImageModal);

              expect(nextPageButton.prop('disabled')).toEqual(false);
            });
          });
        });

        describe('body', () => {
          it('getImageSelectionModalBodyAssetsList throws an Error for an unknown page type', () => {
            expect(() => editImageModal.instance().getImageSelectionModalBodyAssetsList(sampleText))
              .toThrow(Error);
            expect(() => editImageModal.instance().getImageSelectionModalBodyAssetsList(sampleText))
              .toThrow(`Unknown pageType ${sampleText}.`);
          });

          describe('skeleton page view with', () => {
            it('a StatusAlert component', () => {
              expect(getStatusAlert(editImageModal)).toHaveLength(1);
            });

            it('a StatusAlert component with danger alertType prop', () => {
              expect(getStatusAlert(editImageModal).prop('alertType')).toEqual('danger');
            });

            it('an AssetsDropZone component', () => {
              expect(getModalBody(editImageModal).find('Connect(AssetsDropZone)')).toHaveLength(1);
            });

            it('a header', () => {
              const header = getModalBody(editImageModal).find(WrappedMessage).filterWhere(message => message.prop('tagName') === 'h3');
              expect(header).toHaveLength(1);
              expect(header.prop('message')).toEqual(messages.editImageModalInsertHeader);
            });

            it('a loading icon', () => {
              const loadingSpinnerRegion = getModalBody(editImageModal).find('.text-center .mt-3');
              expect(loadingSpinnerRegion).toHaveLength(1);

              const loadingSpinner = loadingSpinnerRegion.find('.fa-icon-spacing');
              expect(loadingSpinner).toHaveLength(1);
              expect(loadingSpinner.prop('aria-hidden')).toEqual(true);

              const loadingSpinnerIcon = loadingSpinner.children().find('span');
              expect(loadingSpinnerIcon.hasClass('fa')).toEqual(true);
              expect(loadingSpinnerIcon.hasClass('fa-spinner')).toEqual(true);
              expect(loadingSpinnerIcon.hasClass('fa-spin')).toEqual(true);

              expect(loadingSpinnerRegion.find(WrappedMessage).prop('message')).toEqual(messages.editImageModalAssetsListLoadingSpinner);
            });

            it('no AssetsList component', () => {
              expect(getModalBody(editImageModal).find('Connect(AssetsList)')).toHaveLength(0);
            });

            it('no AssetsSearch component', () => {
              expect(getModalBody(editImageModal).find('Connect(AssetsSearch)')).toHaveLength(0);
            });

            it('no AssetsResultsCount component', () => {
              expect(getModalBody(editImageModal).find('Connect(AssetsResultsCount)')).toHaveLength(0);
            });


            it('no Pagination component', () => {
              expect(getModalBody(editImageModal).find('Pagination')).toHaveLength(0);
            });
          });

          describe('a normal page view with', () => {
            beforeEach(() => {
              editImageModal.setProps({
                assetsList: testAssetsList,
              });
            });

            it('a StatusAlert component', () => {
              expect(getStatusAlert(editImageModal)).toHaveLength(1);
            });

            it('a StatusAlert component with danger alertType prop', () => {
              expect(getStatusAlert(editImageModal).prop('alertType')).toEqual('danger');
            });

            it('an AssetsDropZone component', () => {
              expect(getModalBody(editImageModal).find('Connect(AssetsDropZone)')).toHaveLength(1);
            });

            it('a header', () => {
              const header = getModalBody(editImageModal).find(WrappedMessage).filterWhere(message => message.prop('tagName') === 'h3');
              expect(header).toHaveLength(1);
              expect(header.prop('message')).toEqual(messages.editImageModalInsertHeader);
            });

            it('an AssetsList component', () => {
              expect(getModalBody(editImageModal).find('Connect(AssetsList)')).toHaveLength(1);
            });

            it('an AssetsSearch component', () => {
              expect(getModalBody(editImageModal).find('Connect(AssetsSearch)')).toHaveLength(1);
            });

            it('no AssetsClearSearchButton component', () => {
              expect(getModalBody(editImageModal).find('Connect(AssetsClearSearchButton)')).toHaveLength(0);
            });

            it('a AssetsResultsCount component', () => {
              expect(getModalBody(editImageModal).find('Connect(AssetsResultsCount)')).toHaveLength(1);
            });

            it('a Pagination component', () => {
              expect(getModalBody(editImageModal).find('Connect(InjectIntl(Pagination))')).toHaveLength(1);
            });
          });

          describe('no results page view with', () => {
            beforeEach(() => {
              editImageModal.setState({
                assetsPageType: pageTypes.NO_RESULTS,
              });
            });
            it('a StatusAlert component', () => {
              expect(getStatusAlert(editImageModal)).toHaveLength(1);
            });

            it('a StatusAlert component with danger alertType prop', () => {
              expect(getStatusAlert(editImageModal).prop('alertType')).toEqual('danger');
            });

            it('an AssetsDropZone component', () => {
              expect(getModalBody(editImageModal).find('Connect(AssetsDropZone)')).toHaveLength(1);
            });

            it('a header', () => {
              const header = getModalBody(editImageModal).find(WrappedMessage).filterWhere(message => message.prop('tagName') === 'h3').at(0);
              expect(header).toHaveLength(1);
              expect(header.prop('message')).toEqual(messages.editImageModalInsertHeader);
            });

            it('a no results message', () => {
              expect(getModalBody(editImageModal).find(WrappedMessage).filterWhere(message => message.prop('tagName') === 'h3').at(1)
                .prop('message')).toEqual(messages.editImageModalAssetsListNoResultsMessage);
            });

            it('no AssetsList component', () => {
              expect(getModalBody(editImageModal).find('Connect(AssetsList)')).toHaveLength(0);
            });

            it('an AssetsSearch component', () => {
              expect(getModalBody(editImageModal).find('Connect(AssetsSearch)')).toHaveLength(1);
            });

            it('an AssetsClearSearchButton component', () => {
              expect(getModalBody(editImageModal).find('Connect(AssetsClearSearchButton)')).toHaveLength(1);
            });

            it('no AssetsResultsCount component', () => {
              expect(getModalBody(editImageModal).find('Connect(AssetsResultsCount)')).toHaveLength(0);
            });

            it('no Pagination component', () => {
              expect(getModalBody(editImageModal).find('Pagination')).toHaveLength(0);
            });
          });

          describe('no assets page view with', () => {
            beforeEach(() => {
              editImageModal.setState({
                assetsPageType: pageTypes.NO_ASSETS,
              });
            });

            it('a StatusAlert component', () => {
              expect(getStatusAlert(editImageModal)).toHaveLength(1);
            });

            it('a StatusAlert component with danger alertType prop', () => {
              expect(getStatusAlert(editImageModal).prop('alertType')).toEqual('danger');
            });

            it('an AssetsDropZone component', () => {
              expect(getModalBody(editImageModal).find('Connect(AssetsDropZone)'));
            });

            it('a header', () => {
              const header = getModalBody(editImageModal).find(WrappedMessage).filterWhere(message => message.prop('tagName') === 'h3').at(0);
              expect(header).toHaveLength(1);
              expect(header.prop('message')).toEqual(messages.editImageModalInsertHeader);
            });

            it('a no assets message', () => {
              expect(getModalBody(editImageModal).find(WrappedMessage).filterWhere(message => message.prop('tagName') === 'h3').at(1)
                .prop('message')).toEqual(messages.editImageModalAssetsListNoAssetsMessage);
            });

            it('no AssetsList component', () => {
              expect(getModalBody(editImageModal).find('Connect(AssetsList)')).toHaveLength(0);
            });

            it('no AssetsSearch component', () => {
              expect(getModalBody(editImageModal).find('Connect(AssetsSearch)')).toHaveLength(0);
            });

            it('no AssetsClearSearchButton component', () => {
              expect(getModalBody(editImageModal).find('Connect(AssetsClearSearchButton)')).toHaveLength(0);
            });

            it('no AssetsResultsCount component', () => {
              expect(getModalBody(editImageModal).find('Connect(AssetsResultsCount)')).toHaveLength(0);
            });

            it('no Pagination component', () => {
              expect(getModalBody(editImageModal).find('Pagination')).toHaveLength(0);
            });
          });
        });
      });
    });

    describe('page 2', () => {
      describe('a modal with', () => {
        beforeEach(() => {
          editImageModal.setState({
            open: true,
            pageNumber: 2,
            shouldShowPreviousButton: true,
          });
        });

        it('correct initial props', () => {
          editImageModal.setState({
            open: false,
          });

          const modal = getModal(editImageModal);

          expect(modal.prop('open')).toEqual(false);
          expect(shallowWithIntl(modal.prop('title')).find(WrappedMessage).prop('message')).toEqual(messages.editImageModalEditTitle);
          expect(shallowWithIntl(modal.prop('closeText')).prop('message')).toEqual(messages.editImageModalCancelButton);
        });

        describe('buttons', () => {
          it('an Insert Image button', () => {
            expect(getInsertImageButton(editImageModal)).toHaveLength(1);
          });

          it('an Insert Image button with correct label', () => {
            expect(shallowWithIntl(getInsertImageButton(editImageModal).prop('label')).prop('message')).toEqual(messages.editImageModalInsertImageButton);
          });
        });

        describe('body', () => {
          it('a StatusAlert component', () => {
            expect(getStatusAlert(editImageModal)).toHaveLength(1);
          });

          it('a StatusAlert component with correct initial props', () => {
            expect(getStatusAlert(editImageModal).prop('alertType')).toEqual('danger');
            const statusAlertDialog = shallowWithIntl(getStatusAlert(editImageModal).prop('dialog')).find(WrappedMessage).at(0);
            expect(statusAlertDialog.prop('message')).toEqual(messages.editImageModalFormErrorMissingFields);
            expect(getStatusAlert(editImageModal).prop('open')).toEqual(false);
          });

          it('a previous page button when this.state.shouldShowPreviousButton', () => {
            expect(getModalBody(editImageModal).find(Button)).toHaveLength(1);
          });

          it('a previous page button with correct props', () => {
            const previousButton = getModalBody(editImageModal).find(Button);
            expect(previousButton).toHaveLength(1);
            expect(shallowWithIntl(previousButton.prop('label')).prop('message')).toEqual(messages.editImageModalPreviousPageButton);
            expect(previousButton.prop('buttonType')).toEqual('link');
          });

          it('no previous page button when not this.state.shouldShowPreviousButton', () => {
            editImageModal.setState({
              shouldShowPreviousButton: false,
            });

            expect(getModalBody(editImageModal).find(Button)).toHaveLength(0);
          });

          describe('a form with', () => {
            it('a form', () => {
              expect(getFormContainer(editImageModal)).toHaveLength(1);
            });

            describe('an imageDescription Fieldset with', () => {
              describe('a Fieldset with', () => {
                it('a Fieldset', () => {
                  expect(getImageDescriptionFieldset(editImageModal)).toHaveLength(1);
                });

                it('correct initial props', () => {
                  const imageDescriptionFieldset = getImageDescriptionFieldset(editImageModal);

                  expect(shallowWithIntl(imageDescriptionFieldset.prop('legend')).prop('message'))
                    .toEqual(messages.editImageModalImageDescriptionLegend);
                  expect(imageDescriptionFieldset.prop('id')).toEqual('imageDescriptionFieldset');
                  expect(shallowWithIntl(imageDescriptionFieldset.prop('invalidMessage')).prop('message')).toEqual(messages.editImageModalFormValidImageDescription);
                  expect(imageDescriptionFieldset.prop('isValid')).toEqual(true);
                  expect(imageDescriptionFieldset.prop('variant')).toEqual({ status: Variant.status.DANGER });
                  expect(shallowWithIntl(imageDescriptionFieldset.prop('variantIconDescription')).prop('message')).toEqual(messages.editImageModalFormError);
                });
              });

              describe('an imageDescription TextInput with', () => {
                it('an InputText', () => {
                  expect(getImageDescriptionInput(editImageModal)).toHaveLength(1);
                });

                it('correct initial props', () => {
                  const imageDescriptionInput = getImageDescriptionInput(editImageModal);

                  expect(imageDescriptionInput.prop('name')).toEqual('imageDescription');
                  /*
                    Due to Enzyme issue #1213, we must wrap React Fragments in a div in order
                    to succesfully shallow them. Once Enzyme introduces support for React Fragments,
                    we can remove the extraneous div.
                  */
                  expect(shallowWithIntl(<div>{imageDescriptionInput.prop('label')}</div>).find(WrappedMessage).prop('message'))
                    .toEqual(messages.editImageModalImageDescriptionLabel);
                  expect(imageDescriptionInput.prop('describedBy')).toEqual('#Error-imageDescription');

                  /*
                    Due to Enzyme issue #1213, we must wrap React Fragments in a div in order
                    to succesfully shallow them. Once Enzyme introduces support for React Fragments,
                    we can remove the extraneous div.
                  */
                  const imageDescriptionInputDescriptionMessages = shallowWithIntl(<div>{imageDescriptionInput.prop('description')}</div>).find(WrappedMessage);
                  expect(imageDescriptionInputDescriptionMessages.at(0).prop('message'))
                    .toEqual(messages.editImageModalImageDescriptionDescription);
                  expect(imageDescriptionInputDescriptionMessages.at(1).prop('message'))
                    .toEqual(messages.editImageModalLearnMore);

                  expect(imageDescriptionInput.prop('id')).toEqual('imageDescription');
                  expect(imageDescriptionInput.prop('type')).toEqual('text');
                  expect(imageDescriptionInput.prop('value')).toEqual('');
                  expect(imageDescriptionInput.prop('disabled')).toEqual(false);
                });

                it('a Learn More link in description', () => {
                  /*
                    Due to Enzyme issue #1213, we must wrap React Fragments in a div in order
                    to succesfully shallow them. Once Enzyme introduces support for React Fragments,
                    we can remove the extraneous div.
                  */
                  const imageDescriptionInputDescriptionMessages = shallowWithIntl(<div>{getImageDescriptionInput(editImageModal).prop('description')}</div>).find(WrappedMessage);

                  expect(imageDescriptionInputDescriptionMessages.at(1).prop('message'))
                    .toEqual(messages.editImageModalLearnMore);
                  expect(imageDescriptionInputDescriptionMessages.at(1).prop('children')().type).toEqual('a');
                });
              });

              describe('a image description CheckBox with', () => {
                it('a CheckBox', () => {
                  expect(getImageDescriptionInputCheckBox(editImageModal)).toHaveLength(1);
                });

                it('correct initial props', () => {
                  const imageDescriptionInputCheckbox =
                    getImageDescriptionInputCheckBox(editImageModal);

                  expect(imageDescriptionInputCheckbox.prop('id')).toEqual('isDecorative');
                  expect(imageDescriptionInputCheckbox.prop('id')).toEqual('isDecorative');

                  expect(shallowWithIntl(imageDescriptionInputCheckbox.prop('label')).prop('message'))
                    .toEqual(messages.editImageModalImageIsDecorativeCheckboxLabel);

                  expect(imageDescriptionInputCheckbox.prop('checked')).toEqual(false);
                });

                it('a Learn More link in description', () => {
                  /*
                    Due to Enzyme issue #1213, we must wrap React Fragments in a div in order
                    to succesfully shallow them. Once Enzyme introduces support for React Fragments,
                    we can remove the extraneous div.
                  */
                  const imageDescriptionInputCheckBoxDescriptionMessages = shallowWithIntl(<div>{getImageDescriptionInputCheckBox(editImageModal).prop('description')}</div>).find(WrappedMessage);
                  expect(imageDescriptionInputCheckBoxDescriptionMessages.at(1).prop('children')().type).toEqual('a');
                  expect(imageDescriptionInputCheckBoxDescriptionMessages.at(1).prop('message'))
                    .toEqual(messages.editImageModalLearnMore);
                });
              });
            });

            describe('an imageDimensions Fieldset with', () => {
              describe('a Fieldset with', () => {
                it('a Fieldset', () => {
                  expect(getImageDimensionsFieldset(editImageModal)).toHaveLength(1);
                });

                it('correct initial props', () => {
                  const imageDimensionsFieldset = getImageDimensionsFieldset(editImageModal);

                  expect(shallowWithIntl(imageDimensionsFieldset.prop('legend')).prop('message'))
                    .toEqual(messages.editImageModalDimensionsLegend);
                  expect(imageDimensionsFieldset.prop('id')).toEqual('imageDimensionsFieldset');
                  expect(shallowWithIntl(imageDimensionsFieldset.prop('invalidMessage')).prop('message')).toEqual(messages.editImageModalFormValidImageDimensions);
                  expect(imageDimensionsFieldset.prop('isValid')).toEqual(true);
                  expect(imageDimensionsFieldset.prop('variant')).toEqual({ status: Variant.status.DANGER });
                  expect(shallowWithIntl(imageDimensionsFieldset.prop('variantIconDescription')).prop('message')).toEqual(messages.editImageModalFormError);
                });
              });

              it('a form-row', () => {
                expect(getImageDimensionsFieldset(editImageModal).find('div.form-row')).toHaveLength(1);
              });

              describe('an imageDimensions width InputText with', () => {
                it('an InputText', () => {
                  expect(getImageDimensionsWidthInput(editImageModal)).toHaveLength(1);
                });

                it('correct initial props', () => {
                  const imageDimensionsWidthInput = getImageDimensionsWidthInput(editImageModal);

                  expect(imageDimensionsWidthInput.prop('name')).toEqual('imageWidth');
                  expect(shallowWithIntl(imageDimensionsWidthInput.prop('label')).prop('message'))
                    .toEqual(messages.editImageModalImageWidthLabel);
                  expect(imageDimensionsWidthInput.prop('id')).toEqual('imageWidth');
                  expect(imageDimensionsWidthInput.prop('type')).toEqual('number');
                  expect(imageDimensionsWidthInput.prop('value')).toEqual('');
                });
              });

              describe('an imageDimensionsHeight InputText with', () => {
                it('an InputText', () => {
                  expect(getImageDimensionsHeightInput(editImageModal)).toHaveLength(1);
                });

                it('correct initial props', () => {
                  const imageDimensionsHeightInput = getImageDimensionsHeightInput(editImageModal);

                  expect(imageDimensionsHeightInput.prop('name')).toEqual('imageHeight');
                  expect(shallowWithIntl(imageDimensionsHeightInput.prop('label')).prop('message'))
                    .toEqual(messages.editImageModalImageHeightLabel);
                  expect(imageDimensionsHeightInput.prop('id')).toEqual('imageHeight');
                  expect(imageDimensionsHeightInput.prop('type')).toEqual('number');
                  expect(imageDimensionsHeightInput.prop('value')).toEqual('');
                });
              });

              describe('an imageDimensions lockProportions CheckBox with', () => {
                it('a CheckBox', () => {
                  expect(getImageDimensionsCheckBox(editImageModal)).toHaveLength(1);
                });

                it('correct initial props', () => {
                  const imageDimensionsCheckBox = getImageDimensionsCheckBox(editImageModal);

                  expect(imageDimensionsCheckBox.prop('id')).toEqual('lockProportions');
                  expect(imageDimensionsCheckBox.prop('name')).toEqual('lockProportions');
                  expect(shallowWithIntl(imageDimensionsCheckBox.prop('label')).prop('message'))
                    .toEqual(messages.editImageModalLockImageProportionsCheckboxLabel);
                  expect(imageDimensionsCheckBox.prop('checked')).toEqual(true);
                });
              });
            });
          });
        });
      });
    });
  });

  describe('Modal', () => {
    it('this.state.isModalOpen is false by default', () => {
      expect(editImageModal.state('isModalOpen')).toEqual(false);
    });

    describe('behaves', () => {
      it('has correct initial state for a course with assets', () => {
        editImageModal.setProps({
          assetsList: testAssetsList,
        });

        expect(editImageModal.state('areImageDimensionsValid')).toEqual(true);
        expect(editImageModal.state('areProportionsLocked')).toEqual(true);
        expect(editImageModal.state('assetsPageType')).toEqual(pageTypes.NORMAL);
        expect(editImageModal.state('baseAssetURL')).toEqual('');
        expect(editImageModal.state('currentValidationMessages')).toEqual({});
        expect(editImageModal.state('displayLoadingSpinner')).toEqual(false);
        expect(editImageModal.state('imageDescription')).toEqual('');
        expect(editImageModal.state('imageDimensions')).toEqual({});
        expect(editImageModal.state('imageSource')).toEqual('');
        expect(editImageModal.state('imageStyle')).toEqual('');
        expect(editImageModal.state('isImageDecorative')).toEqual(false);
        expect(editImageModal.state('isImageDescriptionValid')).toEqual(true);
        expect(editImageModal.state('isImageLoaded')).toEqual(false);
        expect(editImageModal.state('isImageLoading')).toEqual(false);
        expect(editImageModal.state('isStatusAlertOpen')).toEqual(false);
        expect(editImageModal.state('isModalOpen')).toEqual(false);
        expect(editImageModal.state('pageNumber')).toEqual(1);
        expect(editImageModal.state('shouldShowPreviousButton')).toEqual(false);
      });

      it('handleOpenModal sets correct state for empty event (inserting an image) with assets', () => {
        editImageModal.setProps({
          assetsList: testAssetsList,
        });

        editImageModal.instance().handleOpenModal(new CustomEvent('openModal', { detail: {} }));

        expect(editImageModal.state('areImageDimensionsValid')).toEqual(true);
        expect(editImageModal.state('areProportionsLocked')).toEqual(true);
        expect(editImageModal.state('assetsPageType')).toEqual(pageTypes.NORMAL);
        expect(editImageModal.state('baseAssetURL')).toEqual('');
        expect(editImageModal.state('currentUploadErrorMessage')).toBe(null);
        expect(editImageModal.state('currentValidationMessages')).toEqual({});
        expect(editImageModal.state('displayLoadingSpinner')).toEqual(false);
        expect(editImageModal.state('imageDescription')).toEqual('');
        expect(editImageModal.state('imageDimensions')).toEqual({});
        expect(editImageModal.state('imageSource')).toEqual('');
        expect(editImageModal.state('imageStyle')).toEqual('');
        expect(editImageModal.state('isImageDecorative')).toEqual(false);
        expect(editImageModal.state('isImageDescriptionValid')).toEqual(true);
        expect(editImageModal.state('isImageLoaded')).toEqual(false);
        expect(editImageModal.state('isImageLoading')).toEqual(false);
        expect(editImageModal.state('isStatusAlertOpen')).toEqual(false);
        expect(editImageModal.state('isModalOpen')).toEqual(true);
        expect(editImageModal.state('pageNumber')).toEqual(1);
        expect(editImageModal.state('shouldShowPreviousButton')).toEqual(true);
      });

      it('handleOpenModal sets correct state for empty event (inserting an image) without assets', () => {
        editImageModal.instance().handleOpenModal(new CustomEvent('openModal', { detail: {} }));

        expect(editImageModal.state('areImageDimensionsValid')).toEqual(true);
        expect(editImageModal.state('areProportionsLocked')).toEqual(true);
        expect(editImageModal.state('assetsPageType')).toEqual(pageTypes.NO_ASSETS);
        expect(editImageModal.state('baseAssetURL')).toEqual('');
        expect(editImageModal.state('currentUploadErrorMessage')).toBe(null);
        expect(editImageModal.state('currentValidationMessages')).toEqual({});
        expect(editImageModal.state('displayLoadingSpinner')).toEqual(false);
        expect(editImageModal.state('imageDescription')).toEqual('');
        expect(editImageModal.state('imageDimensions')).toEqual({});
        expect(editImageModal.state('imageSource')).toEqual('');
        expect(editImageModal.state('imageStyle')).toEqual('');
        expect(editImageModal.state('isImageDecorative')).toEqual(false);
        expect(editImageModal.state('isImageDescriptionValid')).toEqual(true);
        expect(editImageModal.state('isImageLoaded')).toEqual(false);
        expect(editImageModal.state('isImageLoading')).toEqual(false);
        expect(editImageModal.state('isStatusAlertOpen')).toEqual(false);
        expect(editImageModal.state('isModalOpen')).toEqual(true);
        expect(editImageModal.state('pageNumber')).toEqual(1);
        expect(editImageModal.state('shouldShowPreviousButton')).toEqual(true);
      });

      it('handleOpenModal sets correct state for event with data (editing an image)', () => {
        editImageModal.setProps({
          assetsList: testAssetsList,
        });

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

        expect(editImageModal.state('areImageDimensionsValid')).toEqual(true);
        expect(editImageModal.state('assetsPageType')).toEqual(pageTypes.NORMAL);
        expect(editImageModal.state('baseAssetURL')).toEqual(sampleText);
        expect(editImageModal.state('currentUploadErrorMessage')).toBe(null);
        expect(editImageModal.state('currentValidationMessages')).toEqual({});
        expect(editImageModal.state('displayLoadingSpinner')).toEqual(false);
        expect(editImageModal.state('imageDescription')).toEqual(sampleText);
        expect(editImageModal.state('imageDimensions')).toEqual({
          width: sampleImgData.naturalWidth,
          height: sampleImgData.naturalHeight,
          aspectRatio: sampleImgData.aspectRatio,
        });
        expect(editImageModal.state('imageStyle')).toEqual(sampleText);
        expect(editImageModal.state('imageSource')).toEqual(sampleText);
        expect(editImageModal.state('isImageDecorative')).toEqual(false);
        expect(editImageModal.state('isImageDescriptionValid')).toEqual(true);
        expect(editImageModal.state('isImageLoaded')).toEqual(true);
        expect(editImageModal.state('isImageLoading')).toEqual(false);
        expect(editImageModal.state('isStatusAlertOpen')).toEqual(false);
        expect(editImageModal.state('isModalOpen')).toEqual(true);
        expect(editImageModal.state('pageNumber')).toEqual(2);
        expect(editImageModal.state('shouldShowPreviousButton')).toEqual(false);
      });

      it('onEditImageModalClose sets this.state.open to false', () => {
        const closeModalButton = getModalFooter(editImageModal).find(Button).at(1);

        editImageModal.setState({
          open: true,
        });

        editImageModal.instance().setModalWrapperRef({
          dispatchEvent: jest.fn(),
        });

        closeModalButton.simulate('click');

        expect(editImageModal.state('isModalOpen')).toEqual(false);
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

        const closeModalButton = getModalFooter(editImageModal).find(Button).at(1);
        closeModalButton.simulate('click');

        expect(editImageModal.state('isModalOpen')).toEqual(false);
      });

      it('onEditImageModalClose sets calls clearSearch prop', () => {
        const clearSearchSpy = jest.fn();

        editImageModal.setProps({
          clearSearch: clearSearchSpy,

        });

        editImageModal.instance().setModalWrapperRef({
          dispatchEvent: jest.fn(),
        });

        const closeModalButton = getModalFooter(editImageModal).find(Button).at(1);
        closeModalButton.simulate('click');

        expect(clearSearchSpy).toHaveBeenCalledTimes(1);
      });

      it('onEditImageModalClose sets calls resetImageSelection', () => {
        const resetImageSelectionSpy = jest.fn();

        editImageModal.instance().resetImageSelection = resetImageSelectionSpy;

        editImageModal.instance().setModalWrapperRef({
          dispatchEvent: jest.fn(),
        });

        const closeModalButton = getModalFooter(editImageModal).find(Button).at(1);
        closeModalButton.simulate('click');

        expect(resetImageSelectionSpy).toHaveBeenCalledTimes(1);
      });

      it('resetImageSelection calls updatePage prop', () => {
        const updatePageSpy = jest.fn();

        editImageModal.setProps({
          updatePage: updatePageSpy,
        });

        editImageModal.instance().resetImageSelection();

        expect(updatePageSpy).toHaveBeenCalledTimes(1);
        expect(updatePageSpy).toHaveBeenCalledWith(0, courseDetails);
      });

      it('resetImageSelection calls clearSelectedAsset prop', () => {
        const clearSelectedAssetSpy = jest.fn();

        editImageModal.setProps({
          clearSelectedAsset: clearSelectedAssetSpy,
        });

        editImageModal.instance().resetImageSelection();

        expect(clearSelectedAssetSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('Status Alert: page 1', () => {
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

    describe('Status Alert: page 2', () => {
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

      it('status alert is displayed if invalid form submitted', () => {
        getInsertImageButton(editImageModal).simulate('click');

        editImageModal.update();

        expect(getStatusAlert(editImageModal).prop('open')).toEqual(true);
      });

      it('StatusAlert open prop is false when status alert is closed', () => {
        getInsertImageButton(editImageModal).simulate('click');

        getCloseStatusAlertButton(editImageModal).simulate('click');

        expect(getStatusAlert(editImageModal).prop('open')).toEqual(false);
      });

      it('this.state.currentValidationMessages is empty object by default', () => {
        expect(editImageModal.state('currentValidationMessages')).toEqual({});
      });

      it('this.state.currentValidationMessages has correct validation messages when invalid form submitted', () => {
        getInsertImageButton(editImageModal).simulate('click');

        expect(editImageModal.state('currentValidationMessages').imageDescription.props.message).toEqual(messages.editImageModalFormValidImageDescription);
      });

      it('this.state.currentValidationMessages has correct validation message when invalid image description submitted', () => {
        editImageModal.setState({
          imageSource: sampleText,
        });

        getInsertImageButton(editImageModal).simulate('click');

        expect(editImageModal.state('currentValidationMessages')).not.toHaveProperty('imageDimensions');
        expect(editImageModal.state('currentValidationMessages').imageDescription.props.message).toEqual(messages.editImageModalFormValidImageDescription);
      });

      it('this.state.currentValidationMessages has correct validation message when invalid image dimensions submitted', () => {
        editImageModal.setState({
          imageSource: sampleText,
          imageDescription: sampleText,
          imageDimensions: {
            height: -1 * sampleImgData.height,
            width: -1 * sampleImgData.width,
          },
        });

        getInsertImageButton(editImageModal).simulate('click');

        expect(editImageModal.state('currentValidationMessages').imageWidth.props.message).toEqual(messages.editImageModalFormValidImageDimensions);
        expect(editImageModal.state('currentValidationMessages')).not.toHaveProperty('imageDescription');
      });

      it('this.state.currentValidationMessages is empty when valid form submitted', () => {
        editImageModal.setState({
          imageDimensions: {
            width: sampleImgData.naturalWidth,
            height: sampleImgData.naturalHeight,
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

      it('status alert has correct validation messages when invalid form submitted', () => {
        editImageModal.setState({
          imageDimensions: {
            height: (-1 * sampleImgData.naturalHeight),
            width: (-1 * sampleImgData.naturalWidth),
          },
        });

        getInsertImageButton(editImageModal).simulate('click');

        editImageModal.update();

        const statusAlertListItems = shallowWithIntl(getStatusAlert(editImageModal).prop('dialog')).find('div ul.bullet-list li a');
        expect(statusAlertListItems).toHaveLength(2);
        expect(statusAlertListItems.at(0).find(WrappedMessage).prop('message')).toEqual(messages.editImageModalFormValidImageDescription);
        expect(statusAlertListItems.at(1).find(WrappedMessage).prop('message')).toEqual(messages.editImageModalFormValidImageDimensions);
      });

      it('validation messages are hyperlinks that navigate to appropriate form elements', () => {
        editImageModal.setState({
          imageDimensions: {
            height: (-1 * sampleImgData.naturalHeight),
            width: (-1 * sampleImgData.naturalWidth),
          },
        });

        getInsertImageButton(editImageModal).simulate('click');

        // force re-render to make sure validation messages are rendered
        editImageModal.update();

        const statusAlertListItems = shallowWithIntl(getStatusAlert(editImageModal).prop('dialog')).find('div ul.bullet-list li a');
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

        const validationMessages = shallowWithIntl(statusAlert.prop('dialog')).find(WrappedMessage);
        expect(validationMessages).toHaveLength(2);
        expect(validationMessages.at(0).prop('message')).toEqual(messages.editImageModalFormErrorMissingFields);
        expect(validationMessages.at(1).prop('message')).toEqual(messages.editImageModalFormValidImageDescription);

        const statusAlertListItems = shallowWithIntl(statusAlert.prop('dialog')).find('div ul.bullet-list li a');
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

        const statusAlertListItems = shallowWithIntl(getStatusAlert(editImageModal).prop('dialog')).find('div ul.bullet-list li a');
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

      it('focus on page 2 is moved to image description input when status alert is closed and previous button is not shown', () => {
        editImageModal.setState({
          shouldShowPreviousButton: false,
        });

        const focusSpy = jest.fn();

        editImageModal.instance().setImageDescriptionInputRef({
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
          open: true,
          pageNumber: 2,
          shouldShowPreviousButton: true,
        });
      });

      it('isValid states for each field is false if invalid form data submitted', () => {
        editImageModal.setState({
          imageDimensions: {
            height: (-1 * sampleImgData.naturalHeight),
            width: (-1 * sampleImgData.naturalWidth),
          },
        });

        getInsertImageButton(editImageModal).simulate('click');

        expect(editImageModal.state('isImageDescriptionValid')).toEqual(false);
        expect(editImageModal.state('areImageDimensionsValid')).toEqual(false);
      });

      it('fieldsets show validation messages if invalid form data submitted', () => {
        editImageModal.setState({
          imageDimensions: {
            height: (-1 * sampleImgData.naturalHeight),
            width: (-1 * sampleImgData.naturalWidth),
          },
          pageNumber: 2,
          shouldShowPreviousButton: true,
        });

        getInsertImageButton(editImageModal).simulate('click');

        editImageModal.update();

        const imageDescriptionFieldset = getImageDescriptionFieldset(editImageModal);
        expect(imageDescriptionFieldset.prop('isValid')).toEqual(false);
        expect(shallowWithIntl(imageDescriptionFieldset.prop('invalidMessage')).prop('message')).toEqual(messages.editImageModalFormValidImageDescription);

        const imageDimensionsFieldset = getImageDimensionsFieldset(editImageModal);
        expect(imageDimensionsFieldset.prop('isValid')).toEqual(false);
        expect(shallowWithIntl(imageDimensionsFieldset.prop('invalidMessage')).prop('message')).toEqual(messages.editImageModalFormValidImageDimensions);
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

    describe('AssetsDropZone', () => {
      it('has correct props', () => {
        const dropZone = getModalBody(editImageModal).find('Connect(AssetsDropZone)');
        expect(dropZone.prop('maxFileCount')).toEqual(1);
        expect(dropZone.prop('maxFileSizeMB')).toEqual(10);
        expect(dropZone.prop('acceptedFileTypes')).toEqual('image/*');
        expect(dropZone.prop('compactStyle')).toEqual(true);
      });
    });

    describe('Image Preview', () => {
      beforeEach(() => {
        editImageModal.setState({
          pageNumber: 2,
          shouldShowPreviousButton: true,
        });
      });

      it('correct state is set on image load', () => {
        editImageModal.setState({
          imageSource: sampleText,
        });

        getModalBody(editImageModal).find('img').simulate('load', { target: { ...sampleImgData } });

        expect(editImageModal.state('displayLoadingSpinner')).toEqual(false);
        expect(editImageModal.state('imageDimensions')).toEqual({
          width: sampleImgData.naturalWidth,
          height: sampleImgData.naturalHeight,
          aspectRatio: sampleImgData.naturalWidth / sampleImgData.naturalHeight,
        });
        expect(editImageModal.state('isImageLoaded')).toEqual(true);
        expect(editImageModal.state('isImageLoading')).toEqual(false);
      });

      it('correct state is set on image error', () => {
        editImageModal.setState({
          imageSource: sampleText,
        });

        getModalBody(editImageModal).find('img').simulate('error');

        expect(editImageModal.state('displayLoadingSpinner')).toEqual(false);
        expect(editImageModal.state('imageDimensions')).toEqual({});
        expect(editImageModal.state('isImageLoaded')).toEqual(false);
        expect(editImageModal.state('isImageLoading')).toEqual(false);
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

    describe('Image Description Fieldset', () => {
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

      it('sends this.state.imageDescription as value prop to image description input', () => {
        editImageModal.setState({
          imageDescription: sampleText,
        });

        expect(getImageDescriptionInput(editImageModal).prop('value')).toEqual(sampleText);
      });

      it('sets this.state.imageDescription with value on input onBlur', () => {
        getImageDescriptionInput(editImageModal).simulate('blur', sampleText);
        expect(editImageModal.state('imageDescription')).toEqual(sampleText);
      });

      it('sets this.state.isImageDecorative with value on checkbox onChange', () => {
        const isImageDecoractiveCheckBox = getImageDescriptionInputCheckBox(editImageModal);

        isImageDecoractiveCheckBox.simulate('change', true);

        expect(editImageModal.state('isImageDecorative')).toEqual(true);

        isImageDecoractiveCheckBox.simulate('change', false);

        expect(editImageModal.state('isImageDecorative')).toEqual(false);
      });

      it('sends this.state.isImageDecorative as checkbox checked prop to image description checkbox', () => {
        editImageModal.setState({
          isImageDecorative: true,
        });

        expect(getImageDescriptionInputCheckBox(editImageModal).prop('checked')).toEqual(true);

        editImageModal.setState({
          isImageDecorative: false,
        });

        expect(getImageDescriptionInputCheckBox(editImageModal).prop('checked')).toEqual(false);
      });

      it('toggles image description input disabled prop via checkbox', () => {
        getImageDescriptionInputCheckBox(editImageModal).simulate('change', true);

        editImageModal.update();

        expect(getImageDescriptionInput(editImageModal).prop('disabled')).toEqual(true);

        getImageDescriptionInputCheckBox(editImageModal).simulate('change', false);

        editImageModal.update();

        expect(getImageDescriptionInput(editImageModal).prop('disabled')).toEqual(false);
      });

      it('returns correct feedback for invalid description (uses initial state)', () => {
        const feedback = editImageModal.instance().validateImageDescription();

        expect(feedback.isValid).toEqual(false);
        expect(shallowWithIntl(feedback.validationMessage).prop('message'))
          .toEqual(messages.editImageModalFormValidImageDescription);
        expect(shallowWithIntl(feedback.dangerIconDescription).prop('message'))
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

    describe('Image Dimensions Fieldset', () => {
      beforeEach(() => {
        editImageModal.setState({
          pageNumber: 2,
          shouldShowPreviousButton: true,
        });
      });

      it('sets this.state.areProportionsLocked with value on checkbox onChange', () => {
        getImageDimensionsCheckBox(editImageModal).simulate('change', false);

        expect(editImageModal.state('areProportionsLocked')).toEqual(false);

        getImageDimensionsCheckBox(editImageModal).simulate('change', true);

        expect(editImageModal.state('areProportionsLocked')).toEqual(true);
      });

      it('displays this.state.areProportionsLocked as checkbox checked', () => {
        editImageModal.setState({
          areProportionsLocked: true,
        });

        expect(getImageDimensionsCheckBox(editImageModal).prop('checked')).toEqual(true);

        editImageModal.setState({
          areProportionsLocked: false,
        });

        expect(getImageDimensionsCheckBox(editImageModal).prop('checked')).toEqual(false);
      });

      it('onImageDimensionBlur throws an Error for an unknown dimension type', () => {
        expect(() => editImageModal.instance().onImageDimensionBlur(sampleText)).toThrow(Error);
        expect(() => editImageModal.instance().onImageDimensionBlur(sampleText)).toThrow(`Unknown dimension type ${sampleText}.`);
      });


      it('returns correct feedback for invalid dimensions (negative numbers)', () => {
        editImageModal.setState({
          imageDimensions: {
            height: -1 * sampleImgData.height,
            width: -1 * sampleImgData.width,
          },
        });

        const feedback = editImageModal.instance().validateImageDimensions();

        expect(feedback.isValid).toEqual(false);
        expect(shallowWithIntl(feedback.validationMessage).prop('message'))
          .toEqual(messages.editImageModalFormValidImageDimensions);
        expect(shallowWithIntl(feedback.dangerIconDescription).prop('message'))
          .toEqual(messages.editImageModalFormError);
      });

      it('returns correct feedback for valid dimension (positive numbers)', () => {
        editImageModal.setState({
          imageDescription: sampleText,
          imageDimensions: {
            height: sampleImgData.height,
            width: sampleImgData.width,
          },
        });

        const feedback = editImageModal.instance().validateImageDimensions();

        expect(feedback.isValid).toEqual(true);
        expect(feedback.validationMessage).toBeUndefined();
        expect(feedback.dangerIconDescription).toBeUndefined();
      });

      it('returns correct feedback for valid dimensions (uses empty object/initial state', () => {
        const feedback = editImageModal.instance().validateImageDimensions();

        expect(feedback.isValid).toEqual(true);
        expect(feedback.validationMessage).toBeUndefined();
        expect(feedback.dangerIconDescription).toBeUndefined();
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

        expect(dispatchEventSpy.mock.calls[0][0].detail.height)
          .toEqual(sampleImgData.naturalHeight);
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

        expect(dispatchEventSpy.mock.calls[0][0].detail.height)
          .toEqual(sampleImgData.naturalHeight);
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
});
