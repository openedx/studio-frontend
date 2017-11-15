import * as clientApi from '../api/client';
import { assetActions } from '../constants/actionTypes';

export const requestAssetsSuccess = response => ({
  type: assetActions.REQUEST_ASSETS_SUCCESS,
  data: response.assets,
});

export const assetDeleteFailure = response => ({
  type: assetActions.DELETE_ASSET_FAILURE,
  response,
});

export const getAssets = (assetsParameters, courseDetails) =>
  dispatch =>
    clientApi.requestAssets(courseDetails.id, {
      page: assetsParameters.page,
      assetTypes: assetsParameters.assetTypes,
      sort: assetsParameters.sort,
      direction: assetsParameters.direction,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response);
      })
      .then(json => dispatch(requestAssetsSuccess(json)))
      .catch((error) => {
        dispatch(assetDeleteFailure(error));
      });

export const filterUpdate = (filterKey, filterValue) => ({
  type: assetActions.FILTER_UPDATED,
  data: { [filterKey]: filterValue },
});

export const sortUpdate = (sort, direction) => ({
  type: assetActions.SORT_UPDATE,
  data: { sort, direction },
});

export const deleteAssetSuccess = (assetId, response) => ({
  type: assetActions.DELETE_ASSET_SUCCESS,
  assetId,
  response,
});

export const deleteAsset = (assetId, courseDetails) =>
  dispatch =>
    clientApi.requestDeleteAsset(courseDetails.id, assetId)
      .then((response) => {
        if (response.ok) {
          dispatch(deleteAssetSuccess(assetId, response));
        } else {
          dispatch(assetDeleteFailure(response));
        }
      });

export const togglingLockAsset = (asset) => ({
  type: assetActions.TOGGLING_LOCK_ASSET_SUCCESS,
  asset,
});

export const toggleLockAssetSuccess = asset => ({
  type: assetActions.TOGGLE_LOCK_ASSET_SUCCESS,
  asset,
});

export const toggleLockAssetFailure = (asset, response) => ({
  type: assetActions.TOGGLING_LOCK_ASSET_FAILURE,
  asset,
  response,
});

export const toggleLockAsset = (asset, courseDetails) =>
  (dispatch) => {
    dispatch(togglingLockAsset(asset));
    clientApi.requestToggleLockAsset(courseDetails.id, asset)
      .then((response) => {
        if (response.ok) {
          dispatch(toggleLockAssetSuccess(asset));
        } else {
          dispatch(toggleLockAssetFailure(asset, response));
        }
      });
  };

export const clearAssetsStatus = () =>
  dispatch =>
    dispatch({ type: assetActions.CLEAR_ASSETS_STATUS });
