import { defineMessages } from 'react-intl';

const messages = defineMessages({
  completionCountLabel: {
    id: 'completionCountLabel',
    defaultMessage: '{completed}/{total} completed',
    description: 'Label that describes how many tasks have been completed out of a total number of tasks',
  },
  checklistsStatusLabel: {
    id: 'checklistsStatusLabel',
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
  startDateStatusLabel: {
    id: 'startDateStatusLabel',
    defaultMessage: 'Start Date',
    description: 'Header text for a section that describe\'s the date a course starts',
  },
  pacingTypeStatusLabel: {
    id: 'pacingTypeStatusLabel',
    defaultMessage: 'Pacing Type',
    description: 'Header text for a section that describe\'s the pacing type of a course',
  },
  pacingTypeInstructorPaced: {
    id: 'pacingTypeInstructorPaced',
    defaultMessage: 'Instructor-Paced',
    description: 'Text that describe\'s a course that follows a schedule set by an instructor',
  },
  pacingTypeSelfPaced: {
    id: 'pacingTypeSelfPaced',
    defaultMessage: 'Self-Paced',
    description: 'Text that describe\'s a course that does not have a set schedule',
  },
});

export default messages;
