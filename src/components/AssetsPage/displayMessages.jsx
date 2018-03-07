import { defineMessages } from 'react-intl';

const messages = defineMessages({
  assetsPageNoResultsCountFiles: {
    id: 'assetsPageNoResultsCountFiles',
    defaultMessage: '0 files',
    description: 'Title for a message displayed when no results are found.',
  },
  assetsPageNoResultsMessage: {
    id: 'assetsPageNoResultsMessage',
    defaultMessage: 'No files were found.',
    description: 'Message displayed in table when no results are found.',
  },
  assetsPageNoAssetsNumFiles: {
    id: 'assetsPageNoAssetsNumFiles',
    defaultMessage: '0 files in your course',
    description: 'Title for a message displayed when a course has no files to display in the table.',
  },
  assetsPageNoAssetsMessage: {
    id: 'assetsPageNoAssetsMessage',
    defaultMessage: 'Enhance your course content by uploading files such as images and documents.',
    description: 'Message displayed when a course has no files to display in the table.',
  },
});

export default messages;
