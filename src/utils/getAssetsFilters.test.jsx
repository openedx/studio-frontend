import * as utilities from './getAssetsFilters';

describe('getAssetsFilters Utility Functions', () => {
  describe('getSelectedFilters', () => {
    it('returns selected filters', () => {
      const filters = {
        Images: true,
        Documents: true,
        Other: false,
      };
      const selectedFilters = utilities.getSelectedFilters(filters);
      const expectedSelectedFilters = ['Images', 'Documents'];

      expect(selectedFilters).toEqual(expectedSelectedFilters);
    });
    it('returns empty array on null filters', () => {
      const filters = null;
      const selectedFilters = utilities.getSelectedFilters(filters);
      const expectedSelectedFilters = [];

      expect(selectedFilters).toEqual(expectedSelectedFilters);
    });
    it('returns empty array on undefined filters', () => {
      const filters = undefined;
      const selectedFilters = utilities.getSelectedFilters(filters);
      const expectedSelectedFilters = [];

      expect(selectedFilters).toEqual(expectedSelectedFilters);
    });
  });
  describe('hasSelectedFilters', () => {
    it('returns true if filters are selected', () => {
      const filters = {
        Images: true,
        Documents: true,
        Other: false,
      };
      const hasSelectedFilters = utilities.hasSelectedFilters(filters);
      const expectedHasSelectedFilters = true;
      expect(hasSelectedFilters).toEqual(expectedHasSelectedFilters);
    });
    it('returns false if filters are not selected', () => {
      const filters = {
        Images: false,
        Documents: false,
        Other: false,
      };
      const hasSelectedFilters = utilities.hasSelectedFilters(filters);
      const expectedHasSelectedFilters = false;
      expect(hasSelectedFilters).toEqual(expectedHasSelectedFilters);
    });
  });
  describe('getDefaultFilterState', () => {
    it('returns correct default filter state', () => {
      const defaultFilterState = utilities.getDefaultFilterState();
      const expectedDefaultFilterState = {
        Audio: false,
        Code: false,
        Documents: false,
        Images: false,
        OTHER: false,
      };
      expect(defaultFilterState).toEqual(expectedDefaultFilterState);
    });
  });
  describe('getFilterStateObjectFromArray', () => {
    it('returns correct filter state object from array', () => {
      const filters = ['Images'];
      const filterStateObject = utilities.getFilterStateObjectFromArray(filters);
      const expectedfilterStateObject = {
        Audio: false,
        Code: false,
        Documents: false,
        Images: true,
        OTHER: false,
      };
      expect(filterStateObject).toEqual(expectedfilterStateObject);
    });
  });
});
