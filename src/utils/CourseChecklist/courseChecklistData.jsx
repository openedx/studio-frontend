export const filters = {
  ALL: 'ALL',
  SELF_PACED: 'SELF_PACED',
  INSTRUCTOR_PACED: 'INSTRUCTOR_PACED',
};

export const launchChecklist = {
  heading: 'Launch Checklist',
  data: [
    {
      id: 'welcomeMessage',
      shortDescription: 'Add a Welcome Message',
      longDescription: 'Personally welcome learners into your course and prepare learners for a positive course experience.',
      pacingTypeFilter: filters.ALL,
    },
    {
      id: 'gradingPolicy',
      shortDescription: 'Create Your Course Grading Policy',
      longDescription: 'Establish your grading policy, including assignment types, passing score, and certificate eligibility. All assignments add up to 100%.',
      pacingTypeFilter: filters.ALL,
    },
    {
      id: 'certificate',
      shortDescription: 'Enable Your Certificate',
      longDescription: 'Make sure that all text is correct, signatures have been uploaded, and the certificate has been activated in Studio.',
      pacingTypeFilter: filters.ALL,
    },
    {
      id: 'courseDates',
      shortDescription: 'Set Important Course Dates',
      longDescription: 'Establish your course schedule, including when the course starts and ends.',
      pacingTypeFilter: filters.ALL,
    },
    {
      id: 'assignmentDeadlines',
      shortDescription: 'Validate Assignment Deadlines',
      longDescription: 'Ensure all assignment deadlines are between course start and end dates.',
      pacingTypeFilter: filters.INSTRUCTOR_PACED,
    },
  ],
};

export const bestPracticesChecklist = {
  heading: 'Best Practices Checklist',
  data: [
    {
      id: 'videoDuration',
      shortDescription: 'Video Duration',
      longDescription: 'Learners engage best with shorter video content followed by opportunities to practice. 80% or more of course videos should be less than 10 minutes in duration.',
      pacingTypeFilter: filters.ALL,
    },
    {
      id: 'mobileFriendlyVideo',
      shortDescription: 'Mobile Friendly Video',
      longDescription: '90% or more of course videos are mobile friendly.',
      pacingTypeFilter: filters.ALL,
    },
    {
      id: 'diverseSequences',
      shortDescription: 'Diverse Learning Sequences',
      longDescription: 'Research shows that a diverse content experience drives learner engagement. We recommend 80% or more of each learning sequence or subsection includes multiple content types (such as video, discussion, or problem).',
      pacingTypeFilter: filters.ALL,
    },
    {
      id: 'weeklyHighlights',
      shortDescription: 'Weekly Highlights (Self Paced Courses Only)',
      longDescription: 'Weekly highlights are enabled and populated with text. These highlights keep learners engaged and on-track, no matter where they are in your course.',
      pacingTypeFilter: filters.SELF_PACED,
    },
    {
      id: 'unitDepth',
      shortDescription: 'Unit Depth',
      longDescription: 'Breaking up course content into manageable pieces promotes learner engagement. We recommend units contain no more than 3 components.',
      pacingTypeFilter: filters.ALL,
    },
  ],
};
