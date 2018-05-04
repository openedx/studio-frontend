import { defineMessages } from 'react-intl';

const messages = defineMessages({
  assetsPageNoResultsMessage: {
    id: 'assetsPageNoResultsMessage',
    defaultMessage: '0 files found',
    description: 'Message displayed in table when no results are found.',
  },
  assetsPageNoAssetsMessage: {
    id: 'assetsPageNoAssetsMessage',
    defaultMessage: '0 files uploaded',
    description: 'Message displayed when a course has no files to display in the table.',
  },
  assetsPageSkipLink: {
    id: 'assetsPageSkipLink',
    defaultMessage: 'Skip to table contents',
    description: 'Link text for a link that will skip user focus over table filters to table contents.',
  },
});

export default messages;
