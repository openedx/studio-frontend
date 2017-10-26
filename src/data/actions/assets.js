import * as clientApi from '../../api/client';

export const assetActions = {
  REQUEST_ASSETS_SUCCESS: 'REQUEST_ASSETS_SUCCESS',
  FILTER_UPDATED: 'FILTER_UPDATED',
  SORT_UPDATE: 'SORT_UPDATED',
  DELETE_ASSET_SUCCESS: 'DELETE_ASSET_SUCCESS',
  ASSET_XHR_FAILURE: 'ASSET_XHR_FAILURE',
};

export const requestAssetsSuccess = response => ({
  type: assetActions.REQUEST_ASSETS_SUCCESS,
  data: response.assets,
});

export const getAssets = assetsParameters =>
  dispatch =>
    clientApi.requestAssets(assetsParameters.courseId, {
      page: assetsParameters.page,
      assetTypes: assetsParameters.assetTypes,
      sort: assetsParameters.sort,
      direction: assetsParameters.direction,
    })
      .then(response => response.json())
      .then(json => {
        // console.log(`json: `);
        // console.log(json);
        dispatch(requestAssetsSuccess(json));
      }
    );

export const filterUpdate = (filterKey, filterValue) => ({
  type: assetActions.FILTER_UPDATED,
  data: { [filterKey]: filterValue },
});

export const sortUpdate = (sort, direction) => ({
  type: assetActions.SORT_UPDATE,
  data: { sort, direction },
});

export const deleteAssetSuccess = assetId => ({
  type: assetActions.DELETE_ASSET_SUCCESS,
  assetId,
});

export const assetXHRFailure = (response, text) => ({
  type: assetActions.ASSET_XHR_FAILURE,
  response,
  text,
});

export const deleteAsset = (assetsParameters, assetId) =>
  dispatch =>
    clientApi.requestDeleteAsset(assetsParameters.courseId, assetId)
      .then((response) => {
        if (response.ok) {
          dispatch(deleteAssetSuccess(assetId));
        } else {
          dispatch(assetXHRFailure(response, 'File could not be deleted.'));
        }
      });
