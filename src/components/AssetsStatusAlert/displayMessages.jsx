import { defineMessages } from 'react-intl';

const messages = defineMessages({
  assetsStatusAlertGenericUpdateError: {
    id: 'assetsTableGenericUpdateError',
    defaultMessage: 'The action could not be completed. Refresh the page, and then try the action again.',
    description: 'States that the action could not be completed and asks the user to refresh the page and try the action again',
  },
  assetsStatusAlertCantDelete: {
    id: 'assetsTableCantDelete',
    defaultMessage: 'Unable to delete {assetName}.',
    description: 'States that an item could not be deleted',
  },
  assetsStatusAlertDeleteSuccess: {
    id: 'assetsTableDeleteSuccess',
    defaultMessage: '{assetName} has been deleted.',
    description: 'States that an item was successfully deleted',
  },
  assetsStatusAlertUploadSuccess: {
    id: 'assetsTableUploadSuccess',
    defaultMessage: '{uploaded_count} files successfully uploaded.',
    description: 'States that files were successfully uploaded',
  },
  assetsStatusAlertUploadInProgress: {
    id: 'assetsTableUploadInProgress',
    defaultMessage: '{uploading_count} files uploading.',
    description: 'States that the file upload operation is in progress',
  },
  assetsStatusAlertTooManyFiles: {
    id: 'assetsTableTooManyFiles',
    defaultMessage: 'The maximum number of files for an upload is {max_count}. No files were uploaded.',
    description: 'Error message shown when too many files are selected for upload',
  },
  assetsStatusAlertTooMuchData: {
    id: 'assetsTableTooMuchData',
    defaultMessage: 'The maximum size for an upload is {max_size} MB. No files were uploaded.',
    description: 'Error message shown when too much data is being uploaded',
  },
  assetsStatusAlertGenericError: {
    id: 'assetsTableGenericError',
    defaultMessage: 'Error uploading {assetName}. Try again.',
    description: 'Generic error message while uploading files',
  },
  assetsStatusAlertFailedLock: {
    id: 'assetsTableFailedLock',
    defaultMessage: 'Failed to toggle lock for {assetName}.',
    description: 'States that there was a failure toggling an item\'s lock status',
  },
  assetsStatusAlertLoadingStatus: {
    id: 'assetsTableLoadingStatus',
    defaultMessage: 'Loading',
    description: 'Indicates something is loading',
  },
});

export default messages;
