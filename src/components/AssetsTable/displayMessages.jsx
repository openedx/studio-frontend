import { defineMessages } from 'react-intl';

const messages = defineMessages({
  assetsTablePreviewLabel: {
    id: 'assetsTablePreviewLabel',
    defaultMessage: 'Image Preview',
    description: 'Label for column header',
  },
  assetsTableNameLabel: {
    id: 'assetsTableNameLabel',
    defaultMessage: 'Name',
    description: 'Label for column header',
  },
  assetsTableTypeLable: {
    id: 'assetsTableTypeLable',
    defaultMessage: 'Type',
    description: 'Label for column header',
  },
  assetsTableDateLabel: {
    id: 'assetsTableDateLabel',
    defaultMessage: 'Date Added',
    description: 'Label for column header',
  },
  assetsTableCopyLabel: {
    id: 'assetsTableCopyLabel',
    defaultMessage: 'Copy URLs',
    description: 'Label for column header',
  },
  assetsTableDeleteLabel: {
    id: 'assetsTableDeleteLabel',
    defaultMessage: 'Delete Asset',
    description: 'Label for column header',
  },
  assetsTableLockLabel: {
    id: 'assetsTableLockLabel',
    defaultMessage: 'Lock Asset',
    description: 'Label for column header',
  },
  assetsTableNoDescription: {
    id: 'assetsTableNoDescription',
    defaultMessage: 'Description not available',
    description: 'Label shown when no description is available',
  },
  assetsTableNoPreview: {
    id: 'assetsTableNoPreview',
    defaultMessage: 'Preview not available',
    description: 'Label shown when no preview is available',
  },
  assetsTableLockedObject: {
    id: 'assetsTableLockedObject',
    defaultMessage: 'Locked {object}',
    description: 'States that an object has just been locked',
  },
  assetsTableUnlockedObject: {
    id: 'assetsTableUnlockedObject',
    defaultMessage: 'Unlocked {object}',
    description: 'States that an object has just been unlocked',
  },
  assetsTableUpdateLock: {
    id: 'assetsTableUpdateLock',
    defaultMessage: 'Updating lock status for {assetName}.',
    description: 'States that the lock status of an item is updating',
  },
  assetsTableFailedLock: {
    id: 'assetsTableFailedLock',
    defaultMessage: 'Failed to toggle lock for {assetName}.',
    description: 'States that there was a failure toggling an item\'s lock status',
  },
  assetsTableCantDelete: {
    id: 'assetsTableCantDelete',
    defaultMessage: 'Unable to delete {assetName}.',
    description: 'States that an item could not be deleted',
  },
  assetsTableDeleteSuccess: {
    id: 'assetsTableDeleteSuccess',
    defaultMessage: '{assetName} has been deleted.',
    description: 'States that an item was successfully deleted',
  },
  assetsTableUploadSuccess: {
    id: 'assetsTableUploadSuccess',
    defaultMessage: '{uploaded_count} files successfully uploaded.',
    description: 'States that files were successfully uploaded',
  },
  assetsTableUploadInProgress: {
    id: 'assetsTableUploadInProgress',
    defaultMessage: '{uploading_count} files uploading.',
    description: 'States that the file upload operation is in progress',
  },
  assetsTableTooManyFiles: {
    id: 'assetsTableTooManyFiles',
    defaultMessage: 'The maximum number of files for an upload is {max_count}. No files were uploaded.',
    description: 'Error message shown when too many files are selected for upload',
  },
  assetsTableTooMuchData: {
    id: 'assetsTableTooMuchData',
    defaultMessage: 'The maximum size for an upload is {max_size} MB. No files were uploaded.',
    description: 'Error message shown when too much data is being uploaded',
  },
  assetsTableGenericError: {
    id: 'assetsTableGenericError',
    defaultMessage: 'Error uploading {assetName}. Try again.',
    description: 'Generic error message while uploading files',
  },
  assetsTableStudioLink: {
    id: 'assetsTableStudioLink',
    defaultMessage: 'Studio',
    description: 'Label that indicates a relative (as opposed to an absolute) URL',
  },
  assetsTableWebLink: {
    id: 'assetsTableWebLink',
    defaultMessage: 'Web',
    description: 'Label that indicates an absolute (as opposed to a relative) URL',
  },
  assetsTableCopiedStatus: {
    id: 'assetsTableCopiedStatus',
    defaultMessage: 'Copied',
    description: 'States that a URL was copied',
  },
  assetsTableDetailedCopyLink: {
    id: 'assetsTableDetailedCopyLink',
    defaultMessage: '{displayName} copy {label} URL',
    description: 'Labels a button that is used to copy the studio/web URL for a given item',
  },
  assetsTableDeleteObject: {
    id: 'assetsTableDeleteObject',
    defaultMessage: 'Delete {displayName}',
    description: 'Labels the button used to delete a given item',
  },
  assetsTableCancel: {
    id: 'assetsTableCancel',
    defaultMessage: 'Cancel',
    description: 'Labels the "Cancel" button in a modal',
  },
  assetsTablePermaDelete: {
    id: 'assetsTablePermaDelete',
    defaultMessage: 'Permanently delete',
    description: 'Indicates a non-recoverable, permanent delete',
  },
  assetsTableLearnMore: {
    id: 'assetsTableLearnMore',
    defaultMessage: 'Learn more.',
    description: 'Label for a documentation link',
  },
  assetsTableDeleteWarning: {
    id: 'assetsTableDeleteWarning',
    defaultMessage: 'Deleting {displayName} cannot be undone.',
    description: 'Warning that indicates the delete operation is permanent',
  },
  assetsTableDeleteConsequences: {
    id: 'assetsTableDeleteConsequences',
    defaultMessage: 'Any links or references to this file will no longer work. {link}',
    description: 'Warns of the consequences of deleting an item',
  },
  assetsTableLoadingStatus: {
    id: 'assetsTableLoadingStatus',
    defaultMessage: 'Loading',
    description: 'Indicates something is loading',
  },
});

export default messages;
