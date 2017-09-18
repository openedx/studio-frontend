import { getAssets } from '../../api/client';

export const REQUEST_ASSETS_SUCCESS = 'REQUEST_ASSETS_SUCCESS';
export const FILTER_UPDATED = 'FILTER_UPDATED';

export const requestAssetsSuccess = response => ({
  type: REQUEST_ASSETS_SUCCESS,
  data: response.assets,
});

export const requestAssets = assetsFilters =>
  dispatch =>
    getAssets(assetsFilters.courseId, {
      page: assetsFilters.page,
    })
      .then(response => response.json())
      .then(json => dispatch(requestAssetsSuccess(json)));

export const filterUpdate = (filterKey, filterValue) => ({
  type: FILTER_UPDATED,
  data: { [filterKey]: filterValue },
});
