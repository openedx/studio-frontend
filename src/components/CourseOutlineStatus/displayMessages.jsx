import { defineMessages } from 'react-intl';

const messages = defineMessages({
  completionCountLabel: {
    id: 'completionCountLabel',
    defaultMessage: '{completed}/{total} completed',
    description: 'Label that describes how many tasks have been completed out of a total number of tasks',
  checklistLabel: {
    id: 'checklistLabel',
    defaultMessage: 'Checklists',
    description: 'Label for a section that describes a checklist',
  },
  loadingChecklistLabel: {
    id: 'loadingChecklistLabel',
    defaultMessage: 'Loading',
    description: 'Label telling the user that a checklist is loading',
  },
});

export default messages;
