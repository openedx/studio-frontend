export const filters = {
  ALL: 'ALL',
  SELF_PACED: 'SELF_PACED',
  INSTRUCTOR_PACED: 'INSTRUCTOR_PACED',
};

export const launchChecklist = {
  data: [
    {
      id: 'welcomeMessage',
      pacingTypeFilter: filters.ALL,
    },
    {
      id: 'gradingPolicy',
      pacingTypeFilter: filters.ALL,
    },
    {
      id: 'certificate',
      pacingTypeFilter: filters.ALL,
    },
    {
      id: 'courseDates',
      pacingTypeFilter: filters.ALL,
    },
    {
      id: 'assignmentDeadlines',
      pacingTypeFilter: filters.INSTRUCTOR_PACED,
    },
  ],
};

export const bestPracticesChecklist = {
  data: [
    {
      id: 'videoDuration',
      pacingTypeFilter: filters.ALL,
    },
    {
      id: 'mobileFriendlyVideo',
      pacingTypeFilter: filters.ALL,
    },
    {
      id: 'diverseSequences',
      pacingTypeFilter: filters.ALL,
    },
    {
      id: 'weeklyHighlights',
      pacingTypeFilter: filters.SELF_PACED,
    },
    {
      id: 'unitDepth',
      pacingTypeFilter: filters.ALL,
    },
  ],
};
