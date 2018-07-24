import { defineMessages } from 'react-intl';

const messages = defineMessages({
  completionCountLabel: {
    id: 'completionCountLabel',
    defaultMessage: '{completed}/{total} completed',
    description: 'Label that describes how many tasks have been completed out of a total number of tasks',
  },
  checklistLabel: {
    id: 'checklistLabel',
    defaultMessage: 'Checklists',
    description: 'Label for a section that describes a checklist',
  },
  checklistStatusLoadingLabel: {
    id: 'checklistStatusLoadingLabel',
    defaultMessage: 'Checklists data is loading',
    description: 'Label telling the user that a checklist status is loading',
  },
  checklistStatusDoneLoadingLabel: {
    id: 'checklistStatusDoneLoadingLabel',
    defaultMessage: 'Checklists data is done loading',
    description: 'Label telling the user that a checklist status is done loading',
  },
  loadingIconLabel: {
    id: 'loadingIconLabel',
    defaultMessage: 'Loading',
    description: 'Label for a loading icon',
  },
});

export default messages;
