import { filters } from './courseChecklistData';

const getFilteredChecklist = (
  checklist,
  isSelfPaced,
  hasCertificatesEnabled,
  hasHighlightsEnabled,
  needsProctoringEscalationEmail,
) => {
  let filteredCheckList;

  if (isSelfPaced) {
    filteredCheckList = checklist.filter(data => data.pacingTypeFilter === filters.ALL
        || data.pacingTypeFilter === filters.SELF_PACED);
  } else {
    filteredCheckList = checklist.filter(data => data.pacingTypeFilter === filters.ALL
        || data.pacingTypeFilter === filters.INSTRUCTOR_PACED);
  }

  filteredCheckList = filteredCheckList.filter(data => data.id !== 'certificate'
    || hasCertificatesEnabled);

  filteredCheckList = filteredCheckList.filter(data => data.id !== 'weeklyHighlights'
    || hasHighlightsEnabled);

  filteredCheckList = filteredCheckList.filter(data => data.id !== 'proctoringEmail'
    || needsProctoringEscalationEmail);

  return filteredCheckList;
};

export default getFilteredChecklist;
