import { defineMessages } from 'react-intl';

const messages = defineMessages({
  assetsDropZoneAriaLabel: {
    id: 'assetsDropZoneAriaLabel',
    defaultMessage: 'Upload assets',
    description: 'Aria label for screenreaders on the upload region of the page',
  },
  assetsDropZoneBrowseLabel: {
    id: 'assetsDropZoneBrowseLabel',
    defaultMessage: 'Browse your computer',
    description: 'Upload label for the "Browse" button',
  },
  assetsDropZoneHeader: {
    id: 'assetsDropZoneHeader',
    defaultMessage: 'Drag and Drop',
    description: 'Upload with dropzone section heading',
  },
  assetsDropZoneMaxFileSizeLabel: {
    id: 'assetsDropZoneMaxFileSizeLabel',
    defaultMessage: 'Maximum file size: {maxFileSizeMB} MB',
    description: 'Upload label for maximum file size',
  },
});

export default messages;
