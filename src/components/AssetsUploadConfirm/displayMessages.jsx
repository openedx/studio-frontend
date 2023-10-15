import { defineMessages } from 'react-intl';

const messages = defineMessages({
  assetsUploadConfirmMessage: {
    id: 'assetsUploadConfirmMessage',
    defaultMessage: 'The following files will be overwritten: {listOfFiles}',
    description: 'The message displayed in the modal shown when uploading files with pre-existing names',
  },
  assetsUploadConfirmTitle: {
    id: 'assetsUploadConfirmTitle',
    defaultMessage: 'Overwrite Files',
    description: 'The title of the modal to confirm overwriting the files',
  },
  assetsUploadConfirmOverwrite: {
    id: 'assetsUploadConfirmOverwrite',
    defaultMessage: 'Overwrite',
    description: 'The message displayed in the button to confirm overwriting the files',
  },
  assetsUploadConfirmCancel: {
    id: 'assetsUploadConfirmCancel',
    defaultMessage: 'Cancel',
    description: 'The message displayed in the button to confirm cancelling the upload',
  },
});

export default messages;
