import { defineMessages } from 'react-intl';

const messages = defineMessages({
  completionCountLabel: {
    id: 'completionCountLabel',
    defaultMessage: '{completed}/{total} completed',
    description: 'Label that describes how many tasks have been completed out of a total number of tasks',
  },
});

export default messages;
