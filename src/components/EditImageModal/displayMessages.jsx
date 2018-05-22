import { defineMessages } from 'react-intl';

const messages = defineMessages({
  editImageModalAssetsListLoadingSpinner: {
    id: 'editImageModalAssetsListLoadingSpinner',
    defaultMessage: 'Loading spinner',
    description: 'Description of a loading spinner image shown when files are loading.',
  },
  editImageModalAssetsListNoAssetsMessage: {
    id: 'editImageModalAssetsListNoAssetsMessage',
    defaultMessage: '0 images uploaded',
    description: 'Message displayed when a course has no images to display in the list.',
  },
  editImageModalAssetsListNoResultsMessage: {
    id: 'editImageModalAssetsListNoResultsMessage',
    defaultMessage: '0 images found',
    description: 'Message displayed in table when no image results are found.',
  },
  editImageModalCancelButton: {
    id: 'editImageModalCancelButton',
    defaultMessage: 'Cancel',
    description: 'Button text to close the modal',
  },
  editImageModalFormError: {
    id: 'editImageModalFormError',
    defaultMessage: 'Error',
    description: 'Screenreader-only text describing an error icon in a validation message',
  },
  editImageModalFormErrorMissingFields: {
    id: 'editImageModalFormErrorMissingFields',
    defaultMessage: 'Make sure to fill in all fields.',
    description: 'Error message to instruct user to fill in all fields',
  },
  editImageModalFormValidImageDescription: {
    id: 'editImageModalFormValidImageDescription',
    defaultMessage: 'Add an image description or specify that the image is decorative only.',
    description: 'Error message for when an invalid image description is entered into the form',
  },
  editImageModalFormValidImageDimensions: {
    id: 'editImageModalFormValidImageDimensions',
    defaultMessage: 'Image dimensions must be positive numbers.',
    description: 'Error message displayed when invalid image dimension values are entered into a form',
  },
  editImageModalImageDescriptionDescription: {
    id: 'editImageModalImageDescriptionDescription',
    defaultMessage: 'Alternative text for users who cannot view the image, such as "The sky with clouds".',
    description: 'Description for the text input box for an image\'s description',
  },
  editImageModalImageDescriptionLabel: {
    id: 'editImageModalImageDescriptionLabel',
    defaultMessage: 'Image Description (Alt Text)',
    description: 'Label for the text input box for an image\'s description',
  },
  editImageModalImageDescriptionLegend: {
    id: 'editImageModalImageDescriptionLegend',
    defaultMessage: 'Image Description',
    description: 'Label for input section for an image\'s description',
  },
  editImageModalDimensionsLegend: {
    id: 'editImageModalDimensionsLegend',
    defaultMessage: 'Image Dimensions',
    description: 'Label for the input section for an image\'s dimensions',
  },
  editImageModalImageHeightLabel: {
    id: 'editImageModalImageHeight',
    defaultMessage: 'Height',
    description: 'Label for the text input box for an image\'s height,',
  },
  editImageModalImageIsDecorativeCheckboxDescription: {
    id: 'editImageModalImageIsDecorativeCheckboxDescription',
    defaultMessage: 'This image is a background or other image that does not require alternative text.',
    description: 'Description for a checkbox that explains what it means for an image to be decorative',
  },
  editImageModalImageIsDecorativeCheckboxLabel: {
    id: 'editImageModalImageIsDecorativeCheckboxLabel',
    defaultMessage: 'This image is decorative only',
    description: 'Label for a checkbox that denotes that an image is decorative',
  },
  editImageModalImagePreviewText: {
    id: 'editImageModalImagePreviewText',
    defaultMessage: 'Image Preview',
    description: 'Label for the image preview area',
  },
  editImageModalInsertImageButton: {
    id: 'editImageModalInsertImageButton',
    defaultMessage: 'Insert Image',
    description: 'Text inside the Insert Image button at the bottom of the modal',
  },
  editImageModalLearnMore: {
    id: 'editImageModalLearnMore',
    defaultMessage: 'Learn more.',
    description: 'Label for a link to additional documentation',
  },
  editImageModalLockImageProportionsCheckboxLabel: {
    id: 'editImageModalLockImageProportionsCheckboxLabel',
    defaultMessage: 'Lock proportions',
    description: 'Label for a checkbox that constrains an image\'s proportions to its original aspect ratio',
  },
  editImageModalImageWidthLabel: {
    id: 'editImageModalImageWidth',
    defaultMessage: 'Width',
    description: 'Label for the text input box for an image\'s width,',
  },
  editImageModalInsertTitle: {
    id: 'editImageModalInsertTitle',
    defaultMessage: 'Add an Image',
    description: 'Title of the modal used for adding an image',
  },
  editImageModalInsertHeader: {
    id: 'editImageModalInsertHeader',
    defaultMessage: 'Select a previously uploaded image',
    description: 'Header of the modal used for adding an image',
  },
  editImageModalEditTitle: {
    id: 'editImageModalEditTitle',
    defaultMessage: 'Edit Image Settings',
    description: 'Title of the modal used for editing image settings',
  },
  editImageModalImageOrFields: {
    id: 'editImageModalImageOrFields',
    defaultMessage: 'or',
    description: 'Describes two choices,',
  },
  editImageModalNextPageButton: {
    id: 'editImageModalNextPageButton',
    defaultMessage: 'Next',
    description: 'Button text to go to the next screen',
  },
  editImageModalPreviousPageButton: {
    id: 'editImageModalPreviousPageButton',
    defaultMessage: 'Back',
    description: 'Button text to go to the previous screen',
  },
  editImageModalInvalidFileType: {
    id: 'editImageModalInvalidFileType',
    defaultMessage: 'Files must be images, such as .jpg, .png, and .tiff files. No files were uploaded.',
    description: 'Error message shown when an invalid file is selected for upload',
  },
  editImageModalTooManyFiles: {
    id: 'editImageModalTooManyFiles',
    defaultMessage: 'Only one file may be uploaded at a time. No files were uploaded.',
    description: 'Error message shown when too many files are selected for upload',
  },
});

export default messages;
