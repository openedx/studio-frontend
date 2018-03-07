import ASSET_TYPES from '../data/constants/assetTypeFilters';

export const getSelectedFilters = (filters) => {
  if (filters === null || filters === undefined) {
    return [];
  }
  return Object.keys(filters)
    .filter(type => filters[type] === true);
};

export const hasSelectedFilters = filters => (
  getSelectedFilters(filters).length > 0
);

export const getDefaultFilterState = () => (
  ASSET_TYPES
    .map(assetType => assetType.key)
    .reduce(
      // eslint-disable-next-line no-param-reassign
      ((memo, type) => { memo[type] = false; return memo; }),
      {},
    )
);

export const getFilterStateObjectFromArray = (enabledFilters) => {
  const filterState = getDefaultFilterState();

  enabledFilters.forEach((filter) => {
    filterState[filter] = true;
  });

  return filterState;
};

export const hasSearchOrFilterApplied = (filters, search) => (
  Boolean(hasSelectedFilters(filters) || (search && search.length > 0))
);
