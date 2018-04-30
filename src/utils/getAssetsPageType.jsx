import { assetActions } from '../data/constants/actionTypes';
import { hasSearchOrFilterApplied } from './getAssetsFilters';

export const pageTypes = {
  NO_ASSETS: 'noAssets',
  NO_RESULTS: 'noResults',
  NORMAL: 'normal',
  SKELETON: 'skeleton',
};

export const getPageType = (props, currentPageType) => {
  const numberOfAssets = props.assetsList.length;
  const filters = props.filtersMetadata.assetTypes;
  const search = props.searchMetadata.search;

  if ('type' in props.status && props.status.type === assetActions.request.REQUESTING_ASSETS) {
    return currentPageType;
  } else if (numberOfAssets > 0) {
    return pageTypes.NORMAL;
  } else if (numberOfAssets === 0 && hasSearchOrFilterApplied(filters, search)) {
    return pageTypes.NO_RESULTS;
  }
  return pageTypes.NO_ASSETS;
};
