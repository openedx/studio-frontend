import { defineMessages } from 'react-intl';

const messages = defineMessages({
  launchChecklistLabel: {
    id: 'launchChecklistLabel',
    defaultMessage: 'Launch Checklist',
    description: 'Header text for a checklist that describes actions to have completed before a course should launch',
  },
  bestPracticesChecklistLabel: {
    id: 'bestPracticesChecklistLabel',
    defaultMessage: 'Best Practices Checklist',
    description: 'Header text for a checklist that describes best practices for a course',
  },
  launchChecklistLoadingLabel: {
    id: 'doneLoadingChecklistStatusLabel',
    defaultMessage: 'Launch Checklist data is loading',
    description: 'Label telling the user that the Launch Checklist is loading',
  },
  launchChecklistDoneLoadingLabel: {
    id: 'launchChecklistDoneLoadingLabel',
    defaultMessage: 'Launch Checklist data is done loading',
    description: 'Label telling the user that the Launch Checklist is done loading',
  },
  bestPracticesChecklistLoadingLabel: {
    id: 'bestPracticesChecklistLoadingLabel',
    defaultMessage: 'Best Practices Checklist data is loading',
    description: 'Label telling the user that the Best Practices Checklist is loading',
  },
  bestPracticesChecklistDoneLoadingLabel: {
    id: 'bestPracticesChecklistDoneLoadingLabel',
    defaultMessage: 'Best Practices Checklist data is done loading',
    description: 'Label telling the user that the Best Practices Checklist is done loading',
  },
});

export default messages;
