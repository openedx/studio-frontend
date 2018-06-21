import { filters } from './courseChecklistData';

const getFilteredChecklist = (checklist, isSelfPaced) => {
  let healthChecks;

  if (isSelfPaced) {
    healthChecks =
      checklist.filter(data => data.pacingTypeFilter === filters.ALL ||
        data.pacingTypeFilter === filters.SELF_PACED);
  } else {
    healthChecks =
      checklist.filter(data => data.pacingTypeFilter === filters.ALL ||
        data.pacingTypeFilter === filters.INSTRUCTOR_PACED);
  }

  return healthChecks;
};

export default getFilteredChecklist;
