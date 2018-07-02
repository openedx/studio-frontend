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
  assetsSearchInputLabel: {
    id: 'assetsSearchInputLabel',
    defaultMessage: 'Search',
    description: 'Label for search input',
  },
  assetsSearchSubmitLabel: {
    id: 'assetsSearchSubmitLabel',
    defaultMessage: 'Submit search',
    description: 'Label for search submit button that has a magnifying glass icon',
  },
  assetsClearSearchButtonLabel: {
    id: 'assetsClearSearchButtonLabel',
    defaultMessage: 'Clear search',
    description: 'Label for a button that clears the search applied to a table.',
  },
});

export default messages;
