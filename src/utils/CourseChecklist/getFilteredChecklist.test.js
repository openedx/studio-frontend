import { filters } from './courseChecklistData';
import getFilteredChecklist from './getFilteredChecklist';

const checklist = [
  {
    pacingTypeFilter: filters.ALL,
  },
  {
    pacingTypeFilter: filters.SELF_PACED,
  },
  {
    pacingTypeFilter: filters.INSTRUCTOR_PACED,
  },
  {
    pacingTypeFilter: filters.ALL,
  },
  {
    pacingTypeFilter: filters.SELF_PACED,
  },
];


describe('getFilteredChecklist utility function', () => {
  it('returns only checklist items with filters ALL and SELF_PACED when isSelfPaced is true', () => {
    const filteredChecklist = getFilteredChecklist(checklist, true);

    filteredChecklist.forEach(((
      item => expect(item.pacingTypeFilter === filters.ALL ||
        item.pacingTypeFilter === filters.SELF_PACED)
    )));

    expect(filteredChecklist.filter(item => item.pacingTypeFilter === filters.ALL).length)
      .toEqual(checklist.filter(item => item.pacingTypeFilter === filters.ALL).length);
    expect(filteredChecklist.filter(item => item.pacingTypeFilter === filters.SELF_PACED).length)
      .toEqual(checklist.filter(item => item.pacingTypeFilter === filters.SELF_PACED).length);
  });

  it('returns only checklist items with filters ALL and INSTRUCTOR_PACED when isSelfPaced is false', () => {
    const filteredChecklist = getFilteredChecklist(checklist, false);

    filteredChecklist.forEach(((
      item => expect(item.pacingTypeFilter === filters.ALL ||
        item.pacingTypeFilter === filters.INSTRUCTOR_PACED)
    )));

    expect(filteredChecklist.filter(item => item.pacingTypeFilter === filters.ALL).length)
      .toEqual(checklist.filter(item => item.pacingTypeFilter === filters.ALL).length);
    expect(filteredChecklist
      .filter(item => item.pacingTypeFilter === filters.INSTRUCTOR_PACED).length)
      .toEqual(checklist.filter(item => item.pacingTypeFilter === filters.INSTRUCTOR_PACED).length);
  });
});
