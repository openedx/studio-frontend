import { defineMessages } from 'react-intl';

const messages = defineMessages({
  assetsResultsCountFiltered: {
    id: 'assetsResultsCountFiltered',
    defaultMessage: 'Showing {start}-{end} out of {total, plural, one {{formatted_total} possible match} other {{formatted_total} possible matches}}.',
    description: 'Message above a paginated table describing what subset of a filtered result set is currently visible.',
  },
  assetsResultsCountTotal: {
    id: 'assetsResultsCountTotal',
    defaultMessage: 'Showing {start}-{end} out of {total, plural, one {{formatted_total} total file} other {{formatted_total} total files}}.',
    description: 'Message above a paginated table of files describing what subset of all files is currently visible.',
  },
});

export default messages;
