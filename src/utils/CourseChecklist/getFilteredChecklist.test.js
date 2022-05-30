import { filters } from './courseChecklistData';
import getFilteredChecklist from './getFilteredChecklist';

const checklist = [
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
  {
    id: 'weeklyHighlights',
    pacingTypeFilter: filters.SELF_PACED,
  },
  {
    id: 'proctoringEmail',
    pacingTypeFilter: filters.ALL,
  },
];

let courseData;
describe('getFilteredChecklist utility function', () => {
  beforeEach(() => {
    courseData = {
      isSelfPaced: true,
      hasCertificatesEnabled: true,
      hasHighlightsEnabled: true,
      needsProctoringEscalationEmail: true,
    };
  });
  it('returns only checklist items with filters ALL and SELF_PACED when isSelfPaced is true', () => {
    const filteredChecklist = getFilteredChecklist(
      checklist,
      courseData.isSelfPaced,
      courseData.hasCertificatesEnabled,
      courseData.hasHighlightsEnabled,
      courseData.needsProctoringEscalationEmail,
    );

    filteredChecklist.forEach(((
      item => expect(item.pacingTypeFilter === filters.ALL
        || item.pacingTypeFilter === filters.SELF_PACED)
    )));

    expect(filteredChecklist.filter(item => item.pacingTypeFilter === filters.ALL).length)
      .toEqual(checklist.filter(item => item.pacingTypeFilter === filters.ALL).length);
    expect(filteredChecklist.filter(item => item.pacingTypeFilter === filters.SELF_PACED).length)
      .toEqual(checklist.filter(item => item.pacingTypeFilter === filters.SELF_PACED).length);
  });

  it('returns only checklist items with filters ALL and INSTRUCTOR_PACED when isSelfPaced is false', () => {
    courseData.isSelfPaced = false;
    const filteredChecklist = getFilteredChecklist(
      checklist,
      courseData.isSelfPaced,
      courseData.hasCertificatesEnabled,
      courseData.hasHighlightsEnabled,
      courseData.needsProctoringEscalationEmail,
    );

    filteredChecklist.forEach(((
      item => expect(item.pacingTypeFilter === filters.ALL
        || item.pacingTypeFilter === filters.INSTRUCTOR_PACED)
    )));

    expect(filteredChecklist.filter(item => item.pacingTypeFilter === filters.ALL).length)
      .toEqual(checklist.filter(item => item.pacingTypeFilter === filters.ALL).length);
    expect(filteredChecklist
      .filter(item => item.pacingTypeFilter === filters.INSTRUCTOR_PACED).length)
      .toEqual(checklist.filter(item => item.pacingTypeFilter === filters.INSTRUCTOR_PACED).length);
  });

  it('excludes certificates when they are disabled', () => {
    let filteredChecklist = getFilteredChecklist(
      checklist,
      courseData.isSelfPaced,
      courseData.hasCertificatesEnabled,
      courseData.hasHighlightsEnabled,
      courseData.needsProctoringEscalationEmail,
    );
    expect(checklist.filter(item => item.id === 'certificate').length).toEqual(1);

    courseData.hasCertificatesEnabled = false;
    filteredChecklist = getFilteredChecklist(
      checklist,
      courseData.isSelfPaced,
      courseData.hasCertificatesEnabled,
      courseData.hasHighlightsEnabled,
      courseData.needsProctoringEscalationEmail,
    );
    expect(filteredChecklist.filter(item => item.id === 'certificate').length).toEqual(0);
  });

  it('excludes weekly highlights when they are disabled', () => {
    let filteredChecklist = getFilteredChecklist(
      checklist,
      courseData.isSelfPaced,
      courseData.hasCertificatesEnabled,
      courseData.hasHighlightsEnabled,
      courseData.needsProctoringEscalationEmail,
    );
    expect(filteredChecklist.filter(item => item.id === 'weeklyHighlights').length).toEqual(1);

    courseData.hasHighlightsEnabled = false;
    filteredChecklist = getFilteredChecklist(
      checklist,
      courseData.isSelfPaced,
      courseData.hasCertificatesEnabled,
      courseData.hasHighlightsEnabled,
      courseData.needsProctoringEscalationEmail,
    );
    expect(filteredChecklist.filter(item => item.id === 'weeklyHighlights').length).toEqual(0);
  });

  it('excludes proctoring escalation email when not needed', () => {
    let filteredChecklist = getFilteredChecklist(
      checklist,
      courseData.isSelfPaced,
      courseData.hasCertificatesEnabled,
      courseData.hasHighlightsEnabled,
      courseData.needsProctoringEscalationEmail,
    );
    expect(filteredChecklist.filter(item => item.id === 'proctoringEmail').length).toEqual(1);

    courseData.needsProctoringEscalationEmail = false;
    filteredChecklist = getFilteredChecklist(
      checklist,
      courseData.isSelfPaced,
      courseData.hasCertificatesEnabled,
      courseData.hasHighlightsEnabled,
      courseData.needsProctoringEscalationEmail,
    );
    expect(filteredChecklist.filter(item => item.id === 'proctoringEmail').length).toEqual(0);
  });
});
